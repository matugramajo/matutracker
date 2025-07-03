import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MediaItem from '@/models/MediaItem';

// GET - Obtener todos los items
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const items = await MediaItem.find({}).sort({ createdAt: -1 });
    // Obtener IP del request
    const xff = request?.headers?.get('x-forwarded-for');
    const ip = xff ? xff.split(',')[0].trim() : (request?.headers?.get('x-real-ip') || '');
    // Transformar cada item para exponer 'id' en vez de '_id' y agregar likedByMe
    const itemsWithId = items.map((item) => {
      const obj = item.toObject();
      obj.id = obj._id.toString();
      delete obj._id;
      delete obj.__v;
      obj.likedByMe = Array.isArray(obj.likedIps) && ip ? obj.likedIps.includes(ip) : false;
      return obj;
    });
    return NextResponse.json(itemsWithId);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Error al obtener los items' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo item
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const newItem = new MediaItem(body);
    const savedItem = await newItem.save();
    
    return NextResponse.json(savedItem, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Error al crear el item' },
      { status: 500 }
    );
  }
} 