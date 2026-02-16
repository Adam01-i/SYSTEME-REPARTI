/*
  # Ajout de données pour les chambres

  1. Données
    - Ajout de chambres avec des détails complets
    - Images réelles d'Unsplash
    - Descriptions détaillées en français
    - Prix et capacités variés
*/

INSERT INTO rooms (name, description, price_per_night, capacity, room_type, images, amenities)
VALUES
  (
    'Suite Royale',
    'Plongez dans le luxe absolu avec notre Suite Royale. Cette suite spacieuse de 75m² offre une vue panoramique sur la ville, un salon séparé et une salle de bain en marbre avec baignoire à remous.',
    450,
    4,
    'Suite',
    ARRAY[
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'
    ],
    ARRAY['Wi-Fi', 'Smart TV', 'Mini Bar', 'Room Service 24/7', 'Climatisation', 'Coffre-fort']
  ),
  (
    'Chambre Deluxe Vue Mer',
    'Admirez la mer depuis votre lit king-size dans notre Chambre Deluxe. Profitez d''un balcon privé et d''une décoration contemporaine raffinée.',
    280,
    2,
    'Deluxe',
    ARRAY[
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39'
    ],
    ARRAY['Wi-Fi', 'Smart TV', 'Balcon Privé', 'Machine à Café', 'Mini Bar']
  ),
  (
    'Suite Familiale',
    'Idéale pour les familles, cette suite spacieuse comprend deux chambres séparées, un salon confortable et une kitchenette équipée.',
    350,
    6,
    'Suite Familiale',
    ARRAY[
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a'
    ],
    ARRAY['Wi-Fi', 'Smart TV', 'Kitchenette', 'Machine à Laver', 'Climatisation']
  ),
  (
    'Chambre Supérieure',
    'Une chambre élégante avec un lit queen-size, parfaite pour les voyageurs d''affaires ou les couples.',
    180,
    2,
    'Supérieure',
    ARRAY[
      'https://images.unsplash.com/photo-1631049552240-59c37f38802b',
      'https://images.unsplash.com/photo-1631049552240-59c37f38802b'
    ],
    ARRAY['Wi-Fi', 'Bureau de Travail', 'Smart TV', 'Coffre-fort']
  ),
  (
    'Suite Présidentielle',
    'Le summum du luxe avec 120m² d''espace, comprenant un salon, une salle à manger, un bureau et une terrasse privée avec jacuzzi.',
    850,
    4,
    'Suite Présidentielle',
    ARRAY[
      'https://images.unsplash.com/photo-1590490360182-c33d57733427',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427'
    ],
    ARRAY['Wi-Fi', 'Smart TV', 'Jacuzzi Privé', 'Cave à Vin', 'Butler Service', 'Salle de Sport Privée']
  );