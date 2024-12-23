import jwt from 'jsonwebtoken';
import 'dotenv/config';

const generateAccessToken = ({clientId, clientSecret, scopes}) => {
  const payload = {
    clientId,
    clientSecret,
    scopes,  
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10s' })
}

const generateRefreshToken = ({clientId, clientSecret, scopes}) => {
  const payload = {
    clientId,
    clientSecret,
    scopes,
  }

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
}

export { generateAccessToken, generateRefreshToken };
