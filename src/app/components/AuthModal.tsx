import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, EyeOff, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor: string;
}

export function AuthModal({ isOpen, onClose, accentColor }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { level: 0, label: '', color: '' };
    if (password.length < 8) return { level: 1, label: 'Faible', color: '#ef4444' };
    if (password.length < 12) return { level: 2, label: 'Moyen', color: '#f97316' };
    if (password.length < 16) return { level: 3, label: 'Fort', color: '#eab308' };
    return { level: 4, label: 'Très fort', color: '#22c55e' };
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className="absolute inset-0 backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-md rounded-3xl p-8 pointer-events-auto relative"
              style={{ backgroundColor: '#1A1A1A' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center mb-8">
                <div
                  className="w-20 h-20 rounded-2xl mb-4 flex items-center justify-center"
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
                <h2 className="text-2xl font-bold text-white mb-2">
                  {isLogin ? 'Bon retour' : 'Rejoins MySafePass'}
                </h2>
                <p className="text-gray-400 text-sm">
                  {isLogin ? 'Connecte-toi à ton compte' : 'Inscris-toi pour commencer'}
                </p>
              </div>

              <form className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Prénom</label>
                    <input
                      type="text"
                      placeholder="Ton prénom"
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: '#242424',
                        borderWidth: '1px',
                        borderColor: 'transparent',
                        '--tw-ring-color': accentColor
                      } as any}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="ton@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: '#242424',
                      borderWidth: '1px',
                      borderColor: 'transparent',
                      '--tw-ring-color': accentColor
                    } as any}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    {isLogin ? 'Mot de passe' : 'Master Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all pr-12"
                      style={{
                        backgroundColor: '#242424',
                        borderWidth: '1px',
                        borderColor: 'transparent',
                        '--tw-ring-color': accentColor
                      } as any}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {!isLogin && formData.password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Force du mot de passe</span>
                        <span className="text-xs" style={{ color: passwordStrength.color }}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(passwordStrength.level / 4) * 100}%` }}
                          className="h-full rounded-full transition-all"
                          style={{ backgroundColor: passwordStrength.color }}
                        />
                      </div>
                      {formData.password.length < 12 && (
                        <p className="text-xs text-gray-500 mt-1">minimum 12 caractères</p>
                      )}
                    </div>
                  )}
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Confirmer Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all pr-12"
                        style={{
                          backgroundColor: '#242424',
                          borderWidth: '1px',
                          borderColor: 'transparent',
                          '--tw-ring-color': accentColor
                        } as any}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      {formData.confirmPassword.length > 0 && (
                        <div className="absolute right-14 top-1/2 -translate-y-1/2">
                          {passwordsMatch ? (
                            <Check className="w-5 h-5 text-green-500" />
                          ) : (
                            <X className="w-5 h-5 text-red-500" />
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
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded accent-current"
                      style={{ accentColor }}
                    />
                    <label htmlFor="terms" className="text-sm text-gray-400 leading-relaxed">
                      J'accepte la{' '}
                      <a href="#" className="underline hover:text-white transition-colors">
                        politique de confidentialité
                      </a>{' '}
                      et les{' '}
                      <a href="#" className="underline hover:text-white transition-colors">
                        conditions d'utilisation
                      </a>
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full text-white font-medium hover:opacity-90 transition-opacity mt-6"
                  style={{ backgroundColor: accentColor }}
                >
                  {isLogin ? 'Se connecter' : "S'inscrire"}
                </button>

                <p className="text-center text-sm text-gray-400 mt-4">
                  {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{' '}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="hover:text-white transition-colors underline"
                  >
                    {isLogin ? "S'inscrire" : 'Se connecter'}
                  </button>
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
