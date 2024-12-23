import express from 'express';
import { checkAuth } from './checkAuth.js';
import { authenticateClient } from './authenticateClient.js';
import { generateAccessToken, generateRefreshToken } from './generateToken.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post('/auth', (req, res) => {
  const { clientId, clientSecret } = req.body;

  const client = authenticateClient({clientId, clientSecret});

  if (!client) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateAccessToken({
    clientId, clientSecret, scopes: client.scopes
  });

  const refreshToken = generateRefreshToken({
    clientId, clientSecret, scopes: client.scopes
  });

  // Definindo os tokens como cookies
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 10, // 10s
    sameSite: 'strict',
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 604800000, // 7 dias
    sameSite: 'strict',
  });

  res.json({ message: 'Authenticated', token });
});

// Rota protegida (exemplo)
app.get('/users', checkAuth(['read:user']), (req, res) => {
  res.json({ message: 'Access granted to users!' });
});

// Rota protegida para administradores
app.get('/admins', checkAuth(['read:admin']), (req, res) => {
  res.json({ message: 'Access granted to admins!' });
});

// Iniciando o servidor
app.listen(3000, () => {
  console.log('🚀 App rodando!');
});
