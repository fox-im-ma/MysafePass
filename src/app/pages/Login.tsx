import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Card, TextField, Button, Typography, Container } from '@mui/material';
import { Lock } from 'lucide-react';

export default function Login() {
  const [masterPassword, setMasterPassword] = useState('');
  const navigate = useNavigate();

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would verify against a hashed master password
    if (masterPassword) {
      localStorage.setItem('isUnlocked', 'true');
      navigate('/dashboard');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a1929 0%, #001e3c 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'rgba(19, 47, 76, 0.8)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <Lock size={40} color="white" />
          </Box>

          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
            MySafePass
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Enter your master password to unlock your vault
          </Typography>

          <form onSubmit={handleUnlock}>
            <TextField
              fullWidth
              type="password"
              label="Master Password"
              variant="outlined"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              sx={{ mb: 3 }}
              autoFocus
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              Unlock
            </Button>
          </form>
        </Card>
      </Container>
    </Box>
  );
}
