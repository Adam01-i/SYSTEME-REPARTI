import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Calendar, Users, Wifi, Coffee, Tv, Bath } from 'lucide-react';

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

function RoomDetailPage() {
  const { id } = useParams();

  const { data: room, isLoading, error } = useQuery<Room>({
    queryKey: ['room', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error loading room details</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Room not found</div>
      </div>
    );
  }

  const amenityIcons: { [key: string]: React.ReactNode } = {
    'Wi-Fi': <Wifi className="h-6 w-6" />,
    'Coffee Maker': <Coffee className="h-6 w-6" />,
    'Smart TV': <Tv className="h-6 w-6" />,
    'Private Bathroom': <Bath className="h-6 w-6" />,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          {room.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${room.name} - Image ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          ))}
        </div>

        {/* Room Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>
            <p className="text-lg text-gray-600">{room.room_type}</p>
          </div>

          <div className="flex items-center space-x-4">
            <Users className="h-6 w-6 text-gray-500" />
            <span className="text-gray-600">Up to {room.capacity} guests</span>
          </div>

          <div className="border-t border-b border-gray-200 py-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-600">{room.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 gap-4">
              {room.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  {amenityIcons[amenity]}
                  <span className="text-gray-600">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-gray-900">
                ${room.price_per_night}
              </span>
              <span className="text-gray-600">per night</span>
            </div>
            <button
              onClick={() => window.location.href = `/booking/${room.id}`}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomDetailPage;