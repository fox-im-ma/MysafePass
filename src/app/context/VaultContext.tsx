import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  AuditEvent,
  VaultEntry,
  VaultSnapshot,
  SESSION_TIMEOUT_MS,
  SESSION_WARNING_MS,
  clearLegacyStorage,
  createAuditEvent,
  createAuthRecord,
  createEmptySnapshot,
  createEncryptedBackupExport,
  createEntryFromInput,
  createSeedEntries,
  decryptSnapshot,
  deriveEncryptionKey,
  deriveVerifierHash,
  encryptSnapshot,
  formatRelativeLockTime,
  getLockDurationMs,
  getSecuritySummary,
  loadAuthRecord,
  loadStoredVault,
  nowIso,
  registerFailedAttempt,
  resetFailedAttempts,
  saveAuthRecord,
  saveStoredVault,
  updateEntryWithAnalysis,
  type AuthRecord,
} from '../lib/vault';
import { PasswordAnalysis, PasswordOptions, analyzePasswordStrength, generateSecurePassword } from '../lib/password-tools';

type VaultStatus = 'loading' | 'new' | 'locked' | 'unlocked';

interface CreateEntryInput {
  service: string;
  username: string;
  password: string;
  url?: string;
  category?: string;
  tags?: string[];
  notes?: string;
}

interface VaultContextValue {
  status: VaultStatus;
  isReady: boolean;
  profileName: string;
  entries: VaultEntry[];
  auditTrail: AuditEvent[];
  authRecord: AuthRecord | null;
  sessionExpiresAt: number | null;
  sessionWarning: boolean;
  lockMessage: string | null;
  securitySummary: ReturnType<typeof getSecuritySummary>;
  setupVault: (profileName: string, password: string) => Promise<void>;
  unlockVault: (password: string) => Promise<{ ok: boolean; error?: string }>;
  lockVault: (message?: string) => void;
  addEntry: (input: CreateEntryInput) => Promise<void>;
  updateEntry: (id: string, updates: Partial<VaultEntry>, actionLabel?: string) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  recordEntryAccess: (id: string, message: string) => Promise<void>;
  exportEncryptedBackup: () => string;
  createPassword: (options: PasswordOptions) => string;
  analyzePassword: (password: string, options?: Partial<PasswordOptions>) => PasswordAnalysis;
}

const VaultContext = createContext<VaultContextValue | null>(null);

