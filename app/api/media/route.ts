import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MediaItem from '@/models/MediaItem';

// GET - Obtener todos los items
export async function GET() {
  try {
    await connectDB();
    const items = await MediaItem.find({}).sort({ createdAt: -1 });
    return NextResponse.json(items);
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