import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ posts: [] });
  }

  try {
    await connectDB();
    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ]
    })
    .select('title description content slug')
    .sort({ createdAt: -1 })
    .limit(5);

    const simplifiedPosts = posts.map(post => ({
      id: post._id.toString(),
      title: post.title,
      description: post.description || post.content.substring(0, 100),
      slug: post.slug || post._id.toString(),
    }));

    return NextResponse.json({ posts: simplifiedPosts });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
} 