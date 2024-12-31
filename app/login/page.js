'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('请填写所有字段');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('用户名或密码错误');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      setError('登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-sm mx-auto px-4 py-8">
      <div className="bg-white p-6 sm:p-8 rounded-lg border border-lesswrong-border">
        <h1 className="text-xl font-medium text-lesswrong-text mb-6">登录</h1>
        
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm text-lesswrong-text mb-1">
              用户名
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-lesswrong-border rounded-md
                focus:outline-none focus:border-lesswrong-link focus:ring-1 focus:ring-lesswrong-link
                placeholder-lesswrong-meta"
              placeholder="输入用户名"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-lesswrong-text mb-1">
              密码
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-lesswrong-border rounded-md
                focus:outline-none focus:border-lesswrong-link focus:ring-1 focus:ring-lesswrong-link
                placeholder-lesswrong-meta"
              placeholder="输入密码"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 text-sm font-medium text-white bg-lesswrong-link rounded-md
              hover:bg-lesswrong-link-hover transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </main>
  );
} 