import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { generateAccessToken } from './generateToken.js';
import { authenticateClient } from './authenticateClient.js';

const checkAuth = (requiredScopes) => async (req, res, next) => {
  let token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }

  try {//CHECK TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Obtém os "scopes" (permissões) do token
    const scopes = decoded.scopes || [];

    // Verifica se todos os "requiredScopes" estão incluídos nos "scopes" do token
    const hasAccess = requiredScopes.every(scope => scopes.includes(scope));

    if (!hasAccess) {
      return res.status(403).json({ message: 'Forbidden: Insufficient scopes' });
    }

    console.log('>> (checkout): token ainda e valido!')
    return next();
  } catch (err) { // REFRESH TOKEN

    if (err.name === 'TokenExpiredError') {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) {
        return res.status(401).json({ message: 'Unauthorized: Refresh token missing' });
      }
      
      try {
        // Verifique o refresh token
        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const client = authenticateClient({
          clientId: decodedRefresh.clientId,
          clientSecret: decodedRefresh.clientSecret
        }); 

        const newAccessToken = generateAccessToken({
          clientId: client.id,
          clientSecret: client.secret,
          scopes: client.scopes
        });

        // Atualize o token no cookie
        res.cookie('auth_token', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 1000 * 10, //10s 
          sameSite: 'strict'
        });

        console.log('>> (checkout): token não e vais valido, atualizando cookie')

        // Continue com a requisição, agora com o novo token
        return next();

      } catch (refreshError) {
        console.log(refreshError)
        return res.status(401).json({ message: 'Unauthorized: Invalid refresh token' });
      }
    }

    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

export { checkAuth };
