import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from './components/Navbar';
import Providers from './components/Providers';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;

  return (
    <html lang="zh">
      <body className={inter.className}>
        <Providers session={session}>
          <Navbar isLoggedIn={isLoggedIn} />
          {children}
        </Providers>
      </body>
    </html>
  );
} 