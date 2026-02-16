import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Check, X, Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface Booking {
  id: string;
  room_id: string;
  user_id: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: string;
  guest_count: number;
  room: {
    name: string;
    room_type: string;
  };
  user: {
    email: string;
  };
}

export default function AdminBookings() {
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ['adminBookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          room:rooms (
            name,
            room_type
          ),
          user:users (
            email
          )
        `)
        .order('check_in_date', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const updateBookingStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
      toast.success('Statut de la réservation mis à jour');
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à jour du statut');
      console.error('Erreur mise à jour:', error);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const translateStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'En attente',
      'confirmed': 'Confirmé',
      'cancelled': 'Annulé'
    };
    return statusMap[status] || status;
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des Réservations</h1>

      <div className="grid grid-cols-1 gap-6">
        {bookings?.map((booking) => (
          <div key={booking.id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{booking.room.name}</h2>
                <p className="text-sm text-gray-500">{booking.room.room_type}</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {translateStatus(booking.status)}
                </span>
                {booking.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateBookingStatus.mutate({ id: booking.id, status: 'confirmed' })}
                      className="p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => updateBookingStatus.mutate({ id: booking.id, status: 'cancelled' })}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Arrivée</p>
                  <p className="font-medium">
                    {format(new Date(booking.check_in_date), 'dd MMMM yyyy', { locale: fr })}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Départ</p>
                  <p className="font-medium">
                    {format(new Date(booking.check_out_date), 'dd MMMM yyyy', { locale: fr })}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Voyageurs</p>
                  <p className="font-medium">{booking.guest_count} personnes</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Prix Total</p>
                <p className="text-lg font-semibold text-gray-900">{booking.total_price} €</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">Client</p>
              <p className="font-medium">{booking.user.email}</p>
            </div>
          </div>
        ))}
      </div>

      {(!bookings || bookings.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune réservation trouvée</p>
        </div>
      )}
    </div>
  );
}