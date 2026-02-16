import React from 'react';
import { 
  Wifi, Coffee, Tv, Bath, Utensils, 
  Wind, Lock, Car, Dumbbell, Waves 
} from 'lucide-react';

interface RoomAmenitiesProps {
  amenities: string[];
}

const amenityIcons: { [key: string]: React.ReactNode } = {
  'Wi-Fi': <Wifi className="h-5 w-5" />,
  'Machine à Café': <Coffee className="h-5 w-5" />,
  'Smart TV': <Tv className="h-5 w-5" />,
  'Salle de Bain Privée': <Bath className="h-5 w-5" />,
  'Room Service': <Utensils className="h-5 w-5" />,
  'Climatisation': <Wind className="h-5 w-5" />,
  'Coffre-fort': <Lock className="h-5 w-5" />,
  'Parking': <Car className="h-5 w-5" />,
  'Salle de Sport': <Dumbbell className="h-5 w-5" />,
  'Vue sur Mer': <Waves className="h-5 w-5" />,
};

export default function RoomAmenities({ amenities }: RoomAmenitiesProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {amenities.map((amenity, index) => (
        <div
          key={index}
          className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
        >
          <div className="text-blue-600">
            {amenityIcons[amenity] || amenityIcons['default']}
          </div>
          <span className="text-sm text-gray-700">{amenity}</span>
        </div>
      ))}
    </div>
  );
}