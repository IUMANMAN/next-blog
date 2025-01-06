import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

// 获取单篇文章
export async function GET(request, { params }) {
  try {
    await connectDB();
    const post = await Post.findById(params.id)
      .populate('author', 'username')
      .lean();

    if (!post) {
      return new Response('Post not found', { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error in GET /api/posts/[id]:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// 更新文章
export async function PUT(request, { params }) {
  try {
    // 只验证用户是否登录
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    await connectDB();
    const { title, content, keywords } = await request.json();
    const updatedPost = await Post.findByIdAndUpdate(
      params.id,
      { title, content, keywords },
      { new: true }
    ).lean();

    if (!updatedPost) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error in PUT /api/posts/[id]:', error);
    return NextResponse.json(
      { error: error.message || '更新失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // 只验证用户是否登录
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
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
    return NextResponse.json({ 
      message: '删除成功'
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: error.message || '删除失败' },
      { status: 500 }
    );
  }
}