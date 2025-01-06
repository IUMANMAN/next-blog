# ManMan Blog

一个使用 Next.js 14 构建的现代化博客系统，支持 Markdown 编写，实时预览，图片上传等功能。

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **样式方案**: TailwindCSS + CSS Variables
- **内容渲染**: React-Markdown + Remark-GFM
- **编辑器**: @uiw/react-md-editor
- **认证系统**: NextAuth.js
- **数据库**: MongoDB + Mongoose
- **部署**: Nginx + Forever

## 特性

- 🚀 服务端渲染 (SSR)
- 📝 Markdown 编辑与实时预览
- 🖼️ 图片上传与管理
- 🔍 全文搜索
- 🏷️ 标签管理
- 🎨 响应式设计
- 🔐 用户认证
- ⚡️ 自动优化图片
- 📱 移动端适配

## 快速开始

1. **克隆项目**
```bash
git clone https://github.com/IUMANMAN/manman-blog.git
cd manman-blog
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
# 开发环境 (.env.local)
NODE_ENV=development
MONGODB_URI=你的MongoDB连接串
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=你的密钥

# 生产环境 (.env.production)
NODE_ENV=production
MONGODB_URI=你的MongoDB连接串
NEXTAUTH_URL=你的域名
NEXTAUTH_SECRET=你的密钥
```

4. **开发环境运行**
```bash
npm run dev
```

5. **生产环境部署**
```bash
# 构建项目
npm run build

# 使用 forever 启动
npm install -g forever
forever start -c "npm start" ./
```

## 项目结构

```
manman-blog/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API 路由
│   │   ├── auth/         # 认证相关
│   │   ├── posts/        # 文章 CRUD
│   │   └── upload/       # 文件上传
│   ├── components/        # 共享组件
│   ├── posts/            # 文章页面
│   └── search/           # 搜索功能
├── lib/                   # 工具函数
├── models/               # Mongoose 模型
└── public/              # 静态资源
```

## Nginx 配置

```nginx
server {
    listen 80;
    server_name manziqiang.com www.manziqiang.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## 环境要求

- Node.js >= 18.0.0
- MongoDB >= 4.4
- Nginx

## 开发指南

### 添加新功能

1. **创建新页面**
- 在 `app` 目录下创建新目录
- 添加 `page.js` 文件

2. **添加新组件**
- 在 `components` 目录下创建
- 使用 'use client' 指令标记客户端组件

3. **样式开发**
- 使用 TailwindCSS 类名
- 在 `globals.css` 中定义全局样式
- 使用 CSS 变量维护主题

### 学习资源

- [Next.js 文档](https://nextjs.org/docs)
- [Next.js 学习](https://nextjs.org/learn)
- [Next.js GitHub 仓库](https://github.com/vercel/next.js)

## 贡献

欢迎提交 Pull Request 或创建 Issue。

## 许可

MIT License

## 作者

- ManMan
- Email: my0sterick@gmail.com
- GitHub: [@IUMANMAN](https://github.com/IUMANMAN)
