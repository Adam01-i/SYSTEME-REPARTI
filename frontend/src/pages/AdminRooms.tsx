import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Room {
  id: string;
  name: string;
  description: string;
  price_per_night: number;
  capacity: number;
  room_type: string;
  images: string[];
  amenities: string[];
}

export default function AdminRooms() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editedRoom, setEditedRoom] = useState<Partial<Room> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    name: '',
    description: '',
    price_per_night: 0,
    capacity: 1,
    room_type: '',
    images: [],
    amenities: [],
  });

  const { data: rooms, isLoading } = useQuery<Room[]>({
    queryKey: ['adminRooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createRoom = useMutation({
    mutationFn: async (room: Partial<Room>) => {
      const { data, error } = await supabase
        .from('rooms')
        .insert([room])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRooms'] });
      setIsCreating(false);
      setNewRoom({
        name: '',
        description: '',
        price_per_night: 0,
        capacity: 1,
        room_type: '',
        images: [],
        amenities: [],
      });
      toast.success('Chambre créée avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la création de la chambre');
      console.error('Erreur création:', error);
    },
  });

  const updateRoom = useMutation({
    mutationFn: async (room: Partial<Room>) => {
      const { data, error } = await supabase
        .from('rooms')
        .update(room)
        .eq('id', room.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRooms'] });
      setIsEditing(null);
      setEditedRoom(null);
      toast.success('Chambre mise à jour avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à jour de la chambre');
      console.error('Erreur mise à jour:', error);
    },
  });

  const deleteRoom = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRooms'] });
      toast.success('Chambre supprimée avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression de la chambre');
      console.error('Erreur suppression:', error);
    },
  });

  const handleEdit = (room: Room) => {
    setIsEditing(room.id);
    setEditedRoom(room);
  };

  const handleSave = () => {
    if (editedRoom) {
      updateRoom.mutate(editedRoom);
    }
  };

  const handleCreate = () => {
    createRoom.mutate(newRoom);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette chambre ?')) {
      deleteRoom.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Chambres</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter une Chambre
        </button>
      </div>

      {isCreating && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Nouvelle Chambre</h2>
            <button
              onClick={() => setIsCreating(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                value={newRoom.name}
                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type de Chambre</label>
              <input
                type="text"
                value={newRoom.room_type}
                onChange={(e) => setNewRoom({ ...newRoom, room_type: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Prix par Nuit (€)</label>
              <input
                type="number"
                value={newRoom.price_per_night}
                onChange={(e) => setNewRoom({ ...newRoom, price_per_night: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Capacité</label>
              <input
                type="number"
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={newRoom.description}
                onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Images (URLs séparées par des virgules)</label>
              <input
                type="text"
                value={newRoom.images?.join(',')}
                onChange={(e) => setNewRoom({ ...newRoom, images: e.target.value.split(',') })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Équipements (séparés par des virgules)</label>
              <input
                type="text"
                value={newRoom.amenities?.join(',')}
                onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value.split(',') })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleCreate}
              disabled={createRoom.isPending}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {createRoom.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Création...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Créer
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {rooms?.map((room) => (
          <div key={room.id} className="bg-white rounded-xl shadow-md p-6">
            {isEditing === room.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                      type="text"
                      value={editedRoom?.name}
                      onChange={(e) => setEditedRoom({ ...editedRoom, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prix par Nuit (€)</label>
                    <input
                      type="number"
                      value={editedRoom?.price_per_night}
                      onChange={(e) => setEditedRoom({ ...editedRoom, price_per_night: parseInt(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={editedRoom?.description}
                    onChange={(e) => setEditedRoom({ ...editedRoom, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setIsEditing(null);
                      setEditedRoom(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={updateRoom.isPending}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {updateRoom.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Sauvegarder
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{room.name}</h2>
                    <p className="text-sm text-gray-500">{room.room_type}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(room)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Prix par nuit</p>
                    <p className="text-lg font-semibold text-gray-900">{room.price_per_night} €</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Capacité</p>
                    <p className="text-lg font-semibold text-gray-900">{room.capacity} personnes</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="mt-1 text-gray-700">{room.description}</p>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500">Équipements</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {room.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500">Images</p>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {room.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${room.name} - Image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}