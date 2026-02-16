import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Calendar, Users, CreditCard, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, addDays, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface Room {
  id: string;
  name: string;
  price_per_night: number;
  capacity: number;
  images: string[];
  description: string;
}

function BookingPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      navigate('/login', { state: { from: `/booking/${roomId}` } });
      return;
    }
    setIsAuthenticated(true);
    setIsCheckingAuth(false);
  };

  const { data: room, isLoading: isLoadingRoom } = useQuery<Room>({
    queryKey: ['room', roomId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: isAuthenticated,
  });

  const { data: existingBookings } = useQuery({
    queryKey: ['bookings', roomId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('check_in_date, check_out_date')
        .eq('room_id', roomId)
        .eq('status', 'confirmed');

      if (error) throw error;
      return data;
    },
    enabled: isAuthenticated,
  });

  const createBooking = useMutation({
    mutationFn: async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('Authentication required');
      }

      const totalNights = differenceInDays(new Date(checkOutDate), new Date(checkInDate));
      const totalPrice = room ? totalNights * room.price_per_night : 0;

      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            room_id: roomId,
            user_id: session.user.id,
            check_in_date: checkInDate,
            check_out_date: checkOutDate,
            total_price: totalPrice,
            guest_count: guestCount,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Réservation créée avec succès !');
      navigate('/dashboard');
    },
    onError: (error) => {
      if (error.message === 'Authentication required') {
        toast.error('Veuillez vous connecter pour effectuer une réservation');
        navigate('/login', { state: { from: `/booking/${roomId}` } });
      } else {
        toast.error('Erreur lors de la création de la réservation');
        console.error('Booking error:', error);
      }
    },
  });

  const isDateAvailable = (date: Date) => {
    if (!existingBookings) return true;
    return !existingBookings.some(booking => {
      const bookingStart = new Date(booking.check_in_date);
      const bookingEnd = new Date(booking.check_out_date);
      return date >= bookingStart && date <= bookingEnd;
    });
  };

  const calculateTotalPrice = () => {
    if (!checkInDate || !checkOutDate || !room) return 0;
    const nights = differenceInDays(new Date(checkOutDate), new Date(checkInDate));
    return nights * room.price_per_night;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkInDate || !checkOutDate) {
      toast.error('Veuillez sélectionner les dates de séjour');
      return;
    }

    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      toast.error('La date de départ doit être après la date d\'arrivée');
      return;
    }

    if (guestCount > (room?.capacity || 1)) {
      toast.error(`Cette chambre ne peut accueillir que ${room?.capacity} personnes maximum`);
      return;
    }

    createBooking.mutate();
  };

  if (isCheckingAuth || isLoadingRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Chambre non trouvée</div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Informations de la chambre */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              src={room.images[0]}
              alt={room.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{room.name}</h1>
              <p className="text-gray-600 mb-4">{room.description}</p>
              <div className="flex items-center text-gray-500">
                <Users className="h-5 w-5 mr-2" />
                <span>Capacité maximale : {room.capacity} personnes</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Formulaire de réservation */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <motion.h2 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-xl font-semibold mb-6"
          >
            Réserver cette chambre
          </motion.h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date d'arrivée</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="date"
                    required
                    min={format(new Date(), 'yyyy-MM-dd')}
                    value={checkInDate}
                    onChange={(e) => {
                      setCheckInDate(e.target.value);
                      // Mettre à jour automatiquement la date de départ
                      if (!checkOutDate) {
                        setCheckOutDate(format(addDays(new Date(e.target.value), 1), 'yyyy-MM-dd'));
                      }
                    }}
                    className="block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Calendar className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date de départ</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="date"
                    required
                    min={checkInDate || format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Calendar className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre de voyageurs</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  required
                  min={1}
                  max={room.capacity}
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value))}
                  className="block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <Users className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Maximum {room.capacity} personnes
              </p>
            </div>

            {/* Récapitulatif du prix */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Prix par nuit</span>
                  <span>{room.price_per_night} €</span>
                </div>
                
                {checkInDate && checkOutDate && (
                  <div className="flex justify-between text-gray-600">
                    <span>Nombre de nuits</span>
                    <span>
                      {differenceInDays(new Date(checkOutDate), new Date(checkInDate))}
                    </span>
                  </div>
                )}
                
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{calculateTotalPrice()} €</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations importantes */}
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-400 mt-0.5 mr-2" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium">Informations importantes :</p>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Arrivée à partir de 14h</li>
                    <li>Départ avant 11h</li>
                    <li>Annulation gratuite jusqu'à 48h avant l'arrivée</li>
                  </ul>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={createBooking.isPending}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {createBooking.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Réservation en cours...
                </div>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Réserver maintenant
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default BookingPage;