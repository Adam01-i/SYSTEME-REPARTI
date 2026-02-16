import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Users, Coffee } from 'lucide-react';

interface RoomCardProps {
  room: {
    id: string;
    name: string;
    description: string;
    price_per_night: number;
    capacity: number;
    room_type: string;
    images: string[];
    amenities: string[];
  };
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <Link 
      to={`/rooms/${room.id}`}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group"
    >
      <div className="relative">
        <img 
          src={room.images[0]} 
          alt={room.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
          <span className="font-semibold text-blue-600">{room.price_per_night} €</span>
          <span className="text-gray-500 text-sm">/nuit</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
            <p className="text-sm text-gray-600">{room.room_type}</p>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-5 w-5 mr-1" />
            <span>{room.capacity}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{room.description}</p>

        <div className="border-t pt-4">
          <div className="flex flex-wrap gap-2">
            {room.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                <Coffee className="h-3 w-3 mr-1" />
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="text-gray-500 text-xs">
                +{room.amenities.length - 3} équipements
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors">
            Voir les détails
            <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}