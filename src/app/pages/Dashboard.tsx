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
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { Bot, Copy, Download, Lock, LogOut, Search, Sparkles, TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';
import { useVault } from '../context/VaultContext';

type SortMode = 'updated' | 'name' | 'recent';

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    status,
    profileName,
    entries,
    auditTrail,
    securitySummary,
    sessionWarning,
    exportEncryptedBackup,
    recordEntryAccess,
    lockVault,
  } = useVault();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortMode, setSortMode] = useState<SortMode>('updated');

  useEffect(() => {
    if (status === 'locked' || status === 'new') {
      navigate('/auth');
    }
  }, [navigate, status]);

  const categories = useMemo(() => {
    return ['all', ...new Set(entries.map((entry) => entry.category))];
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return [...entries]
      .filter((entry) => (categoryFilter === 'all' ? true : entry.category === categoryFilter))
      .filter((entry) => {
        if (!query) return true;

        return [
          entry.service,
          entry.username,
          entry.url,
          entry.category,
          entry.tags.join(' '),
        ]
          .join(' ')
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => {
        if (sortMode === 'name') return a.service.localeCompare(b.service);
        if (sortMode === 'recent') return (b.lastAccessedAt || '').localeCompare(a.lastAccessedAt || '');
        return b.updatedAt.localeCompare(a.updatedAt);
      });
  }, [categoryFilter, entries, searchQuery, sortMode]);

  const handleExport = () => {
    const backup = exportEncryptedBackup();
    navigator.clipboard.writeText(backup);
    toast.success('Backup chiffré copié dans le presse-papier.');
  };

  const handleCopyPassword = async (entryId: string, password: string, service: string) => {
    await navigator.clipboard.writeText(password);
    await recordEntryAccess(entryId, `Copie du mot de passe pour ${service}.`);
    toast.success(`Mot de passe copié pour ${service}.`);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#081421' }}>
      <AppBar position="static" sx={{ bgcolor: '#0f2740', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
          <Lock size={22} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            MySafePass {profileName ? `• ${profileName}` : ''}
          </Typography>
          <Button color="inherit" startIcon={<Bot size={18} />} onClick={() => navigate('/assistant')}>
            Assistant
          </Button>
          <Button color="inherit" startIcon={<Sparkles size={18} />} onClick={() => navigate('/generate')}>
            Générer
          </Button>
          <IconButton color="inherit" onClick={handleExport}>
            <Download size={20} />
          </IconButton>
          <IconButton color="inherit" onClick={() => { lockVault('Coffre verrouillé manuellement.'); navigate('/auth'); }}>
            <LogOut size={20} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          {sessionWarning && (
            <Alert severity="warning">La session expire dans moins de 30 secondes sans activité.</Alert>
          )}

          <Grid container spacing={2}>
            {[
              { label: 'Entrées', value: securitySummary.totalEntries },
              { label: 'Mots de passe faibles', value: securitySummary.weakEntries.length },
              { label: 'Services suspects', value: securitySummary.suspiciousEntries.length },
              { label: 'Doublons', value: securitySummary.reusedPasswords },
            ].map((card) => (
              <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 3, bgcolor: '#0f2740', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Typography color="text.secondary" variant="body2">
                    {card.label}
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                    {card.value}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Card sx={{ p: 3, bgcolor: '#0f2740', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  placeholder="Rechercher par service, username, tag ou URL"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={18} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Catégorie</InputLabel>
                  <Select
                    value={categoryFilter}
                    label="Catégorie"
                    onChange={(event) => setCategoryFilter(event.target.value)}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category === 'all' ? 'Toutes' : category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Trier par</InputLabel>
                  <Select
                    value={sortMode}
                    label="Trier par"
                    onChange={(event) => setSortMode(event.target.value as SortMode)}
                  >
                    <MenuItem value="updated">Dernière modification</MenuItem>
                    <MenuItem value="recent">Dernier accès</MenuItem>
                    <MenuItem value="name">Nom du service</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Card>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={2}>
                {filteredEntries.map((entry) => (
                  <Card
                    key={entry.id}
                    sx={{
                      p: 3,
                      bgcolor: '#0f2740',
                      border: '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer',
                    }}
                    onClick={async () => {
                      await recordEntryAccess(entry.id, `Consultation de l’entrée ${entry.service}.`);
                      navigate(`/entry/${entry.id}`);
                    }}
                  >
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {entry.service}
                        </Typography>
                        <Typography color="text.secondary">{entry.username || 'Identifiant non renseigné'}</Typography>
                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.5 }}>
                          <Chip size="small" label={entry.category} />
                          <Chip size="small" color={entry.passwordScore < 60 ? 'warning' : 'success'} label={`${entry.passwordScore}/100`} />
                          {entry.domainWarnings.length > 0 && (
                            <Chip
                              size="small"
                              color="warning"
                              icon={<TriangleAlert size={14} />}
                              label="domaine suspect"
                            />
                          )}
                          {entry.tags.map((tag) => (
                            <Chip key={tag} size="small" variant="outlined" label={tag} />
                          ))}
                        </Stack>
                      </Box>

                      <Stack direction="row" spacing={1} alignItems="flex-start">
                        <Button
                          variant="outlined"
                          startIcon={<Copy size={16} />}
                          onClick={async (event) => {
                            event.stopPropagation();
                            await handleCopyPassword(entry.id, entry.password, entry.service);
                          }}
                        >
                          Copier
                        </Button>
                      </Stack>
                    </Stack>
                  </Card>
                ))}

                {filteredEntries.length === 0 && (
                  <Card sx={{ p: 5, textAlign: 'center', bgcolor: '#0f2740' }}>
                    <Typography color="text.secondary">
                      Aucune entrée ne correspond aux filtres actuels.
                    </Typography>
                  </Card>
                )}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 3, bgcolor: '#0f2740', border: '1px solid rgba(255,255,255,0.06)', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Points de vigilance
                </Typography>
                <Stack spacing={1.5}>
                  {securitySummary.weakEntries.length > 0 ? (
                    <Alert severity="warning">
                      {securitySummary.weakEntries.length} entrée(s) avec score inférieur à 60.
                    </Alert>
                  ) : (
                    <Alert severity="success">Aucun mot de passe faible détecté.</Alert>
                  )}
                  {securitySummary.suspiciousEntries.length > 0 && (
                    <Alert severity="warning">
                      {securitySummary.suspiciousEntries.length} service(s) avec URL ou domaine à surveiller.
                    </Alert>
                  )}
                  {securitySummary.reusedPasswords > 0 && (
                    <Alert severity="error">{securitySummary.reusedPasswords} groupe(s) de mots de passe réutilisés.</Alert>
                  )}
                </Stack>
              </Card>

              <Card sx={{ p: 3, bgcolor: '#0f2740', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Journal d’audit récent
                </Typography>
                <List disablePadding>
                  {auditTrail.slice(0, 8).map((event) => (
                    <ListItem key={event.id} disableGutters sx={{ py: 1.1 }}>
                      <ListItemText
                        primary={event.message}
                        secondary={new Date(event.at).toLocaleString()}
                      />
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
