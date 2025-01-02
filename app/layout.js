import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Providers from './components/Providers';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import { cache } from 'react';
import icon from '@/app/favicon.ico';

const inter = Inter({ subsets: ['latin'] });

// 缓存数据获取函数
const getNavData = cache(async () => {
  await connectDB();
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .select('title keywords')
    .limit(7)
    .lean();
  
  const navPosts = posts.map(post => ({
    id: post._id.toString(),
    title: post.title,
  }));
  
  const allKeywords = [...new Set(posts.flatMap(post => post.keywords || []))];
  
  return { navPosts, allKeywords };
});

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;

  // 使用缓存的数据获取函数
  const { navPosts, allKeywords } = await getNavData();

  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <link rel="dns-prefetch" href="https://manziqiang.com" />
        <link
          rel="preconnect"
          href="https://manziqiang.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} pt-16`}>
        <Providers session={session}>
          <Navbar 
            isLoggedIn={isLoggedIn}
            posts={navPosts}
            keywords={allKeywords}
          />
          <div className="min-h-screen flex flex-col w-full">
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

export const metadata = {
  metadataBase: new URL('https://manziqiang.com'),
  title: {
    default: 'ManMan Blog',
    template: '%s | ManMan Blog'
  },
  description: '分享技术与思考',
  keywords: ['技术博客', '编程', 'crypto', 'web3', '阅读','reading','思考','摄影' ],
  icons: {
    icon: [
      { 
        url: icon.src,
        sizes: '32x32',
        type: 'image/x-icon',
      },
    ],
  },
  openGraph: {
    title: 'ManMan Blog',
    description: '分享技术与思考',
    url: 'https://manziqiang.com',
    siteName: 'ManMan Blog',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}; 