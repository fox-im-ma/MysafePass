import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, EyeOff, Check } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useVault } from '../context/VaultContext';

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

  useEffect(() => {
    if (!isOpen) return;
    setIsLogin(authRecord ? true : mode === 'login');
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
  }, [authRecord, isOpen, mode]);

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
        toast.error('Ajoute un username pour créer le coffre.');
        return;
      }
      if (!formData.email.trim()) {
        toast.error('Ajoute un email pour créer le coffre.');
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

      await setupVault(formData.username.trim(), formData.password);
      toast.success('Compte créé et coffre initialisé.');
      onClose();
      navigate('/dashboard');
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
              className="relative w-full max-w-md rounded-3xl border border-white/10 p-8"
              style={{ backgroundColor: 'rgba(26, 26, 26, 0.96)' }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute right-6 top-6 text-gray-400 transition-colors hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-8 flex flex-col items-center">
                <div
                  className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: accentColor }}
                >
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
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
                <h2 className="mb-2 text-2xl font-bold text-white">
                  {isLogin ? 'Bon retour' : 'Rejoins MySafePass'}
                </h2>
                <p className="text-sm text-gray-400">
                  {isLogin ? 'Connecte-toi à ton coffre sécurisé' : 'Crée ton coffre sécurisé'}
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div>
                    <label className="mb-2 block text-sm text-gray-300">Username</label>
                    <input
                      type="text"
                      placeholder="ton_username"
                      value={formData.username}
                      onChange={(event) => setFormData({ ...formData, username: event.target.value })}
                      className="w-full rounded-xl border border-transparent bg-[#242424] px-4 py-3 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2"
                      style={{ ['--tw-ring-color' as string]: accentColor }}
                    />
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm text-gray-300">Email</label>
                  <input
                    type="email"
                    placeholder="ton@email.com"
                    value={formData.email}
                    onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                    className="w-full rounded-xl border border-transparent bg-[#242424] px-4 py-3 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2"
                    style={{ ['--tw-ring-color' as string]: accentColor }}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    {isLogin ? 'Mot de passe maître' : 'Master Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={formData.password}
                      onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                      className="w-full rounded-xl border border-transparent bg-[#242424] px-4 py-3 pr-12 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2"
                      style={{ ['--tw-ring-color' as string]: accentColor }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {!isLogin && formData.password.length > 0 && (
                    <div className="mt-2">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs text-gray-400">Robustesse du master password</span>
                        <span className="text-xs" style={{ color: passwordStrength.color }}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-gray-700">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(passwordStrength.level / 4) * 100}%` }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: passwordStrength.color }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Minimum requis: 12 caractères</p>
                    </div>
                  )}
                </div>

                {!isLogin && (
                  <div>
                    <label className="mb-2 block text-sm text-gray-300">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={formData.confirmPassword}
                        onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })}
                        className="w-full rounded-xl border border-transparent bg-[#242424] px-4 py-3 pr-12 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2"
                        style={{ ['--tw-ring-color' as string]: accentColor }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((current) => !current)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                      {formData.confirmPassword.length > 0 && (
                        <div className="absolute right-14 top-1/2 -translate-y-1/2">
                          {passwordsMatch ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {!isLogin && (
                  <div className="flex items-start gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms}
                      onChange={(event) => setAgreedToTerms(event.target.checked)}
                      className="mt-1 h-4 w-4 rounded"
                      style={{ accentColor }}
                    />
                    <label htmlFor="terms" className="text-sm leading-relaxed text-gray-400">
                      J'accepte la{' '}
                      <a href="#" className="underline transition-colors hover:text-white">
                        politique de confidentialité
                      </a>{' '}
                      et les{' '}
                      <a href="#" className="underline transition-colors hover:text-white">
                        conditions d'utilisation
                      </a>
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 w-full rounded-full py-3.5 font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ backgroundColor: accentColor }}
                >
                  {isLogin ? 'Se connecter' : "S'inscrire"}
                </button>

                {allowModeSwitch && (
                  <p className="mt-4 text-center text-sm text-gray-400">
                    {isLogin ? "Pas encore de compte ?" : 'Déjà un compte ?'}{' '}
                    <button
                      type="button"
                      onClick={() => setIsLogin((current) => !current)}
                      className="underline transition-colors hover:text-white"
                    >
                      {isLogin ? "S'inscrire" : 'Se connecter'}
                    </button>
                  </p>
                )}
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
