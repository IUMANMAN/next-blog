import * as jose from 'jose';

const textEncoder = new TextEncoder();

export async function verifyToken(token) {
  try {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET 未配置');
      return null;
    }

    const secret = textEncoder.encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('Token 验证失败:', error.message);
    return null;
  }
}

export async function generateToken(payload) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET 未配置');
  }

  const secret = textEncoder.encode(process.env.JWT_SECRET);
  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);

  return token;
} 