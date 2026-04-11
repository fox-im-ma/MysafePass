import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { AuthModal } from './components/AuthModal';

const themes = {
  blue: '#0066CC',
  purple: '#7B2FBE',
  green: '#00A86B',
};

const placeholderTexts = [
  'Générez un mot de passe fort...',
  'Gérez vos comptes en sécurité...',
  'Posez une question à votre vault...',
];

function App() {
  const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>('blue');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const accentColor = themes[currentTheme];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D0D0D', fontFamily: 'Inter, sans-serif' }}>
      {/* Navbar */}
      <nav className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: accentColor }}
          >
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
              <path
                d="M24 4L40 14V26C40 35 34 42 24 44C14 42 8 35 8 26V14L24 4Z"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M24 14V24M24 24V34M24 24H34M24 24H14"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
          <span className="text-xl font-bold text-white">MySafePass</span>
        </div>

        <div className="flex items-center gap-6">
          {/* Theme Switcher */}
          <div className="flex items-center gap-2">
            {(Object.keys(themes) as Array<keyof typeof themes>).map((theme) => (
              <motion.button
                key={theme}
                onClick={() => setCurrentTheme(theme)}
                className="w-6 h-6 rounded-full transition-all relative"
                style={{ backgroundColor: themes[theme] }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentTheme === theme && (
                  <motion.div
                    layoutId="theme-ring"
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: `2px solid ${themes[theme]}`,
                      outline: '2px solid rgba(255, 255, 255, 0.3)',
                      outlineOffset: '2px',
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
          >
            Se connecter
          </button>
          <motion.button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-6 py-2.5 rounded-full text-white text-sm font-medium"
            style={{ backgroundColor: accentColor }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Inscription gratuite
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-6 pt-24 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          <span className="text-2xl">✨</span>
          <span className="text-sm text-gray-300">Essai gratuit • Sécurité maximale</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-6xl md:text-7xl font-bold text-center mb-6 leading-tight"
        >
          <span className="text-white">MySafePass protège</span>
          <br />
          <span style={{ color: accentColor }}>vos mots de passe.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 text-lg md:text-xl text-center max-w-2xl mb-12"
        >
          Générez, gérez et discutez avec votre coffre-fort intelligent. Sécurité AES-256 + IA.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-3xl"
        >
          <div className="relative">
            <div
              className="w-full px-6 py-5 rounded-2xl flex items-center gap-4 transition-all duration-300"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <motion.input
                key={placeholderIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                type="text"
                placeholder={placeholderTexts[placeholderIndex]}
                className="flex-1 bg-transparent text-white text-lg placeholder-gray-500 focus:outline-none"
              />
              <motion.button
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: accentColor }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-4 mt-6 flex-wrap"
          >
            {[
              { icon: '🔐', label: 'Génération' },
              { icon: '🗂️', label: 'Gestion' },
              { icon: '💬', label: 'Conversation' },
            ].map((chip, index) => (
              <motion.div
                key={chip.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="px-5 py-2.5 rounded-full text-sm font-medium text-gray-300"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
                whileHover={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderColor: accentColor,
                }}
              >
                <span className="mr-2">{chip.icon}</span>
                {chip.label}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        accentColor={accentColor}
      />
    </div>
  );
}

export default App;
