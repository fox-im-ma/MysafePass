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
            bgcolor: 'rgba(15, 39, 64, 0.5)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 3,
            p: 6,
            backdropFilter: 'blur(18px)',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 4,
              background: 'linear-gradient(135deg, #0066CC 0%, #0052a3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Conditions d'Utilisation
          </Typography>

          <Stack spacing={3}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                1. Acceptation des conditions
              </Typography>
              <Typography color="text.secondary">
                En accédant à MySafePass et en utilisant notre service, vous acceptez d'être lié par ces Conditions d'Utilisation. Si vous n'acceptez pas ces termes, veuillez ne pas utiliser le service.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                2. Description du service
              </Typography>
              <Typography color="text.secondary">
                MySafePass est un gestionnaire de mots de passe sécurisé offrant le chiffrement des données, la génération sécurisée de mots de passe et la gestion des accès aux comptes. Le service est fourni "tel quel" sans garantie d'aucune sorte.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                3. Obligations de l'utilisateur
              </Typography>
              <Typography color="text.secondary" component="div">
                <ul>
                  <li>Maintenir la confidentialité de votre mot de passe maître</li>
                  <li>Ne pas partager votre compte avec d'autres personnes</li>
                  <li>Utiliser le service uniquement à des fins légales</li>
                  <li>Ne pas tenter de contourner notre sécurité</li>
                  <li>Respecter les lois applicables à votre juridiction</li>
                </ul>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                4. Responsabilité de l'utilisateur
              </Typography>
              <Typography color="text.secondary">
                Vous êtes responsable de toute activation ou utilisation de votre compte. Si vous perdez votre mot de passe maître, nous ne pouvons pas le récupérer. Vous êtes responsable de maintenir des sauvegardes de vos données.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                5. Interdictions
              </Typography>
              <Typography color="text.secondary" component="div">
                Vous ne pouvez pas:
                <ul>
                  <li>Utiliser le service pour stocker du contenu illégal</li>
                  <li>Attaquer, hacker ou modifier le service</li>
                  <li>Contourner les mesures de sécurité</li>
                  <li>Vendre, louer ou transférer votre accès</li>
                  <li>Utiliser le service pour du phishing ou de la fraude</li>
                </ul>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                6. Modification du service
              </Typography>
              <Typography color="text.secondary">
                Nous nous réservons le droit de modifier ou interrompre le service à tout moment, avec ou sans préavis. Nous ne serons pas responsables de tout préjudice résultant de modifications ou d'interruption du service.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                7. Limitation de responsabilité
              </Typography>
              <Typography color="text.secondary">
                MySafePass ne sera pas responsable de tout dommage indirect, spécial, accidentel ou consécutif résultant de l'utilisation du service, y compris la perte de données ou les interruptions de service.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                8. Résiliation
              </Typography>
              <Typography color="text.secondary">
                Nous pouvons résilier votre compte à tout moment pour non-respect de ces conditions. Vous pouvez supprimer votre compte à tout moment en accédant à vos paramètres.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                9. Droit applicable
              </Typography>
              <Typography color="text.secondary">
                Ces conditions sont régies par les lois de la France. Tout litige sera résolu devant les tribunaux compétents.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                10. Modification des conditions
              </Typography>
              <Typography color="text.secondary">
                Nous pouvons mettre à jour ces conditions à tout moment. L'utilisation continue du service après les modifications constitue une acceptation des nouvelles conditions.
              </Typography>
            </Box>

            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}
            >
              Dernière mise à jour: 16 avril 2026
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
