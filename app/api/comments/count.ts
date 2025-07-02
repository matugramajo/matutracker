import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import mongoose from 'mongoose';

// GET /api/comments/count?mediaItemIds=1,2,3
export async function GET(request: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get('mediaItemIds');
  if (!idsParam) {
    return NextResponse.json({ error: 'mediaItemIds es requerido' }, { status: 400 });
  }
  const ids = idsParam.split(',').map((id) => id.trim());
  const objectIds = ids.map((id) => {
    try {
      return new mongoose.Types.ObjectId(id);
    } catch {
      return null;
    }
  }).filter(Boolean);
  const counts = await Comment.aggregate([
    { $match: { mediaItemId: { $in: objectIds } } },
    { $group: { _id: '$mediaItemId', count: { $sum: 1 } } }
  ]);
  // Convertir a objeto { mediaItemId: count }
  const result: Record<string, number> = {};
  ids.forEach(id => { result[id] = 0 });
  counts.forEach((c: any) => { result[c._id.toString()] = c.count });
  return NextResponse.json(result);
} 