import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MediaItem from '@/models/MediaItem';
import mongoose from 'mongoose';

function getClientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip') || '';
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }
  const ip = getClientIp(request);
  const item = await MediaItem.findById(id);
  if (!item) {
    return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 });
  }
  if (item.likedIps.includes(ip)) {
    return NextResponse.json({ error: 'Ya diste like desde esta IP', likesCount: item.likesCount }, { status: 403 });
  }
  item.likesCount += 1;
  item.likedIps.push(ip);
  await item.save();
  return NextResponse.json({ likesCount: item.likesCount });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }
  const ip = getClientIp(request);
  const item = await MediaItem.findById(id);
  if (!item) {
    return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 });
  }
  if (!item.likedIps.includes(ip)) {
    return NextResponse.json({ error: 'No puedes quitar el like desde esta IP', likesCount: item.likesCount }, { status: 403 });
  }
  item.likesCount = Math.max(0, item.likesCount - 1);
  item.likedIps = item.likedIps.filter((itemIp: string) => itemIp !== ip);
  await item.save();
  return NextResponse.json({ likesCount: item.likesCount });
} 