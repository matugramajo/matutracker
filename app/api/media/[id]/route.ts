import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MediaItem from '@/models/MediaItem';

// PUT - Actualizar un item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    
    const updatedItem = await MediaItem.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!updatedItem) {
      return NextResponse.json(
        { error: 'Item no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el item' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const deletedItem = await MediaItem.findByIdAndDelete(params.id);
    
    if (!deletedItem) {
      return NextResponse.json(
        { error: 'Item no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Item eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el item' },
      { status: 500 }
    );
  }
} 