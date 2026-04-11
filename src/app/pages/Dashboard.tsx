import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Card,
  TextField,
  Typography,
  Container,
  IconButton,
  Fab,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Search, Copy, Plus, Lock, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

interface VaultEntry {
  id: string;
  service: string;
  username: string;
  password: string;
}

export default function Dashboard() {
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is unlocked
    const isUnlocked = localStorage.getItem('isUnlocked');
    if (!isUnlocked) {
      navigate('/');
      return;
    }

    // Load entries from localStorage
    const savedEntries = localStorage.getItem('vaultEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    } else {
      // Initialize with sample data
      const sampleEntries: VaultEntry[] = [
        {
          id: '1',
          service: 'Gmail',
          username: 'user@gmail.com',
          password: 'Secure123!@#',
        },
        {
          id: '2',
          service: 'GitHub',
          username: 'developer',
          password: 'GitH@b2024Pass',
        },
        {
          id: '3',
          service: 'Netflix',
          username: 'viewer@email.com',
          password: 'N3tfl!x$ecure',
        },
      ];
      setEntries(sampleEntries);
      localStorage.setItem('vaultEntries', JSON.stringify(sampleEntries));
    }
  }, [navigate]);

  const handleCopyPassword = (password: string, service: string) => {
    navigator.clipboard.writeText(password);
    toast.success(`Password copied for ${service}`);
  };

  const handleLock = () => {
    localStorage.removeItem('isUnlocked');
    navigate('/');
  };

  const filteredEntries = entries.filter((entry) =>
    entry.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Toaster position="top-center" richColors />
      <Box sx={{ minHeight: '100vh', bgcolor: '#0a1929' }}>
        <AppBar position="static" sx={{ bgcolor: '#132f4c', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          <Toolbar>
            <Lock size={24} style={{ marginRight: 12 }} />
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
              MySafePass
            </Typography>
            <IconButton color="inherit" onClick={handleLock}>
              <LogOut size={24} />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Your Vault
          </Typography>

          <TextField
            fullWidth
            placeholder="Search passwords..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
          />

          <List sx={{ mb: 10 }}>
            {filteredEntries.map((entry) => (
              <Card
                key={entry.id}
                sx={{
                  mb: 2,
                  bgcolor: '#132f4c',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 12px rgba(0, 102, 204, 0.3)',
                  },
                }}
              >
                <ListItem
                  onClick={() => navigate(`/entry/${entry.id}`)}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyPassword(entry.password, entry.service);
                      }}
                      sx={{ color: 'primary.main' }}
                    >
                      <Copy size={20} />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {entry.service}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {'••••••••••••'}
                      </Typography>
                    }
                  />
                </ListItem>
              </Card>
            ))}
          </List>

          {filteredEntries.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color="text.secondary">No passwords found</Typography>
            </Box>
          )}

          <Fab
            color="primary"
            aria-label="add"
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              width: 64,
              height: 64,
            }}
            onClick={() => navigate('/generate')}
          >
            <Plus size={32} />
          </Fab>
        </Container>
      </Box>
    </>
  );
}
