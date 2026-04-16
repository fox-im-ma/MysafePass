import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Box, Typography, Stack, Button } from '@mui/material';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms';
}

const policies = {
  privacy: {
    title: 'Politique de Confidentialité',
    content: [
      {
        heading: 'Introduction',
        text: "MySafePass s'engage à protéger votre vie privée. Cette Politique de Confidentialité explique comment nous collectons, utilisons, divulguons et sauvegardons vos informations.",
      },
      {
        heading: 'Informations que nous collectons',
        text: 'Nom d\'utilisateur et adresse email lors de l\'inscription, Données chiffrées de votre coffre-fort (stockées localement), Logs d\'accès et d\'audit, Informations techniques.',
      },
      {
        heading: 'Chiffrement et Sécurité',
        text: 'Tous les mots de passe et données sensibles sont chiffrés avec AES-256-GCM. Votre mot de passe maître n\'est jamais stocké.',
      },
      {
        heading: 'Utilisation des données',
        text: 'Nous utilisons vos informations pour fournir le service, vous authentifier, améliorer la sécurité et vous notifier des mises à jour importantes.',
      },
      {
        heading: 'Partage des données',
        text: 'Vos données ne sont jamais vendues ou partagées avec des tiers.',
      },
    ],
  },
  terms: {
    title: 'Conditions d\'Utilisation',
    content: [
      {
        heading: 'Acceptation des conditions',
        text: 'En utilisant MySafePass, vous acceptez d\'être lié par ces Conditions d\'Utilisation.',
      },
      {
        heading: 'Description du service',
        text: 'MySafePass est un gestionnaire de mots de passe sécurisé. Le service est fourni "tel quel" sans garantie d\'aucune sorte.',
      },
      {
        heading: 'Obligations de l\'utilisateur',
        text: 'Vous devez maintenir la confidentialité de votre mot de passe maître, ne pas partager votre compte, utiliser le service légalement et respecter les lois applicables.',
      },
      {
        heading: 'Responsabilité',
        text: 'Vous êtes responsable de l\'utilisation de votre compte. MySafePass ne peut pas récupérer les mots de passe perdus.',
      },
      {
        heading: 'Limitation de responsabilité',
        text: 'MySafePass ne sera pas responsable des dommages indirects résultant de l\'utilisation du service.',
      },
    ],
  },
};

export function PolicyModal({ isOpen, onClose, type }: PolicyModalProps) {
  const policy = policies[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
          >
            <div
              className="absolute inset-0 backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <Box
              className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl border border-white/10 overflow-hidden flex flex-col"
              style={{ backgroundColor: 'rgba(26, 26, 26, 0.96)' }}
              onClick={(event) => event.stopPropagation()}
            >
              {/* Header */}
              <Box
                sx={{
                  flexShrink: 0,
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  px: 6,
                  pt: 5,
                  pb: 4,
                  position: 'relative',
                }}
              >
                <button
                  onClick={onClose}
                  className="absolute right-6 top-6 text-gray-400 transition-colors hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #0066CC 0%, #0052a3 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {policy.title}
                </Typography>
              </Box>

              {/* Contenu scrollable */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  px: 6,
                  py: 4,
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(0, 102, 204, 0.4)',
                    borderRadius: '3px',
                    '&:hover': {
                      background: 'rgba(0, 102, 204, 0.6)',
                    },
                  },
                }}
              >
                <Stack spacing={3}>
                  {policy.content.map((section, index) => (
                    <Box key={index}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: '#0066CC',
                          fontSize: '0.95rem',
                        }}
                      >
                        {section.heading}
                      </Typography>
                      <Typography
                        sx={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '0.875rem',
                          lineHeight: 1.6,
                        }}
                      >
                        {section.text}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Footer */}
              <Box
                sx={{
                  flexShrink: 0,
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  px: 6,
                  py: 4,
                  bgcolor: 'rgba(0, 0, 0, 0.2)',
                }}
              >
                <Button
                  fullWidth
                  onClick={onClose}
                  sx={{
                    background: 'linear-gradient(135deg, #0066CC 0%, #0052a3 100%)',
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.5,
                    '&:hover': {
                      opacity: 0.9,
                    },
                  }}
                >
                  Fermer
                </Button>
              </Box>
            </Box>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
