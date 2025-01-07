import PostCard from './components/PostCard';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import BackToTop from './components/BackToTop';
import LatestPosts from './components/LatestPosts';
import Pagination from './components/Pagination';
import KeywordCloud from './components/KeywordCloud';
import { Suspense } from 'react';

const POSTS_PER_PAGE = 10;

// 分离数据获取逻辑
async function getPosts() {
  await connectDB();
  const page = 1;
  const totalPosts = await Post.countDocuments();
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const validPage = Math.max(1, Math.min(page, totalPages));

  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip((validPage - 1) * POSTS_PER_PAGE)
    .limit(POSTS_PER_PAGE)
    .lean();

  return { posts, totalPages, validPage };
}

export default async function Home() {
  const { posts, totalPages, validPage } = await getPosts();

  const simplifiedPosts = posts.map(post => ({
    id: post._id.toString(),
    title: post.title,
    content: post.content,
    description: post.description,
    createdAt: post.createdAt.toISOString(),
    date: new Date(post.createdAt).toISOString(),
    keywords: post.keywords || [],
  }));

  // 获取所有文章用于侧边栏和关键词云
  const allPosts = await Post.find()
    .sort({ createdAt: -1 })
    .select('title keywords createdAt')
    .lean();

  // 处理侧边栏数据（只取前7篇）
  const sidebarPosts = allPosts
    .slice(0, 7)
    .map(post => ({
      id: post._id.toString(),
      title: post.title,
      createdAt: post.createdAt.toISOString(),
    }));

  // 提取所有唯一关键词
  const allKeywords = [...new Set(allPosts.flatMap(post => post.keywords || []))];

  return (
    <div className="relative">
      <div className="hidden lg:block">
        <LatestPosts posts={sidebarPosts} />
        <div className="fixed right-[calc(50%-750px)] top-32 w-64">
          <KeywordCloud allKeywords={allKeywords} />
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 main-content">
        <Suspense fallback={<div>Loading...</div>}>
          <div className="divide-y divide-lesswrong-border">
            {simplifiedPosts.map(post => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination 
              currentPage={validPage} 
              totalPages={totalPages} 
            />
          )}
        </Suspense>
        <BackToTop />
      </main>
    </div>
  );
}
