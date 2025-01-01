import { NextResponse } from 'next/server';
import { writeFile, unlink, readdir } from 'fs/promises';
import path from 'path';

// 新的配置方式
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// 允许的图片类型
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

// 最大文件大小 (5MB)
const MAX_SIZE = 5 * 1024 * 1024;

// 获取已上传的图片列表
export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const files = await readdir(uploadDir);
    
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => ({
        url: `/uploads/${file}`,
        name: file
      }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error listing images:', error);
    return NextResponse.json(
      { error: '获取图片列表失败' },
      { status: 500 }
    );
  }
}

// 删除图片
export async function DELETE(request) {
  try {
    const { url } = await request.json();
    const fileName = path.basename(url);
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
    
    await unlink(filePath);
    
    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: '删除失败' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: '请选择图片' },
        { status: 400 }
      );
    }

    // 检查文件类型
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: '只支持 JPG、PNG、GIF 和 WebP 格式的图片' },
        { status: 400 }
      );
    }

    // 检查文件大小
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: '图片大小不能超过 5MB' },
        { status: 400 }
      );
    }

    // 获取文件的字节数据
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 生成文件名
    const timestamp = Date.now();
    const ext = path.extname(file.name);
    const fileName = `${timestamp}${ext}`;
    
    // 确保上传目录存在
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // 保存文件
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // 返回文件URL
    return NextResponse.json({ 
      url: `/uploads/${fileName}`,
      message: '图片上传成功'
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: '图片上传失败' },
      { status: 500 }
    );
  }
} 