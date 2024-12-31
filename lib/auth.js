import jwt from 'jsonwebtoken';

export function verifyToken(token) {
  try {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET 未配置');
      return null;
    }
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Token 验证失败:', error.message);
    return null;
  }
}

export function generateToken(payload) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET 未配置');
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
} 