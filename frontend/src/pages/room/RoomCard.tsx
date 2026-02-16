import { Link } from "react-router-dom";
import { Users, Coffee } from "lucide-react";
import { Room } from "../../types/room";

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <Link
      to={`/rooms/${room.id}`}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition group"
    >
      <div className="relative">
        {room.images && room.images.length > 0 ? (
          <img
            src={room.images[0]}
            alt={room.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
            No image
          </div>
        )}

        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
          <span className="font-semibold text-blue-600">
            {room.price_per_night} €
          </span>
          <span className="text-gray-500 text-sm">/nuit</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">{room.name}</h3>
            <p className="text-sm text-gray-600">{room.room_type}</p>
          </div>

          <div className="flex items-center text-gray-600">
            <Users className="h-5 w-5 mr-1" />
            <span>{room.capacity}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {room.description}
        </p>

        {room.amenities && room.amenities.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex flex-wrap gap-2">
              {room.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800"
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
        )}
      </div>
    </Link>
  );
}
