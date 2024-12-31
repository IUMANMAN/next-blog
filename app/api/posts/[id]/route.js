import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { cookies } from 'next/headers';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const post = await Post.findById(params.id)
      .populate('author', 'username');

    if (!post) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: '获取文章失败' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Auth Debug:', {
      hasSession: !!session,
      sessionData: session,
      cookies: request.cookies
    });

    if (!session?.user?.id) {
      console.log('Auth failed:', { session });
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const { title, content } = await request.json();
    await connectDB();

    const post = await Post.findById(params.id);
    if (!post) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    const updatedPost = await Post.findByIdAndUpdate(
      params.id,
      { title, content },
      { new: true }
    );

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: '更新失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const cookieStore = cookies();
    const session = await getServerSession(authOptions);
    
    console.log('DELETE request details:', {
      hasSession: !!session,
      user: session?.user,
      userId: session?.user?.id,
      cookies: cookieStore.getAll()
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    await connectDB();
    const post = await Post.findById(params.id);
    
    if (!post) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    await Post.findByIdAndDelete(params.id);
    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: '删除失败' },
      { status: 500 }
    );
  }
}