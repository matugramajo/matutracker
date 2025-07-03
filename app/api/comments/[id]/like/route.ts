import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import mongoose from 'mongoose';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }
  const comment = await Comment.findByIdAndUpdate(
    id,
    { $inc: { likesCount: 1 } },
    { new: true }
  );
  if (!comment) {
    return NextResponse.json({ error: 'Comentario no encontrado' }, { status: 404 });
  }
  return NextResponse.json({ likesCount: comment.likesCount });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }
  const comment = await Comment.findById(id);
  if (!comment) {
    return NextResponse.json({ error: 'Comentario no encontrado' }, { status: 404 });
  }
  if (comment.likesCount > 0) {
    comment.likesCount -= 1;
    await comment.save();
  }
  return NextResponse.json({ likesCount: comment.likesCount });
} 