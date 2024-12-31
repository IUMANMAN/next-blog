import PostCard from './components/PostCard';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import BackToTop from './components/BackToTop';

export default async function Home() {
  await connectDB();
  const posts = await Post.find().sort({ createdAt: -1 });

  const simplifiedPosts = posts.map(post => ({
    id: post._id.toString(),
    title: post.title,
    content: post.content,
    description: post.description,
    date: post.createdAt.toLocaleDateString('zh-CN'),
  }));

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="divide-y divide-lesswrong-border">
        {simplifiedPosts.map(post => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
      <BackToTop />
    </main>
  );
}
