import { Box, Container, Typography, Stack, Button } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function TermsOfService() {
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
              Conditions d'Utilisation
            </Typography>
          </Box>

          <Stack spacing={4}>
            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                Acceptation des conditions
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                En utilisant MySafePass, vous acceptez d'être lié par ces Conditions
                d'Utilisation.
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                Description du service
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                MySafePass est un gestionnaire de mots de passe sécurisé. Le service est
                fourni "tel quel" sans garantie d'aucune sorte.
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                Obligations de l'utilisateur
              </Typography>
              <ul style={{ color: 'rgba(255,255,255,0.7)' }}>
                <li>Maintenir la confidentialité de votre mot de passe maître</li>
                <li>Ne pas partager votre compte avec d'autres personnes</li>
                <li>Utiliser le service uniquement à des fins légales</li>
                <li>Ne pas tenter de contourner notre sécurité</li>
                <li>Respecter les lois applicables à votre juridiction</li>
              </ul>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                Responsabilité
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                Vous êtes responsable de l'utilisation de votre compte. MySafePass ne peut pas
                récupérer les mots de passe perdus.
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                Activités interdites
              </Typography>
              <ul style={{ color: 'rgba(255,255,255,0.7)' }}>
                <li>Utiliser le service pour stocker du contenu illégal</li>
                <li>Attaquer, hacker ou modifier le service</li>
                <li>Contourner les mesures de sécurité</li>
                <li>Vendre, louer ou transférer votre accès</li>
                <li>Utiliser le service pour du phishing ou de la fraude</li>
              </ul>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                Modifications du service
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                Nous nous réservons le droit de modifier ou d'interrompre le service à tout
                moment.
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                Limitation de responsabilité
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                MySafePass ne sera pas responsable des dommages indirects résultant de
                l'utilisation du service.
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                Résiliation
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                Nous pouvons résilier votre accès au service si vous violez ces conditions.
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                Juridiction
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                Ces conditions sont régies par les lois de la France.
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                Modifications des conditions
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                Nous réservons le droit de modifier ces conditions à tout moment. Votre
                utilisation continue du service constitue votre acceptation des modifications.
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
