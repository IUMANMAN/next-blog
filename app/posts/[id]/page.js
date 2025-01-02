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

export async function generateMetadata({ params: { id } }) {
  try {
    await connectDB();
    const post = await Post.findById(id).lean();
    
    if (!post) {
      return {
        title: '文章不存在',
      };
    }

    return {
      title: post.title,
      description: post.content.slice(0, 200),
      keywords: post.keywords,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: '加载出错',
    };
  }
}

export const revalidate = 3600; // 1小时缓存

export default async function PostPage({ params: { id } }) {
  try {
    const session = await getServerSession(authOptions);
    await connectDB();
    
    // 获取当前文章
    const currentPost = await Post.findById(id)
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