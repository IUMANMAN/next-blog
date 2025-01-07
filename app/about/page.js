import { connectDB } from '@/lib/db';
import About from '@/models/About';
import { Suspense } from 'react';
import AboutContent from '@/app/components/AboutContent';

export const metadata = {
  title: 'About Me',
  description: 'About Me page'
};

export default async function AboutPage() {
  await connectDB();
  
  let about = await About.findOne().lean();
  if (!about) {
    about = await About.create({ content: '# About Me\n\n编辑这里...' });
  }

  const simplifiedAbout = {
    id: about._id.toString(),
    content: about.content,
    updatedAt: about.updatedAt.toISOString()
  };

  return (
    <main className="min-h-screen pt-20">
      <div className="max-w-[780px] mx-auto px-4">
        <Suspense fallback={<div>Loading...</div>}>
          <AboutContent about={simplifiedAbout} />
        </Suspense>
      </div>
    </main>
  );
} 