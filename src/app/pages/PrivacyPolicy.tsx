import { Box, Container, Typography, Stack, Button } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #07111f 0%, #0a1929 100%)',
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => navigate(-1)}
          sx={{
            color: '#0066CC',
            textTransform: 'none',
            mb: 4,
            '&:hover': { bgcolor: 'rgba(0,102,204,0.1)' },
          }}
        >
          Retour
        </Button>

        <Box
          sx={{
            background: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3,
            p: 6,
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #0066CC 0%, #0052a3 100%)',
              borderRadius: 2,
              p: 3,
              mb: 4,
            }}
          >
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
              Politique de Confidentialité
            </Typography>
          </Box>

          <Stack spacing={4}>
            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                Introduction
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                MySafePass s'engage à protéger votre vie privée. Cette Politique de
                Confidentialité explique comment nous collectons, utilisons, divulguons et
                sauvegardons vos informations.
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                Informations que nous collectons
              </Typography>
              <ul style={{ color: 'rgba(255,255,255,0.7)' }}>
                <li>Nom d'utilisateur et adresse email lors de l'inscription</li>
                <li>Données chiffrées de votre coffre-fort (stockées localement)</li>
                <li>Logs d'accès et d'audit (stockés localement)</li>
                <li>Informations techniques (navigateur, adresse IP pour les connexions)</li>
              </ul>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                Chiffrement et Sécurité
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                Tous les mots de passe et données sensibles sont chiffrés avec AES-256-GCM.
                Votre mot de passe maître n'est jamais stocké.
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                Utilisation des données
              </Typography>
              <ul style={{ color: 'rgba(255,255,255,0.7)' }}>
                <li>Fournir et maintenir notre service</li>
                <li>Authentifier votre compte de manière sécurisée</li>
                <li>Améliorer notre sécurité et nos fonctionnalités</li>
                <li>Vous notifier des mises à jour de sécurité importantes</li>
              </ul>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                Partage des données
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                Vos données ne sont jamais vendues ou partagées avec des tiers.
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                Stockage local
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                Vos données de coffre-fort sont stockées en local sur votre appareil. Vous
                avez le contrôle complet de vos données.
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                Modifications
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                Nous nous réservons le droit de modifier cette politique à tout moment. Les
                modifications majeures seront notifiées.
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                Contact
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                Pour toute question concernant cette politique, contactez-nous à :
                privacy@mysafepass.com
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
