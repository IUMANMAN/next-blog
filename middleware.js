import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      // 允许 GET 请求和文件上传路由
      if (req.method === 'GET' || req.nextUrl.pathname.startsWith('/api/upload')) {
        return true;
      }
      // 其他路由需要验证 token
      return !!token;
    }
  }
});

export const config = {
  matcher: [
    '/api/posts/:path*',
    '/api/upload/:path*',  // 添加上传路由
    '/posts/:path*/edit'
  ]
}; 