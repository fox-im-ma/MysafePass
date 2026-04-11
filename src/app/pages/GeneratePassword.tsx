import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Card,
  Button,
  Typography,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Slider,
  FormControlLabel,
  Switch,
  TextField,
  Divider,
} from '@mui/material';
import { ArrowLeft, Copy, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

export default function GeneratePassword() {
  const navigate = useNavigate();
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeDigits, setIncludeDigits] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [username, setUsername] = useState('');

  const generatePassword = () => {
    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeDigits) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
  };

  const handleCopy = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      toast.success('Password copied to clipboard');
    }
  };

  const handleSave = () => {
    if (!serviceName || !generatedPassword) {
      toast.error('Please generate a password and enter a service name');
      return;
    }

    const entries = JSON.parse(localStorage.getItem('vaultEntries') || '[]');
    const newEntry = {
      id: Date.now().toString(),
      service: serviceName,
      username: username || 'Not specified',
      password: generatedPassword,
    };
    entries.push(newEntry);
    localStorage.setItem('vaultEntries', JSON.stringify(entries));
    toast.success('Password saved successfully');
    setTimeout(() => navigate('/dashboard'), 1000);
  };

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
              Generate Password
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Card sx={{ p: 4, bgcolor: '#132f4c', mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Password Generator
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography gutterBottom>Password Length: {length}</Typography>
              <Slider
                value={length}
                onChange={(_, value) => setLength(value as number)}
                min={8}
                max={32}
                step={1}
                marks
                sx={{ color: 'primary.main' }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    color="primary"
                  />
                }
                label="Include Uppercase (A-Z)"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={includeDigits}
                    onChange={(e) => setIncludeDigits(e.target.checked)}
                    color="primary"
                  />
                }
                label="Include Digits (0-9)"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    color="primary"
                  />
                }
                label="Include Symbols (!@#$...)"
              />
            </Box>

            <Button
              fullWidth
              variant="contained"
              startIcon={<RefreshCw size={20} />}
              onClick={generatePassword}
              sx={{ mb: 3, py: 1.5, fontWeight: 600, textTransform: 'none' }}
            >
              Generate Password
            </Button>

            {generatedPassword && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#0a1929',
                  borderRadius: 2,
                  mb: 2,
                  wordBreak: 'break-all',
                  fontFamily: 'monospace',
                  fontSize: '1.1rem',
                  border: '2px solid #0066CC',
                }}
              >
                {generatedPassword}
              </Box>
            )}

            {generatedPassword && (
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Copy size={20} />}
                onClick={handleCopy}
                sx={{ mb: 3, py: 1.5, fontWeight: 600, textTransform: 'none' }}
              >
                Copy Password
              </Button>
            )}
          </Card>

          {generatedPassword && (
            <Card sx={{ p: 4, bgcolor: '#132f4c' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Save to Vault
              </Typography>

              <TextField
                fullWidth
                label="Service Name"
                placeholder="e.g., Gmail, Facebook"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Username (optional)"
                placeholder="e.g., user@email.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ mb: 3 }}
              />

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
                Save Password
              </Button>
            </Card>
          )}
        </Container>
      </Box>
    </>
  );
}
