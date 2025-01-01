import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 200
  },
  content: {
    type: String,
    required: true
  },
  keywords: [{
    type: String,
    trim: true
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

// 添加索引以提高查询性能
postSchema.index({ title: 'text', content: 'text' });

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post; 