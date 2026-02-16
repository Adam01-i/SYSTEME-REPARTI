import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, Users, Star, Coffee, Wifi, Tv, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

interface FeaturedRoom {
  id: string;
  name: string;
  description: string;
  price_per_night: number;
  images: string[];
  room_type: string;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const { data: featuredRooms } = useQuery<FeaturedRoom[]>({
    queryKey: ['featuredRooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/rooms?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  return (
    <div className="relative">
      {/* Section Hero */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[85vh] bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.h1 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl md:text-6xl font-extrabold text-white tracking-tight"
              >
                Vivez le Luxe chez LuxStay
              </motion.h1>
              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="mt-6 text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto"
              >
                Découvrez notre sélection de chambres et suites de luxe.
                Votre séjour parfait commence ici.
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Formulaire de recherche */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="bg-white rounded-xl shadow-2xl p-6 md:p-8"
        >
          <form onSubmit={handleSearch} className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Arrivée</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                />
                <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Départ</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                />
                <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Voyageurs</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                />
                <Users className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md text-base font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Rechercher
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Section Avantages */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-24 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900"
            >
              Pourquoi Choisir LuxStay
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-4 text-xl text-gray-600"
            >
              Découvrez l'alliance parfaite entre confort et luxe
            </motion.p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { icon: Star, title: "Qualité Premium", desc: "Profitez d'équipements et d'un service haut de gamme dans chaque chambre" },
              { icon: MapPin, title: "Emplacements Privilégiés", desc: "Situés au cœur des destinations les plus recherchées" },
              { icon: Coffee, title: "Services Modernes", desc: "Du WiFi haut débit au café premium, nous pensons à tout" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">{item.title}</h3>
              <p className="mt-2 text-gray-600">
                {item.desc}
              </p>
            </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Section Chambres en Vedette */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900"
            >
              Chambres en Vedette
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-4 text-xl text-gray-600"
            >
              Découvrez nos hébergements les plus populaires
            </motion.p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {featuredRooms?.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <Link
                  to={`/rooms/${room.id}`}
                  className="group block"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow">
                  <div className="relative h-64">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      src={room.images[0] || "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80"}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                      <h3 className="text-xl font-semibold text-white">{room.name}</h3>
                      <p className="text-sm text-gray-200">{room.room_type}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 line-clamp-2">{room.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-2xl font-bold text-blue-600">
                        {room.price_per_night} €
                        <span className="text-sm text-gray-500">/nuit</span>
                      </p>
                      <button className="text-blue-600 font-medium group-hover:text-blue-700">
                        Voir les détails →
                      </button>
                    </div>
                  </div>
                </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Section Services */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-24 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900"
            >
              Services Modernes
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-4 text-xl text-gray-600"
            >
              Tout ce dont vous avez besoin pour un séjour confortable
            </motion.p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { icon: Wifi, title: "WiFi Haut Débit" },
              { icon: Coffee, title: "Machine à Café" },
              { icon: Tv, title: "TV Connectée" },
              { icon: Users, title: "Service en Chambre" }
            ].map((service, index) => (
              <motion.div 
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className="text-center"
              >
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mx-auto">
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">{service.title}</h3>
            </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}