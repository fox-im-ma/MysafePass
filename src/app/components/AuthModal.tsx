import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, EyeOff, Check } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useVault } from '../context/VaultContext';
import { apiClient } from '../lib/api';
import { PolicyModal } from './PolicyModal';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'signup';
  onClose: () => void;
  accentColor: string;
}

function getPasswordStrength(password: string) {
  const checks = [/[a-z]/.test(password), /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)];
  const fulfilledChecks = checks.filter(Boolean).length;

  if (password.length === 0) return { level: 0, label: '', color: '#374151' };
  if (password.length < 12) return { level: 1, label: 'Trop court', color: '#ef4444' };
  if (fulfilledChecks <= 2) return { level: 2, label: 'Moyen', color: '#f97316' };
  if (password.length < 16) return { level: 3, label: 'Fort', color: '#eab308' };
  return { level: 4, label: 'Très fort', color: '#22c55e' };
}

export function AuthModal({ isOpen, mode, onClose, accentColor }: AuthModalProps) {
  const navigate = useNavigate();
  const { authRecord, setupVault, unlockVault } = useVault();
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setIsLogin(mode === 'login');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsSubmitting(false);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setAgreedToTerms(false);
  }, [isOpen, mode]);

  const passwordStrength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;
  const isMasterPasswordValid = formData.password.length >= 12;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const result = await unlockVault(formData.password);
        if (!result.ok) {
          toast.error(result.error || 'Connexion impossible.');
          return;
        }

        toast.success('Coffre déverrouillé.');
        onClose();
        navigate('/dashboard');
        return;
      }

      if (authRecord) {
        toast.error('Un coffre existe déjà sur cet appareil. Utilise la connexion.');
        return;
      }
      if (!formData.username.trim()) {
        toast.error('Ajoute un username pour créer le compte.');
        return;
      }
      if (!formData.email.trim()) {
        toast.error('Ajoute un email pour créer le compte.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Veuillez entrer une adresse email valide.');
        return;
      }

      if (!isMasterPasswordValid) {
        toast.error('Le mot de passe maître doit faire au moins 12 caractères.');
        return;
      }
      if (!passwordsMatch) {
        toast.error('La confirmation du mot de passe ne correspond pas.');
        return;
      }
      if (!agreedToTerms) {
        toast.error('Tu dois accepter la politique de confidentialité et les conditions d’utilisation.');
        return;
      }

      // 1. Enregistrer au backend
      const backendResponse = await apiClient.register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (!backendResponse.success) {
        toast.error(backendResponse.error || 'Erreur lors de l\'inscription au backend.');
        return;
      }

      // 2. Créer le coffre sécurisé localement
      await setupVault(formData.username.trim(), formData.password);
      
      toast.success('Compte créé et coffre initialisé avec succès!');
      onClose();
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const allowModeSwitch = !authRecord;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            onClick={onClose}
          >
            <div
              className="absolute inset-0 backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="relative w-full max-w-md max-h-[90vh] rounded-3xl border border-white/10 overflow-hidden flex flex-col"
              style={{ backgroundColor: 'rgba(26, 26, 26, 0.96)' }}
              onClick={(event) => event.stopPropagation()}
            >
              {/* Header fixe */}
              <div className="flex-shrink-0 border-b border-white/5 px-8 pt-6 pb-4">
                <button
                  onClick={onClose}
                  className="absolute right-6 top-6 text-gray-400 transition-colors hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col items-center">
                  <div
                    className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: accentColor }}
                  >
                    <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                      <path
                        d="M24 4L40 14V26C40 35 34 42 24 44C14 42 8 35 8 26V14L24 4Z"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                      <path
                        d="M24 14V24M24 24V34M24 24H34M24 24H14"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <h2 className="mb-1 text-xl font-bold text-white">
                    {isLogin ? 'Bon retour' : 'Rejoins MySafePass'}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {isLogin ? 'Connecte-toi à ton coffre' : 'Crée ton coffre sécurisé'}
                  </p>
                </div>
              </div>

              {/* Contenu scrollable */}
              <div className="flex-1 overflow-y-auto px-8 py-4">
                <form className="space-y-3" onSubmit={handleSubmit}>
                  {!isLogin && (
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-300">Username</label>
                      <input
                        type="text"
                        placeholder="ton_username"
                        value={formData.username}
                        onChange={(event) => setFormData({ ...formData, username: event.target.value })}
                        className="w-full rounded-lg border border-transparent bg-[#242424] px-3 py-2.5 text-sm text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2"
                        style={{ ['--tw-ring-color' as string]: accentColor }}
                      />
                    </div>
                  )}

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-300">Email</label>
                    <input
                      type="email"
                      placeholder="ton@email.com"
                      value={formData.email}
                      onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                      className="w-full rounded-lg border border-transparent bg-[#242424] px-3 py-2.5 text-sm text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2"
                      style={{ ['--tw-ring-color' as string]: accentColor }}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-300">
                      {isLogin ? 'Mot de passe maître' : 'Master Password'}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={formData.password}
                        onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                        className="w-full rounded-lg border border-transparent bg-[#242424] px-3 py-2.5 pr-10 text-sm text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2"
                        style={{ ['--tw-ring-color' as string]: accentColor }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {!isLogin && formData.password.length > 0 && (
                      <div className="mt-1.5">
                        <div className="mb-0.5 flex items-center justify-between">
                          <span className="text-xs text-gray-400">Robustesse</span>
                          <span className="text-xs" style={{ color: passwordStrength.color }}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full bg-gray-700">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(passwordStrength.level / 4) * 100}%` }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: passwordStrength.color }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {!isLogin && (
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-300">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••••••"
                          value={formData.confirmPassword}
                          onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })}
                          className="w-full rounded-lg border border-transparent bg-[#242424] px-3 py-2.5 pr-10 text-sm text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2"
                          style={{ ['--tw-ring-color' as string]: accentColor }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((current) => !current)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-white"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        {formData.confirmPassword.length > 0 && (
                          <div className="absolute right-12 top-1/2 -translate-y-1/2">
                            {passwordsMatch ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {!isLogin && (
                    <div className="flex items-start gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreedToTerms}
                        onChange={(event) => setAgreedToTerms(event.target.checked)}
                        className="mt-1 h-3.5 w-3.5 rounded flex-shrink-0"
                        style={{ accentColor }}
                      />
                      <label htmlFor="terms" className="text-xs leading-relaxed text-gray-400">
                        J'accepte la{' '}
                        <button
                          type="button"
                          onClick={() => setShowPrivacyModal(true)}
                          className="underline transition-colors hover:text-white"
                        >
                          politique de confidentialité
                        </button>{' '}
                        et les{' '}
                        <button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="underline transition-colors hover:text-white"
                        >
                          conditions d'utilisation
                        </button>
                      </label>
                    </div>
                  )}
                </form>
              </div>

              {/* Footer bouton fixe */}
              <div className="flex-shrink-0 border-t border-white/5 px-8 py-4 bg-black/20">
                <form onSubmit={handleSubmit}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ backgroundColor: accentColor }}
                  >
                    {isLogin ? 'Se connecter' : "S'inscrire"}
                  </button>

                  {!isLogin && (
                    <p className="mt-3 text-center text-xs text-gray-400">
                      Déjà un compte?{' '}
                      <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className="underline transition-colors hover:text-white"
                      >
                        Se connecter
                      </button>
                    </p>
                  )}

                  {isLogin && (
                    <p className="mt-3 text-center text-xs text-gray-400">
                      Pas encore de compte?{' '}
                      <button
                        type="button"
                        onClick={() => setIsLogin(false)}
                        className="underline transition-colors hover:text-white"
                      >
                        S'inscrire
                      </button>
                    </p>
                  )}
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}

      <PolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        type="privacy"
      />
      <PolicyModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        type="terms"
      />
    </AnimatePresence>
  );
}
