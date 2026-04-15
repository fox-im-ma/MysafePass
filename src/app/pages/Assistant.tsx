import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  AppBar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { ArrowLeft, Bot, SendHorizonal } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { buildAssistantReply } from '../lib/chat-assistant';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}

const starterPrompts = ['Liste mes comptes', 'Résumé sécurité', 'Montre les mots de passe faibles', 'Génère un mot de passe fort'];

export default function Assistant() {
  const navigate = useNavigate();
  const { status, entries } = useVault();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      role: 'assistant',
      content:
        'Je suis ton assistant MySafePass. Je peux résumer la sécurité du coffre, lister les comptes, signaler les doublons et suggérer des mots de passe forts.',
    },
  ]);

  useEffect(() => {
    if (status === 'locked' || status === 'new') {
      navigate('/auth');
    }
  }, [navigate, status]);

  const handleSend = (value = input) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    };
    const reply = buildAssistantReply(trimmed, entries);
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: reply.message,
    };

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setInput('');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#081421' }}>
      <AppBar position="static" sx={{ bgcolor: '#0f2740' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={22} />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Assistant conversationnel
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card sx={{ p: 3, bgcolor: '#0f2740', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '14px',
                bgcolor: '#0066CC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bot size={22} color="white" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Mode aide intelligente
              </Typography>
              <Typography color="text.secondary">
                Compréhension locale de requêtes fréquentes du MVP en français ou en anglais simple.
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 3 }}>
            {starterPrompts.map((prompt) => (
              <Chip key={prompt} label={prompt} onClick={() => handleSend(prompt)} />
            ))}
          </Stack>

          <Stack spacing={2} sx={{ mb: 3 }}>
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  borderRadius: 3,
                  px: 2,
                  py: 1.5,
                  bgcolor: message.role === 'user' ? '#0066CC' : '#081421',
                  whiteSpace: 'pre-wrap',
                }}
              >
                <Typography>{message.content}</Typography>
              </Box>
            ))}
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <TextField
              fullWidth
              placeholder="Ex: liste mes comptes, résumé sécurité, cherche github..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button variant="contained" startIcon={<SendHorizonal size={18} />} onClick={() => handleSend()}>
              Envoyer
            </Button>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}
