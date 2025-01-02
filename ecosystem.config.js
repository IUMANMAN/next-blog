module.exports = {
  apps: [
    {
      name: 'manman-blog',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/opt/1panel/apps/manman-blog',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        MONGODB_URI: 'mongodb://mongo_FwCess:mongo_YXYPDm@localhost:27017',
        NEXTAUTH_URL: 'https://manziqiang.com',
        NEXTAUTH_SECRET: '5fcb1c1c59824c41833935623f35d3d834141de3cde8b10b85d09a07852f673b'
      },
    },
  ],
};