import { MediaItem } from './constants';

const API_BASE_URL = '/api/media';

export const databaseService = {
  // Obtener todos los items
  getItems: async (): Promise<MediaItem[]> => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error('Error al obtener los items');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching items:', error);
      return [];
    }
  },

  // Agregar un nuevo item
  addItem: async (itemData: Partial<MediaItem>): Promise<MediaItem | null> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw new Error('Error al crear el item');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding item:', error);
      return null;
    }
  },

  // Actualizar un item existente
  updateItem: async (id: string, itemData: Partial<MediaItem>): Promise<MediaItem | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el item');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating item:', error);
      return null;
    }
  },

  // Eliminar un item
  deleteItem: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el item');
      }

      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      return false;
    }
  },
}; 