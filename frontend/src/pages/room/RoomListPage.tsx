import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bed } from 'lucide-react';
import RoomFilters from './RoomFilters';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

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

// Fonction pour récupérer les chambres depuis Flask
async function fetchRooms(filters: {
  search: string;
  min_price: number;
  max_price: number;
  capacity: number;
  room_type: string;
}): Promise<Room[]> {
  const params = new URLSearchParams({
    search: filters.search,
    min_price: filters.min_price.toString(),
    max_price: filters.max_price.toString(),
    capacity: filters.capacity.toString(),
    room_type: filters.room_type,
  });

  const res = await fetch(`http://localhost:5000/api/rooms?${params.toString()}`);
  if (!res.ok) throw new Error('Erreur lors du chargement des chambres');
  return res.json();
}

export default function RoomListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [capacity, setCapacity] = useState(1);
  const [roomType, setRoomType] = useState('');

  const { data: rooms, isLoading, error } = useQuery<Room[], Error>({
    queryKey: ['rooms', searchTerm, priceRange, capacity, roomType],
    queryFn: () =>
      fetchRooms({
        search: searchTerm,
        min_price: priceRange[0],
        max_price: priceRange[1],
        capacity,
        room_type: roomType,
      }),
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
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error.message}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filtres */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="md:w-1/4"
        >
          <RoomFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            capacity={capacity}
            setCapacity={setCapacity}
            roomType={roomType}
            setRoomType={setRoomType}
          />
        </motion.div>

        {/* Liste des chambres */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="md:w-3/4"
        >
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-3xl font-bold mb-6"
          >
            Nos Chambres
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rooms && rooms.length > 0 ? (
              rooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Link
                    to={`/rooms/${room.id}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 block"
                  >
                    {room.images.length > 0 ? (
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        src={room.images[0]}
                        alt={room.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <Bed className="w-12 h-12 text-gray-400" />
                      </div>
                    )}

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h2 className="text-xl font-semibold">{room.name}</h2>
                          <p className="text-sm text-gray-600">{room.room_type}</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                          {room.price_per_night} €/nuit
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">{room.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {room.amenities.slice(0, 3).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
                          >
                            {amenity}
                          </span>
                        ))}
                        {room.amenities.length > 3 && (
                          <span className="text-gray-500 text-xs">
                            +{room.amenities.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Jusqu'à {room.capacity} voyageurs
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                          Voir les détails →
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-center py-12 bg-white rounded-lg shadow col-span-full"
              >
                <Bed className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Aucune chambre trouvée
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Essayez de modifier vos critères de recherche
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
