import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Box,
  Card,
  Button,
  Typography,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { ArrowLeft, Eye, EyeOff, Copy, Edit, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

interface VaultEntry {
  id: string;
  service: string;
  username: string;
  password: string;
}

export default function EntryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<VaultEntry | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedService, setEditedService] = useState('');
  const [editedUsername, setEditedUsername] = useState('');
  const [editedPassword, setEditedPassword] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const entries = JSON.parse(localStorage.getItem('vaultEntries') || '[]');
    const found = entries.find((e: VaultEntry) => e.id === id);
    if (found) {
      setEntry(found);
      setEditedService(found.service);
      setEditedUsername(found.username);
      setEditedPassword(found.password);
    } else {
      navigate('/dashboard');
    }
  }, [id, navigate]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleSave = () => {
    if (!editedService || !editedPassword) {
      toast.error('Service name and password are required');
      return;
    }

    const entries = JSON.parse(localStorage.getItem('vaultEntries') || '[]');
    const updatedEntries = entries.map((e: VaultEntry) =>
      e.id === id
        ? { ...e, service: editedService, username: editedUsername, password: editedPassword }
        : e
    );
    localStorage.setItem('vaultEntries', JSON.stringify(updatedEntries));
    setEntry({
      id: id!,
      service: editedService,
      username: editedUsername,
      password: editedPassword,
    });
    setIsEditing(false);
    toast.success('Entry updated successfully');
  };

  const handleDelete = () => {
    const entries = JSON.parse(localStorage.getItem('vaultEntries') || '[]');
    const updatedEntries = entries.filter((e: VaultEntry) => e.id !== id);
    localStorage.setItem('vaultEntries', JSON.stringify(updatedEntries));
    toast.success('Entry deleted successfully');
    setTimeout(() => navigate('/dashboard'), 500);
  };

  if (!entry) return null;

  return (
    <>
      <Toaster position="top-center" richColors />
      <Box sx={{ minHeight: '100vh', bgcolor: '#0a1929' }}>
        <AppBar position="static" sx={{ bgcolor: '#132f4c', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={24} />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Password Details
            </Typography>
            {!isEditing && (
              <IconButton color="inherit" onClick={() => setIsEditing(true)}>
                <Edit size={24} />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>

        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Card sx={{ p: 4, bgcolor: '#132f4c' }}>
            {!isEditing ? (
              <>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
                  {entry.service}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Service Name
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      bgcolor: '#0a1929',
                      borderRadius: 2,
                      mb: 3,
                    }}
                  >
                    <Typography variant="h6">{entry.service}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(entry.service, 'Service name')}
                      sx={{ color: 'primary.main' }}
                    >
                      <Copy size={20} />
                    </IconButton>
                  </Box>

                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Username
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      bgcolor: '#0a1929',
                      borderRadius: 2,
                      mb: 3,
                    }}
                  >
                    <Typography>{entry.username}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(entry.username, 'Username')}
                      sx={{ color: 'primary.main' }}
                    >
                      <Copy size={20} />
                    </IconButton>
                  </Box>

                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Password
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      bgcolor: '#0a1929',
                      borderRadius: 2,
                      mb: 3,
                    }}
                  >
                    <Typography sx={{ fontFamily: 'monospace', flex: 1 }}>
                      {showPassword ? entry.password : '••••••••••••'}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        sx={{ color: 'primary.main', mr: 1 }}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleCopy(entry.password, 'Password')}
                        sx={{ color: 'primary.main' }}
                      >
                        <Copy size={20} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<Trash2 size={20} />}
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={{ py: 1.5, fontWeight: 600, textTransform: 'none' }}
                >
                  Delete Entry
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Edit Entry
                </Typography>

                <TextField
                  fullWidth
                  label="Service Name"
                  value={editedService}
                  onChange={(e) => setEditedService(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Username"
                  value={editedUsername}
                  onChange={(e) => setEditedUsername(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={editedPassword}
                  onChange={(e) => setEditedPassword(e.target.value)}
                  sx={{ mb: 3 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Save size={20} />}
                    onClick={handleSave}
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      bgcolor: 'success.main',
                      '&:hover': { bgcolor: 'success.dark' },
                    }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<X size={20} />}
                    onClick={() => {
                      setIsEditing(false);
                      setEditedService(entry.service);
                      setEditedUsername(entry.username);
                      setEditedPassword(entry.password);
                    }}
                    sx={{ py: 1.5, fontWeight: 600, textTransform: 'none' }}
                  >
                    Cancel
                  </Button>
                </Box>
              </>
            )}
          </Card>
        </Container>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: { bgcolor: '#132f4c' },
          }}
        >
          <DialogTitle>Delete Entry</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this password entry? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              color="error"
              variant="contained"
              sx={{ textTransform: 'none' }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
