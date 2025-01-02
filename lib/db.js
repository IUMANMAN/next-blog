import mongoose from 'mongoose';

// 设置全局配置
mongoose.set('strictQuery', true);

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
      };

      cached.promise = mongoose.connect(MONGODB_URI, opts);
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error(`[${process.env.NODE_ENV}] MongoDB 连接错误:`, error);
    throw error;
  }
}

// 通用连接监听器
mongoose.connection.on('connected', () => {
  console.log(`[${process.env.NODE_ENV}] MongoDB 已连接`);
});

mongoose.connection.on('error', (err) => {
  console.error(`[${process.env.NODE_ENV}] MongoDB 错误:`, err);
});

mongoose.connection.on('disconnected', () => {
  console.log(`[${process.env.NODE_ENV}] MongoDB 连接断开`);
});

export default connectDB; 