import mongoose from 'mongoose';

mongoose.connection.setMaxListeners(15);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('请在环境变量中设置 MONGODB_URI');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        maxPoolSize: 10,
      };

      cached.promise = mongoose.connect(MONGODB_URI, opts);
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('MongoDB 连接错误:', error);
    throw error;
  }
}

// 监听数据库连接状态
mongoose.connection.on('connected', () => {
  console.log('Mongoose 已连接');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose 连接错误:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose 连接断开');
});

export default connectDB; 