export function VaultProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<VaultStatus>('loading');
  const [profileName, setProfileName] = useState('');
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>([]);
  const [authRecord, setAuthRecord] = useState<AuthRecord | null>(null);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(null);
  const [lockMessage, setLockMessage] = useState<string | null>(null);
  const keyRef = useRef<CryptoKey | null>(null);

  const persistSnapshot = useCallback(
    async (nextEntries: VaultEntry[], nextAuditTrail: AuditEvent[]) => {
      if (!keyRef.current) return;

      const snapshot: VaultSnapshot = {
        entries: nextEntries,
        auditTrail: nextAuditTrail,
        preferences: {
          language: 'fr',
        },
      };
      const encrypted = await encryptSnapshot(snapshot, keyRef.current);
      saveStoredVault(encrypted);
      setEntries(nextEntries);
      setAuditTrail(nextAuditTrail);
    },
    []
  );

  const appendAudit = useCallback(
    async (event: AuditEvent, nextEntries = entries) => {
      const nextAuditTrail = [event, ...auditTrail].slice(0, 80);
      await persistSnapshot(nextEntries, nextAuditTrail);
    },
    [auditTrail, entries, persistSnapshot]
  );

  const resetSessionTimer = useCallback(() => {
    if (status !== 'unlocked') return;
    setSessionExpiresAt(Date.now() + SESSION_TIMEOUT_MS);
  }, [status]);

  const lockVault = useCallback((message?: string) => {
    keyRef.current = null;
    setEntries([]);
    setAuditTrail([]);
    setSessionExpiresAt(null);
    setStatus(loadAuthRecord() ? 'locked' : 'new');
    setLockMessage(message || null);
  }, []);

  useEffect(() => {
    const auth = loadAuthRecord();
    setAuthRecord(auth);
    setProfileName(auth?.profileName || '');
    setStatus(auth ? 'locked' : 'new');
  }, []);

  useEffect(() => {
    if (status !== 'unlocked') return;

    const listener = () => resetSessionTimer();
    const events: Array<keyof WindowEventMap> = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    events.forEach((eventName) => window.addEventListener(eventName, listener, { passive: true }));

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, listener));
    };
  }, [resetSessionTimer, status]);

  useEffect(() => {
    if (status !== 'unlocked' || !sessionExpiresAt) return;

    const interval = window.setInterval(() => {
      if (Date.now() >= sessionExpiresAt) {
        lockVault('Session expirée après inactivité.');
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [lockVault, sessionExpiresAt, status]);

  const setupVault = useCallback(async (nextProfileName: string, password: string) => {
    const auth = await createAuthRecord(nextProfileName, password);
    const key = await deriveEncryptionKey(password, auth.encryptionSalt);
    keyRef.current = key;

    const snapshot = createEmptySnapshot();
    snapshot.entries = createSeedEntries();
    snapshot.auditTrail = [
      createAuditEvent('setup', 'Coffre initialisé avec un mot de passe maître.', 'info'),
      ...(snapshot.entries.length > 0
        ? [createAuditEvent('migration', 'Anciennes entrées locales migrées vers le coffre chiffré.', 'warning')]
        : []),
    ];

    saveAuthRecord(auth);
    saveStoredVault(await encryptSnapshot(snapshot, key));
    clearLegacyStorage();

    setAuthRecord(auth);
    setProfileName(nextProfileName);
    setEntries(snapshot.entries);
    setAuditTrail(snapshot.auditTrail);
    setStatus('unlocked');
    setLockMessage(null);
    setSessionExpiresAt(Date.now() + SESSION_TIMEOUT_MS);
  }, []);

  const unlockVault = useCallback(async (password: string) => {
    const auth = loadAuthRecord();
    if (!auth) {
      return { ok: false, error: 'Aucun coffre n’est initialisé.' };
    }

    if (auth.lockUntil && auth.lockUntil > Date.now()) {
      return {
        ok: false,
        error: `Accès temporairement bloqué pendant ${formatRelativeLockTime(auth.lockUntil)}.`,
      };
    }

    const verifier = await deriveVerifierHash(password, auth.verifierSalt);
    if (verifier !== auth.verifierHash) {
      const failedAuth = registerFailedAttempt(auth);
      saveAuthRecord(failedAuth);
      setAuthRecord(failedAuth);
      return {
        ok: false,
        error: failedAuth.lockUntil
          ? `Mot de passe incorrect. Coffre bloqué pendant ${formatRelativeLockTime(failedAuth.lockUntil)}.`
          : 'Mot de passe maître incorrect.',
      };
    }

    const key = await deriveEncryptionKey(password, auth.encryptionSalt);
    const storedVault = loadStoredVault();
    const snapshot = storedVault ? await decryptSnapshot(storedVault, key) : createEmptySnapshot();
    const cleanedAuth = resetFailedAttempts(auth);
    saveAuthRecord(cleanedAuth);

    keyRef.current = key;
    setAuthRecord(cleanedAuth);
    setProfileName(cleanedAuth.profileName);
    setEntries(snapshot.entries);
    setAuditTrail(snapshot.auditTrail);
    setStatus('unlocked');
    setLockMessage(null);
    setSessionExpiresAt(Date.now() + SESSION_TIMEOUT_MS);

    const unlockEvent = createAuditEvent('auth.success', 'Déverrouillage du coffre réussi.', 'info');
    await appendAudit(unlockEvent, snapshot.entries);

    return { ok: true };
  }, [appendAudit]);

  const addEntry = useCallback(async (input: CreateEntryInput) => {
    const nextEntry = createEntryFromInput(input);
    const nextEntries = [nextEntry, ...entries];
    await appendAudit(createAuditEvent('entry.create', `Entrée ${nextEntry.service} ajoutée.`, 'info'), nextEntries);
  }, [appendAudit, entries]);

  const updateEntry = useCallback(async (id: string, updates: Partial<VaultEntry>, actionLabel = 'Entrée mise à jour') => {
    let updatedService = '';
    const nextEntries = entries.map((entry) => {
      if (entry.id !== id) return entry;
      updatedService = updates.service ?? entry.service;
      return updateEntryWithAnalysis(entry, updates, actionLabel);
    });

    await appendAudit(
      createAuditEvent('entry.update', `Entrée ${updatedService || id} mise à jour.`, 'info'),
      nextEntries
    );
  }, [appendAudit, entries]);

  const deleteEntry = useCallback(async (id: string) => {
    const entry = entries.find((item) => item.id === id);
    const nextEntries = entries.filter((item) => item.id !== id);
    await appendAudit(
      createAuditEvent('entry.delete', `Entrée ${entry?.service || id} supprimée définitivement.`, 'critical'),
      nextEntries
    );
  }, [appendAudit, entries]);

  const recordEntryAccess = useCallback(async (id: string, message: string) => {
    const nextEntries = entries.map((entry) =>
      entry.id === id
        ? {
            ...entry,
            lastAccessedAt: nowIso(),
          }
        : entry
    );
    await appendAudit(createAuditEvent('entry.access', message, 'warning'), nextEntries);
  }, [appendAudit, entries]);

  const securitySummary = useMemo(() => getSecuritySummary(entries), [entries]);

  const value = useMemo<VaultContextValue>(
    () => ({
      status,
      isReady: status !== 'loading',
      profileName,
      entries,
      auditTrail,
      authRecord,
      sessionExpiresAt,
      sessionWarning: status === 'unlocked' && !!sessionExpiresAt && sessionExpiresAt - Date.now() <= SESSION_WARNING_MS,
      lockMessage,
      securitySummary,
      setupVault,
      unlockVault,
      lockVault,
      addEntry,
      updateEntry,
      deleteEntry,
      recordEntryAccess,
      exportEncryptedBackup: createEncryptedBackupExport,
      createPassword: generateSecurePassword,
      analyzePassword: analyzePasswordStrength,
    }),
    [
      addEntry,
      auditTrail,
      authRecord,
      deleteEntry,
      entries,
      lockMessage,
      lockVault,
      profileName,
      recordEntryAccess,
      securitySummary,
      sessionExpiresAt,
      setupVault,
      status,
      unlockVault,
      updateEntry,
    ]
  );

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
}

export function useVault() {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within a VaultProvider');
  }

  return context;
}

export function getRemainingAttempts(authRecord: AuthRecord | null) {
  if (!authRecord) return 3;
  return Math.max(0, 3 - authRecord.failedAttempts);
}

export function getCaptchaRequired(authRecord: AuthRecord | null) {
  return !!authRecord && authRecord.failedAttempts >= 2;
}

export function getCurrentLockMessage(authRecord: AuthRecord | null) {
  if (!authRecord?.lockUntil || authRecord.lockUntil <= Date.now()) return null;
  return `Accès bloqué pour ${formatRelativeLockTime(authRecord.lockUntil)}.`;
}

export function getSupportingSecurityCopy(authRecord: AuthRecord | null) {
  if (!authRecord) return 'Longueur minimale recommandée: 12 caractères.';
  const nextLockThreshold = getLockDurationMs(authRecord.failedAttempts + 1);
  if (!nextLockThreshold) {
    return `Tentatives restantes avant blocage temporaire: ${getRemainingAttempts(authRecord)}.`;
  }
  return `Prochain échec: blocage temporaire activé.`;
}
