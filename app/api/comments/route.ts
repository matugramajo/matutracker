import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';

// GET /api/comments?mediaItemId=xxx
export async function GET(request: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const mediaItemId = searchParams.get('mediaItemId');
  if (!mediaItemId) {
    return NextResponse.json({ error: 'mediaItemId es requerido' }, { status: 400 });
  }
  const comments = await Comment.find({ mediaItemId }).sort({ createdAt: -1 });
  return NextResponse.json(comments);
}

// POST /api/comments
export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();
  if (!body.mediaItemId || !body.text) {
    return NextResponse.json({ error: 'mediaItemId y text son requeridos' }, { status: 400 });
  }
  if (body.text.length > 500) {
    return NextResponse.json({ error: 'El comentario supera el máximo de 500 caracteres' }, { status: 400 });
  }
  const comment = new Comment({
    mediaItemId: body.mediaItemId,
    name: body.name,
    text: body.text,
  });
  await comment.save();
  return NextResponse.json(comment, { status: 201 });
} 