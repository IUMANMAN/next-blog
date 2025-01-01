import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import { notFound } from 'next/navigation';
import PostContent from './PostContent';
import PostActions from '@/app/components/PostActions';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import BackToTop from '@/app/components/BackToTop';
import BackButton from '@/app/components/BackButton';
import PostNavigation from '@/app/components/PostNavigation';
import { Suspense } from 'react';
import PostLoading from './loading';
import ErrorBoundary from '@/app/components/ErrorBoundary';

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

export const revalidate = 3600; // 1小时缓存

export default async function PostPage({ params }) {
  try {
    const session = await getServerSession(authOptions);
    await connectDB();
    
    // 获取当前文章
    const currentPost = await Post.findById(params.id)
      .populate('author', 'username')
      .lean();

    if (!currentPost) {
      return notFound();
    }

    // 获取前后文章
    const [prevPost, nextPost] = await Promise.all([
      Post.findOne({ createdAt: { $lt: currentPost.createdAt } })
        .sort({ createdAt: -1 })
        .select('title')
        .lean(),
      Post.findOne({ createdAt: { $gt: currentPost.createdAt } })
        .sort({ createdAt: 1 })
        .select('title')
        .lean()
    ]);

    // 转换为普通 JavaScript 对象
    const simplifiedPrevPost = prevPost ? {
      id: prevPost._id ? prevPost._id.toString() : null,
      title: prevPost.title
    } : null;

    const simplifiedNextPost = nextPost ? {
      id: nextPost._id ? nextPost._id.toString() : null,
      title: nextPost.title
    } : null;

    // 转换当前文章为普通对象
    const simplifiedPost = {
      id: currentPost._id ? currentPost._id.toString() : null,
      title: currentPost.title,
      content: currentPost.content,
      author: {
        username: currentPost.author?.username || 'my0sterick'
      },
      createdAt: currentPost.createdAt ? new Date(currentPost.createdAt).toISOString() : new Date().toISOString(),
      keywords: Array.isArray(currentPost.keywords) ? currentPost.keywords : [],
      navigation: {
        prev: simplifiedPrevPost,
        next: simplifiedNextPost
      }
    };

    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <ErrorBoundary fallback={<div>加载文章时出错</div>}>
          <Suspense fallback={<PostLoading />}>
            <div className="flex justify-between items-center mb-6">
              <BackButton />
              <PostActions post={simplifiedPost} />
            </div>
            <article>
              <PostContent post={simplifiedPost} />
            </article>
            <PostNavigation 
              prevPost={simplifiedPrevPost}
              nextPost={simplifiedNextPost}
            />
            <BackToTop />
          </Suspense>
        </ErrorBoundary>
      </main>
    );
  } catch (error) {
    console.error('Error in PostPage:', error);
    return <div>加载文章时出错</div>;
  }
} 