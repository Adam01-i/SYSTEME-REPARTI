import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Star, ThumbsUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    email: string;
  };
}

interface ReviewsListProps {
  roomId: string;
}

export default function ReviewsList({ roomId }: ReviewsListProps) {
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ['reviews', roomId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:user_id (
            email
          )
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!reviews?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucun avis pour le moment</p>
      </div>
    );
  }

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Note moyenne</h3>
            <div className="flex items-center mt-1">
              <span className="text-2xl font-bold text-blue-600 mr-2">
                {averageRating.toFixed(1)}
              </span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">{reviews.length} avis</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-gray-700">{review.comment}</p>
              </div>
            </div>
            
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <time dateTime={review.created_at}>
                {format(new Date(review.created_at), 'dd MMMM yyyy', { locale: fr })}
              </time>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}