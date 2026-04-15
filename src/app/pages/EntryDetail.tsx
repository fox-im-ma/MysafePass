import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { ArrowLeft, Copy, Eye, EyeOff, RefreshCw, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useVault } from '../context/VaultContext';
import { getDefaultPasswordOptions } from '../lib/password-tools';

export default function EntryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { status, entries, updateEntry, deleteEntry, recordEntryAccess, createPassword } = useVault();
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmValue, setDeleteConfirmValue] = useState('');
  const entry = useMemo(() => entries.find((item) => item.id === id) || null, [entries, id]);
  const [formData, setFormData] = useState({
    service: '',
    username: '',
    password: '',
    url: '',
    category: '',
    tags: '',
    notes: '',
  });

  useEffect(() => {
    if (status === 'locked' || status === 'new') {
      navigate('/auth');
    }
  }, [navigate, status]);

  useEffect(() => {
    if (!entry) return;
    setFormData({
      service: entry.service,
      username: entry.username,
      password: entry.password,
      url: entry.url,
      category: entry.category,
      tags: entry.tags.join(', '),
      notes: entry.notes,
    });
  }, [entry]);

  if (!entry) {
    return null;
  }

  const handleSave = async () => {
    await updateEntry(entry.id, {
      service: formData.service,
      username: formData.username,
      password: formData.password,
      url: formData.url,
      category: formData.category,
      tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      notes: formData.notes,
    });
    toast.success('Entrée mise à jour.');
    setIsEditing(false);
  };

  const handleReveal = async () => {
    setShowPassword((current) => !current);
    await recordEntryAccess(entry.id, `Révélation manuelle du mot de passe pour ${entry.service}.`);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#081421' }}>
      <AppBar position="static" sx={{ bgcolor: '#0f2740' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={22} />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            {entry.service}
          </Typography>
          {!isEditing && (
            <Button color="inherit" onClick={() => setIsEditing(true)}>
              Modifier
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ p: 4, bgcolor: '#0f2740', border: '1px solid rgba(255,255,255,0.06)' }}>
              {!isEditing ? (
                <Stack spacing={3}>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    <Chip label={entry.category} />
                    <Chip color={entry.passwordScore >= 80 ? 'success' : entry.passwordScore >= 60 ? 'warning' : 'error'} label={`${entry.passwordScore}/100`} />
                    <Chip label={`${entry.entropyBits} bits`} />
                    {entry.tags.map((tag) => (
                      <Chip key={tag} label={tag} variant="outlined" />
                    ))}
                  </Stack>

                  <Grid container spacing={2}>
                    {[
                      ['Identifiant', entry.username || 'Non renseigné'],
                      ['URL', entry.url || 'Non renseignée'],
                      ['Créée le', new Date(entry.createdAt).toLocaleString()],
                      ['Dernière modification', new Date(entry.updatedAt).toLocaleString()],
                      ['Dernier accès', entry.lastAccessedAt ? new Date(entry.lastAccessedAt).toLocaleString() : 'Jamais'],
                    ].map(([label, value]) => (
                      <Grid key={label} size={{ xs: 12, sm: 6 }}>
                        <Typography color="text.secondary" variant="body2">
                          {label}
                        </Typography>
                        <Typography>{value}</Typography>
                      </Grid>
                    ))}
                  </Grid>

                  <Box>
                    <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                      Mot de passe
                    </Typography>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          flex: 1,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: '#081421',
                          fontFamily: 'monospace',
                          wordBreak: 'break-all',
                        }}
                      >
                        {showPassword ? entry.password : '••••••••••••••••'}
                      </Box>
                      <IconButton color="primary" onClick={handleReveal}>
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={async () => {
                          await navigator.clipboard.writeText(entry.password);
                          await recordEntryAccess(entry.id, `Copie du mot de passe pour ${entry.service}.`);
                          toast.success('Mot de passe copié.');
                        }}
                      >
                        <Copy size={20} />
                      </IconButton>
                    </Stack>
                  </Box>

                  {entry.domainWarnings.length > 0 && (
                    <Alert severity="warning">{entry.domainWarnings.join(' ')}</Alert>
                  )}
                  {entry.passwordWarnings.length > 0 && (
                    <Alert severity="warning">{entry.passwordWarnings.join(' ')}</Alert>
                  )}
                  {entry.notes && <Alert severity="info">{entry.notes}</Alert>}

                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<Trash2 size={18} />}
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Supprimer définitivement
                  </Button>
                </Stack>
              ) : (
                <Stack spacing={2.5}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Modifier l’entrée
                  </Typography>
                  <TextField label="Service" value={formData.service} onChange={(event) => setFormData((current) => ({ ...current, service: event.target.value }))} />
                  <TextField label="Identifiant" value={formData.username} onChange={(event) => setFormData((current) => ({ ...current, username: event.target.value }))} />
                  <TextField label="URL" value={formData.url} onChange={(event) => setFormData((current) => ({ ...current, url: event.target.value }))} />
                  <TextField label="Catégorie" value={formData.category} onChange={(event) => setFormData((current) => ({ ...current, category: event.target.value }))} />
                  <TextField label="Tags" value={formData.tags} onChange={(event) => setFormData((current) => ({ ...current, tags: event.target.value }))} />
                  <TextField
                    label="Mot de passe"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                  />
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<RefreshCw size={18} />}
                      onClick={() =>
                        setFormData((current) => ({
                          ...current,
                          password: createPassword(getDefaultPasswordOptions()),
                        }))
                      }
                    >
                      Rotation automatique
                    </Button>
                    <Button fullWidth variant="contained" startIcon={<Save size={18} />} onClick={handleSave}>
                      Sauvegarder
                    </Button>
                  </Stack>
                  <TextField
                    label="Notes"
                    multiline
                    minRows={4}
                    value={formData.notes}
                    onChange={(event) => setFormData((current) => ({ ...current, notes: event.target.value }))}
                  />
                  <Button variant="text" onClick={() => setIsEditing(false)}>
                    Annuler
                  </Button>
                </Stack>
              )}
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ p: 4, bgcolor: '#0f2740', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Historique de l’entrée
              </Typography>
              <Stack spacing={1.5}>
                {entry.history.map((item) => (
                  <Box key={item.id} sx={{ p: 2, borderRadius: 2, bgcolor: '#081421' }}>
                    <Typography sx={{ fontWeight: 600 }}>{item.action}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(item.at).toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Double confirmation requise</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography>
              Pour supprimer définitivement cette entrée, tape le nom du service: <strong>{entry.service}</strong>
            </Typography>
            <TextField
              fullWidth
              label="Confirmer la suppression"
              value={deleteConfirmValue}
              onChange={(event) => setDeleteConfirmValue(event.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleteConfirmValue !== entry.service}
            onClick={async () => {
              await deleteEntry(entry.id);
              toast.success('Entrée supprimée.');
              navigate('/dashboard');
            }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
