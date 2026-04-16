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
            Politique de Confidentialité
          </Typography>

          <Stack spacing={3}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                1. Introduction
              </Typography>
              <Typography color="text.secondary">
                MySafePass ("nous", "nos", "notre") s'engage à protéger votre vie privée. Cette Politique de Confidentialité explique comment nous collectons, utilisons, divulguons et sauvegardons vos informations.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                2. Informations que nous collectons
              </Typography>
              <Typography color="text.secondary" component="div">
                <ul>
                  <li>Nom d'utilisateur et adresse email lors de l'inscription</li>
                  <li>Données chiffrées de votre coffre-fort (stockées localement)</li>
                  <li>Logs d'accès et d'audit (stockés localement)</li>
                  <li>Informations techniques (navigateur, adresse IP pour les connexions)</li>
                </ul>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                3. Chiffrement et Sécurité
              </Typography>
              <Typography color="text.secondary">
                Tous les mots de passe et données sensibles sont chiffrés avec AES-256-GCM. Votre mot de passe maître n'est jamais stocké - il ne peut pas être récupéré une fois perdu. Nous utilisons Argon2id pour le hachage sécurisé.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                4. Utilisation des données
              </Typography>
              <Typography color="text.secondary" component="div">
                Nous utilisons vos informations pour:
                <ul>
                  <li>Fournir et maintenir notre service</li>
                  <li>Authentifier votre compte de manière sécurisée</li>
                  <li>Améliorer notre sécurité et nos fonctionnalités</li>
                  <li>Vous notifier des mises à jour de sécurité importantes</li>
                </ul>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                5. Partage des données
              </Typography>
              <Typography color="text.secondary">
                Vos données ne sont jamais vendues, louées ou partagées avec des tiers. Nous ne partageons que les informations minimales nécessaires avec nos fournisseurs d'infrastructure de confiance.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                6. Stockage local
              </Typography>
              <Typography color="text.secondary">
                La majorité de vos données est stockée localement dans votre navigateur. Notre backend ne conserve que les données minimales nécessaires à l'authentification et la synchronisation.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                7. Modification de cette politique
              </Typography>
              <Typography color="text.secondary">
                Nous pouvons mettre à jour cette politique de temps en temps. Nous vous notifierons de tout changement par email ou via une notification sur le service.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                8. Contact
              </Typography>
              <Typography color="text.secondary">
                Pour toute question concernant cette politique, veuillez nous contacter à: legal@mysafepass.fr
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
