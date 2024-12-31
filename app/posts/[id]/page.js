import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import { notFound } from 'next/navigation';
import PostContent from './PostContent';
import PostActions from '@/app/components/PostActions';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import BackToTop from '@/app/components/BackToTop';

export async function generateMetadata({ params }) {
  await connectDB();
  let post;
  
  try {
    if (mongoose.Types.ObjectId.isValid(params.id)) {
      post = await Post.findById(params.id);
    } else {
      post = await Post.findOne({ slug: params.id });
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    return {
      title: '文章未找到',
      description: '请求的文章不存在'
    };
  }

  if (!post) {
    return {
      title: '文章未找到',
      description: '请求的文章不存在'
    };
  }

  return {
    title: post.title,
    description: post.description || post.content.substring(0, 160)
  };
}

export default async function PostPage({ params }) {
  const session = await getServerSession(authOptions);
  await connectDB();
  let post;

  try {
    if (mongoose.Types.ObjectId.isValid(params.id)) {
      post = await Post.findById(params.id).populate('author', 'username');
    } else {
      post = await Post.findOne({ slug: params.id }).populate('author', 'username');
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    notFound();
  }

  if (!post) {
    notFound();
  }

  const simplifiedPost = {
    id: post._id.toString(),
    title: post.title,
    content: post.content,
    description: post.description,
    date: post.createdAt.toLocaleDateString('zh-CN'),
    author: post.author?._id?.toString(),
    authorName: post.author?.username || '未知作者',
  };

  // console.log('验证作者:', {
  //   sessionUserId: session?.user?.id,
  //   postAuthorId: simplifiedPost.author,
  //   isMatch: session?.user?.id === simplifiedPost.author
  // });

  return (
    <main className="max-w-3xl mx-auto px-5 py-10">
      <article className="prose prose-lg prose-gray mx-auto">
        <PostContent 
          post={simplifiedPost} 
          actions={session?.user && <PostActions post={simplifiedPost} />} 
        />
      </article>
      <BackToTop />
    </main>
  );
} 