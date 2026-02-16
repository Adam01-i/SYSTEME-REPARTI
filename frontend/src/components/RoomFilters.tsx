import React from 'react';
import { Search, Euro, Users, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface RoomFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  capacity: number;
  setCapacity: (value: number) => void;
  roomType: string;
  setRoomType: (value: string) => void;
}

export default function RoomFilters({
  searchTerm,
  setSearchTerm,
  priceRange,
  setPriceRange,
  capacity,
  setCapacity,
  roomType,
  setRoomType,
}: RoomFiltersProps) {
  const roomTypes = ['Tous', 'Standard', 'Deluxe', 'Suite', 'Suite Familiale', 'Suite Présidentielle'];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <div className="flex items-center mb-4">
        <Filter className="h-5 w-5 text-gray-500 mr-2" />
        <h2 className="text-lg font-semibold">Filtres</h2>
      </div>

      <div className="space-y-6">
        {/* Recherche par texte */}
        <div className="relative">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            placeholder="Rechercher une chambre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {/* Type de chambre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de chambre
          </label>
          <motion.select
            whileFocus={{ scale: 1.02 }}
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {roomTypes.map((type) => (
              <option key={type} value={type === 'Tous' ? '' : type}>
                {type}
              </option>
            ))}
          </motion.select>
        </div>

        {/* Prix */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prix par nuit
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Euro className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                min="0"
                className="w-full pl-10 pr-3 py-2 border rounded-lg"
                placeholder="Min"
              />
            </div>
            <span className="text-gray-500">-</span>
            <div className="relative flex-1">
              <Euro className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                min={priceRange[0]}
                className="w-full pl-10 pr-3 py-2 border rounded-lg"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        {/* Capacité */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de voyageurs
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value))}
              min="1"
              className="w-full pl-10 pr-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}