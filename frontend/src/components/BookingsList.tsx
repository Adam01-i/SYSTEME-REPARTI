import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Booking {
  id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  guest_count: number;
  status: string;
  room: {
    name: string;
    room_type: string;
  };
}

const translateStatus = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'pending': 'En attente',
    'confirmed': 'Confirmé',
    'cancelled': 'Annulé'
  };
  return statusMap[status] || status;
};

export default function BookingsList() {
  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          room:rooms (
            name,
            room_type
          )
        `)
        .eq('user_id', user?.id)
        .order('check_in_date', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!bookings?.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Aucune réservation trouvée</h3>
        <p className="mt-2 text-sm text-gray-500">
          Vous n'avez pas encore effectué de réservation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Mes Réservations</h2>
      
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {booking.room.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {booking.room.room_type}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  booking.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800'
                    : booking.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {translateStatus(booking.status)}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-5 w-5 mr-2" />
                  <div>
                    <p>Arrivée</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(booking.check_in_date), 'dd MMMM yyyy', { locale: fr })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-5 w-5 mr-2" />
                  <div>
                    <p>Départ</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(booking.check_out_date), 'dd MMMM yyyy', { locale: fr })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{booking.guest_count} voyageurs</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {booking.total_price} €
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}