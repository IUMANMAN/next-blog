import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (query && query.length > 100) {
      return Response.json(
        { error: '搜索关键词过长' },
        { status: 400 }
      );
    }

    const getCachedPosts = unstable_cache(
      async () => {
        await connectDB();
        if (query) {
          return Post.find({
            $or: [
              { title: { $regex: query, $options: 'i' } },
              { content: { $regex: query, $options: 'i' } },
              { keywords: { $regex: query, $options: 'i' } }
            ]
          })
          .sort({ createdAt: -1 })
          .populate('author', 'username')
          .lean();
        }
        return Post.find()
          .sort({ createdAt: -1 })
          .populate('author', 'username')
          .lean();
      },
      [`posts-${query || 'all'}`],
      { revalidate: 60 }  // 1分钟后重新验证
    );

    const posts = await getCachedPosts();
    return Response.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : '获取文章列表失败';
    return Response.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    await connectDB();
    const { title, content, keywords } = await req.json();

    const post = await Post.create({
      title,
      content,
      keywords,
      author: session.user.id
    });

    return Response.json(post);
  } catch (error) {
    console.error('Error in POST /api/posts:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 