import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  Slider,
  Stack,
  Switch,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { ArrowLeft, Copy, RefreshCw, Save, WandSparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useVault } from '../context/VaultContext';
import { analyzeServiceRisk } from '../lib/phishing';
import { getDefaultPasswordOptions, type PasswordOptions } from '../lib/password-tools';

export default function GeneratePassword() {
  const navigate = useNavigate();
  const { status, addEntry, analyzePassword, createPassword } = useVault();
  const defaults = getDefaultPasswordOptions();
  const [options, setOptions] = useState<PasswordOptions>(defaults);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [username, setUsername] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Personnel');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (status === 'locked' || status === 'new') {
      navigate('/auth');
    }
  }, [navigate, status]);

  useEffect(() => {
    setGeneratedPassword(createPassword(defaults));
  }, [createPassword]);

  const analysis = useMemo(() => analyzePassword(generatedPassword, options), [analyzePassword, generatedPassword, options]);
  const risk = useMemo(() => analyzeServiceRisk(serviceName, url), [serviceName, url]);

  const handleGenerate = () => {
    setGeneratedPassword(createPassword(options));
  };

  const handleSave = async () => {
    if (!serviceName.trim() || !generatedPassword) {
      toast.error('Service et mot de passe généré sont requis.');
      return;
    }

    await addEntry({
      service: serviceName,
      username,
      password: generatedPassword,
      url,
      category,
      tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      notes,
    });

    toast.success('Entrée ajoutée au coffre.');
    navigate('/dashboard');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#081421' }}>
      <AppBar position="static" sx={{ bgcolor: '#0f2740' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={22} />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Générateur conforme au MVP
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ p: 4, bgcolor: '#0f2740', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    Paramètres de génération
                  </Typography>
                  <Typography color="text.secondary">
                    Longueur 8-64, générée avec l’API Web Crypto et diversité imposée sur les types activés.
                  </Typography>
                </Box>

                <Box>
                  <Typography gutterBottom>Longueur: {options.length}</Typography>
                  <Slider
                    value={options.length}
                    onChange={(_, value) => setOptions((current) => ({ ...current, length: value as number }))}
                    min={8}
                    max={64}
                    step={1}
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={options.includeLowercase}
                          onChange={(event) => setOptions((current) => ({ ...current, includeLowercase: event.target.checked }))}
                        />
                      }
                      label="Minuscules"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={options.includeUppercase}
                          onChange={(event) => setOptions((current) => ({ ...current, includeUppercase: event.target.checked }))}
                        />
                      }
                      label="Majuscules"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={options.includeDigits}
                          onChange={(event) => setOptions((current) => ({ ...current, includeDigits: event.target.checked }))}
                        />
                      }
                      label="Chiffres"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={options.includeSymbols}
                          onChange={(event) => setOptions((current) => ({ ...current, includeSymbols: event.target.checked }))}
                        />
                      }
                      label="Symboles"
                    />
                  </Grid>
                </Grid>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button fullWidth variant="contained" startIcon={<RefreshCw size={18} />} onClick={handleGenerate}>
                    Générer
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Copy size={18} />}
                    onClick={() => {
                      navigator.clipboard.writeText(generatedPassword);
                      toast.success('Mot de passe copié.');
                    }}
                  >
                    Copier
                  </Button>
                </Stack>

                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: '#081421',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontFamily: 'monospace',
                    fontSize: '1.15rem',
                    wordBreak: 'break-all',
                  }}
                >
                  {generatedPassword}
                </Box>

                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <Chip label={`Score ${analysis.score}/100`} color={analysis.score >= 80 ? 'success' : analysis.score >= 60 ? 'warning' : 'error'} />
                  <Chip label={`${analysis.entropyBits} bits d’entropie`} />
                  <Chip label={`Crack estimé: ${analysis.crackTimeLabel}`} />
                </Stack>

                {analysis.warnings.length > 0 && (
                  <Alert severity="warning">{analysis.warnings.join(' ')}</Alert>
                )}
                <Alert severity="info">{analysis.recommendations.join(' ')}</Alert>
              </Stack>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ p: 4, bgcolor: '#0f2740', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Enregistrer dans le coffre
                  </Typography>
                  <Typography color="text.secondary">Ajout enrichi avec catégorie, tags, notes et contrôle de domaine.</Typography>
                </Box>

                <TextField fullWidth label="Service" value={serviceName} onChange={(event) => setServiceName(event.target.value)} />
                <TextField fullWidth label="Identifiant / email" value={username} onChange={(event) => setUsername(event.target.value)} />
                <TextField fullWidth label="URL du service" value={url} onChange={(event) => setUrl(event.target.value)} />
                <TextField fullWidth label="Catégorie" value={category} onChange={(event) => setCategory(event.target.value)} />
                <TextField fullWidth label="Tags (séparés par des virgules)" value={tags} onChange={(event) => setTags(event.target.value)} />
                <TextField fullWidth multiline minRows={3} label="Notes" value={notes} onChange={(event) => setNotes(event.target.value)} />

                {risk.warnings.length > 0 && (
                  <Alert severity={risk.level === 'high' ? 'error' : 'warning'}>
                    {risk.warnings.join(' ')}
                  </Alert>
                )}

                <Button fullWidth variant="contained" color="success" startIcon={<Save size={18} />} onClick={handleSave}>
                  Sauvegarder l’entrée
                </Button>
                <Button fullWidth variant="text" startIcon={<WandSparkles size={18} />} onClick={() => navigate('/assistant')}>
                  Demander conseil à l’assistant
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
