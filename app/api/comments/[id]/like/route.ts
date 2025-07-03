import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import mongoose from 'mongoose';

function getClientIp(request: NextRequest): string {
  // X-Forwarded-For puede contener varias IPs, tomamos la primera
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  // fallback para dev/local
  return request.headers.get('x-real-ip') || '';
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }
  const ip = getClientIp(request);
  const comment = await Comment.findById(id);
  if (!comment) {
    return NextResponse.json({ error: 'Comentario no encontrado' }, { status: 404 });
  }
  if (comment.likedIps.includes(ip)) {
    return NextResponse.json({ error: 'Ya diste like desde esta IP', likesCount: comment.likesCount }, { status: 403 });
  }
  comment.likesCount += 1;
  comment.likedIps.push(ip);
  await comment.save();
  return NextResponse.json({ likesCount: comment.likesCount });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }
  const ip = getClientIp(request);
  const comment = await Comment.findById(id);
  if (!comment) {
    return NextResponse.json({ error: 'Comentario no encontrado' }, { status: 404 });
  }
  if (!comment.likedIps.includes(ip)) {
    return NextResponse.json({ error: 'No puedes quitar el like desde esta IP', likesCount: comment.likesCount }, { status: 403 });
  }
  comment.likesCount = Math.max(0, comment.likesCount - 1);
  comment.likedIps = comment.likedIps.filter((itemIp: string) => itemIp !== ip);
  await comment.save();
  return NextResponse.json({ likesCount: comment.likesCount });
} 