import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Alert, Box, Button, Card, Container, Stack, TextField, Typography } from '@mui/material';
import { Lock, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import {
  getCaptchaRequired,
  getCurrentLockMessage,
  getRemainingAttempts,
  getSupportingSecurityCopy,
  useVault,
} from '../context/VaultContext';

function passwordLooksStrong(password: string) {
  const checks = [/[a-z]/.test(password), /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)];
  return password.length >= 12 && checks.filter(Boolean).length >= 3;
}

function generateCaptcha() {
  const a = Math.floor(Math.random() * 8) + 2;
  const b = Math.floor(Math.random() * 8) + 1;
  return {
    label: `${a} + ${b}`,
    answer: String(a + b),
  };
}

export default function Login() {
  const navigate = useNavigate();
  const { status, authRecord, profileName, setupVault, unlockVault, lockMessage } = useVault();
  const [setupName, setSetupName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const isSetupMode = status === 'new';
  const requiresCaptcha = getCaptchaRequired(authRecord);
  const lockStatusMessage = useMemo(() => getCurrentLockMessage(authRecord), [authRecord]);

  useEffect(() => {
    if (status === 'unlocked') {
      navigate('/dashboard');
    }
  }, [navigate, status]);

  useEffect(() => {
    if (requiresCaptcha) {
      setCaptcha(generateCaptcha());
      setCaptchaValue('');
    }
  }, [requiresCaptcha]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isSetupMode) {
      if (!setupName.trim()) {
        toast.error('Ajoute un prénom ou un nom de profil pour initialiser le coffre.');
        return;
      }
      if (password !== confirmPassword) {
        toast.error('La confirmation du mot de passe ne correspond pas.');
        return;
      }
      if (!passwordLooksStrong(password)) {
        toast.error('Le mot de passe maître doit contenir 12 caractères minimum et 3 types de caractères.');
        return;
      }

      await setupVault(setupName.trim(), password);
      toast.success('Coffre initialisé et chiffré localement.');
      navigate('/dashboard');
      return;
    }

    if (requiresCaptcha && captchaValue.trim() !== captcha.answer) {
      toast.error('CAPTCHA incorrect.');
      setCaptcha(generateCaptcha());
      setCaptchaValue('');
      return;
    }

    const result = await unlockVault(password);
    if (!result.ok) {
      toast.error(result.error || 'Impossible de déverrouiller le coffre.');
      return;
    }

    toast.success('Coffre déverrouillé.');
    navigate('/dashboard');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #07111f 0%, #0a1929 100%)',
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            p: { xs: 4, md: 5 },
            bgcolor: 'rgba(15, 39, 64, 0.82)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(18px)',
          }}
        >
          <Stack spacing={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 82,
                  height: 82,
                  borderRadius: '24px',
                  bgcolor: '#0066CC',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  boxShadow: '0 20px 40px rgba(0,102,204,0.28)',
                }}
              >
                {isSetupMode ? <ShieldCheck size={40} color="white" /> : <Lock size={40} color="white" />}
              </Box>

              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {isSetupMode ? 'Initialiser MySafePass' : `Déverrouiller ${profileName || 'le coffre'}`}
              </Typography>
              <Typography color="text.secondary">
                {isSetupMode
                  ? 'Création du mot de passe maître, dérivation de clé locale et migration des anciennes entrées si elles existent.'
                  : 'Accès protégé avec limitation des tentatives et verrouillage temporaire.'}
              </Typography>
            </Box>

            {(lockStatusMessage || lockMessage) && <Alert severity="warning">{lockStatusMessage || lockMessage}</Alert>}

            <form onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                {isSetupMode && (
                  <TextField
                    fullWidth
                    label="Nom du profil"
                    placeholder="Ex. Roland"
                    value={setupName}
                    onChange={(event) => setSetupName(event.target.value)}
                  />
                )}

                <TextField
                  fullWidth
                  type="password"
                  label={isSetupMode ? 'Mot de passe maître' : 'Mot de passe maître'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />

                {isSetupMode && (
                  <TextField
                    fullWidth
                    type="password"
                    label="Confirmer le mot de passe maître"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                )}

                {requiresCaptcha && !isSetupMode && (
                  <TextField
                    fullWidth
                    label={`CAPTCHA: ${captcha.label}`}
                    placeholder="Résultat"
                    value={captchaValue}
                    onChange={(event) => setCaptchaValue(event.target.value)}
                  />
                )}

                <Alert severity={isSetupMode ? 'info' : 'warning'}>
                  {isSetupMode
                    ? 'Recommandation cahier des charges: minimum 12 caractères et au moins 3 catégories de caractères.'
                    : getSupportingSecurityCopy(authRecord)}
                </Alert>

                {!isSetupMode && authRecord && (
                  <Typography variant="body2" color="text.secondary">
                    Tentatives restantes avant blocage court: {getRemainingAttempts(authRecord)}
                  </Typography>
                )}

                <Button fullWidth variant="contained" size="large" type="submit" sx={{ py: 1.5, textTransform: 'none' }}>
                  {isSetupMode ? 'Créer et chiffrer le coffre' : 'Déverrouiller le coffre'}
                </Button>
              </Stack>
            </form>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}
