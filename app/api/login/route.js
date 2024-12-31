import { NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    if (
      username === process.env.ADMIN_USERNAME && 
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = generateToken({ username });
      return NextResponse.json({ token });
    } else {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('登录失败:', error);
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    );
  }
} 