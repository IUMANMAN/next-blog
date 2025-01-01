import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: '无效的文章ID' }, { status: 400 });
    }

    const post = await Post.findById(params.id)
      .populate('author', 'username')
      .lean();

    if (!post) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    // 转换为安全的 JSON 格式
    const safePost = {
      ...post,
      _id: post._id.toString(),
      author: post.author ? {
        ...post.author,
        _id: post.author._id.toString()
      } : null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };

    return NextResponse.json(safePost);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: '获取文章失败' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    await connectDB();
    const { title, content, keywords } = await req.json();

    const post = await Post.findById(params.id);
    if (!post) {
      return new Response('Post not found', { status: 404 });
    }

    // 更新文章
    post.title = title;
    post.content = content;
    post.keywords = keywords;
    await post.save();

    return Response.json(post);
  } catch (error) {
    console.error('Error in PUT /api/posts/[id]:', error);
    return new Response('Internal Server Error', { status: 500 });
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