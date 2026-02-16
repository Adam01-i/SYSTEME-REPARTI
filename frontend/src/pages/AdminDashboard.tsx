import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { BarChart3, Users, Hotel, Calendar, Star } from 'lucide-react';

interface DashboardStats {
  totalRooms: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: userDetails } = await supabase
        .from('users')
        .select('role')
        .eq('id', user?.id)
        .single();

      if (userDetails?.role !== 'admin') {
        navigate('/');
        throw new Error('Accès non autorisé');
      }

      const [rooms, bookings, reviews] = await Promise.all([
        supabase.from('rooms').select('count'),
        supabase.from('bookings').select('total_price'),
        supabase.from('reviews').select('rating'),
      ]);

      const totalRevenue = bookings.data?.reduce((acc, booking) => acc + booking.total_price, 0) || 0;
      const averageRating = reviews.data?.length 
        ? reviews.data.reduce((acc, review) => acc + review.rating, 0) / reviews.data.length 
        : 0;

      return {
        totalRooms: rooms.data?.[0]?.count || 0,
        totalBookings: bookings.data?.length || 0,
        totalRevenue,
        averageRating,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tableau de Bord Administrateur</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Chambres</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{stats?.totalRooms}</p>
            </div>
            <Hotel className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Réservations</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{stats?.totalBookings}</p>
            </div>
            <Calendar className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenu Total</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{stats?.totalRevenue} €</p>
            </div>
            <BarChart3 className="h-12 w-12 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Note Moyenne</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {stats?.averageRating.toFixed(1)}/5
              </p>
            </div>
            <Star className="h-12 w-12 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions Rapides</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/admin/rooms')}
              className="flex items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Hotel className="h-6 w-6 text-blue-600 mr-2" />
              <span className="font-medium text-blue-600">Gérer les Chambres</span>
            </button>
            <button
              onClick={() => navigate('/admin/bookings')}
              className="flex items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Calendar className="h-6 w-6 text-green-600 mr-2" />
              <span className="font-medium text-green-600">Voir les Réservations</span>
            </button>
            <button
              onClick={() => navigate('/admin/users')}
              className="flex items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Users className="h-6 w-6 text-purple-600 mr-2" />
              <span className="font-medium text-purple-600">Gérer les Utilisateurs</span>
            </button>
            <button
              onClick={() => navigate('/admin/reviews')}
              className="flex items-center justify-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <Star className="h-6 w-6 text-yellow-600 mr-2" />
              <span className="font-medium text-yellow-600">Voir les Avis</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Dernières Activités</h2>
          <div className="space-y-4">
            {/* Cette section pourrait être développée avec un composant d'activités récentes */}
            <p className="text-gray-600">Fonctionnalité à venir...</p>
          </div>
        </div>
      </div>
    </div>
  );
}