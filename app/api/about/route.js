import { connectDB } from '@/lib/db';
import About from '@/models/About';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    await connectDB();
    const { content, id } = await request.json();

    if (!content || !id) {
      return NextResponse.json(
        { error: '缺少必要字段' },
        { status: 400 }
      );
    }

    const updatedAbout = await About.findByIdAndUpdate(
      id,
      { 
        content,
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    ).lean();

    return NextResponse.json({
      message: '更新成功',
      data: updatedAbout
    });
  } catch (error) {
    console.error('Error in PUT /api/about:', error);
    return NextResponse.json(
      { error: error.message || '更新失败' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    let about = await About.findOne().lean();
    
    if (!about) {
      about = await About.create({ 
        content: '# About Me\n\n编辑这里...' 
      });
    }

    return NextResponse.json(about);
  } catch (error) {
    console.error('Error in GET /api/about:', error);
    return NextResponse.json(
      { error: error.message || '获取失败' },
      { status: 500 }
    );
  }
} 