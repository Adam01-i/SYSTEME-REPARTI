import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Users, Wifi, Coffee, Tv, Bath } from "lucide-react";
import { useRoom } from "../../hooks/room/useRoom";

export default function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: room, isLoading, error } = useRoom(id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Room not found
      </div>
    );
  }

  const amenityIcons: Record<string, React.ReactNode> = {
    "Wi-Fi": <Wifi className="h-6 w-6" />,
    "Coffee Maker": <Coffee className="h-6 w-6" />,
    "Smart TV": <Tv className="h-6 w-6" />,
    "Private Bathroom": <Bath className="h-6 w-6" />,
    "Calendar": <Calendar className="h-6 w-6" />,
    "Users": <Users className="h-6 w-6" />,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Images */}
        <div className="space-y-4">
          {room.images && room.images.length > 0 ? (
            room.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${room.name} ${idx + 1}`}
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            ))
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              No image available
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{room.name}</h1>
            <p className="text-gray-600">{room.room_type}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-gray-500" />
            <span>Up to {room.capacity} guests</span>
          </div>

          <div className="border-t border-b py-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-600">{room.description}</p>
          </div>

          {/* Amenities */}
          {room.amenities && room.amenities.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                {room.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    {amenityIcons[amenity] || (
                      <span className="h-6 w-6" />
                    )}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Booking */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between mb-4">
              <span className="text-2xl font-bold">
                {room.price_per_night} €
              </span>
              <span className="text-gray-600">per night</span>
            </div>

            <button
              onClick={() => navigate(`/booking/${room.id}`)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
