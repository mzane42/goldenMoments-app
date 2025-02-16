/*
  # Insert sample experiences

  1. Changes
    - Insert sample experiences with realistic data
    - Include various categories and locations
    - Add realistic prices and ratings (scaled to 0-5 range)
*/

INSERT INTO experiences (title, description, price, images, category, location, rating, review_count, items)
VALUES
  (
    'FULL HOUSE',
    'Drawing House ****',
    254,
    ARRAY['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800'],
    'spa',
    '{"city": "Paris 14e", "latitude": 48.8566, "longitude": 2.3522}'::jsonb,
    4.8,
    200,
    '{"amenities": ["Piscine intérieure", "Sauna", "Cocktail"]}'::jsonb
  ),
  (
    'TOKYO LES BAINS',
    'Square Louvois *',
    205,
    ARRAY['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
    'spa',
    '{"city": "Paris 2e", "latitude": 48.8584, "longitude": 2.2945}'::jsonb,
    4.6,
    200,
    '{"amenities": ["Piscine intérieure", "Tea time", "Films"]}'::jsonb
  ),
  (
    'LATIN LOVERS',
    'Hôtel La Lanterne & Spa ****',
    205,
    ARRAY['https://images.unsplash.com/photo-1560624052-449f5ddf0c31?w=800'],
    'spa',
    '{"city": "Paris 5e", "latitude": 48.8584, "longitude": 2.2945}'::jsonb,
    4.5,
    200,
    '{"amenities": ["Piscine intérieure", "Hammam", "Fitness"]}'::jsonb
  ),
  (
    'RÊVE PARTY',
    'Château de Brinville',
    288,
    ARRAY['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
    'chateau',
    '{"city": "Saint-Sauveur-sur-École", "distance": "41 km"}'::jsonb,
    5.0,
    5,
    '{"amenities": ["Late check-out", "Petit déjeuner"]}'::jsonb
  ),
  (
    'ISSY MERVEILLEUX',
    'Domaine de La Reine Margot - MGallery *****',
    260,
    ARRAY['https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800'],
    'spa',
    '{"city": "Issy-Les-Moulineaux", "distance": "6 km"}'::jsonb,
    4.8,
    200,
    '{"amenities": ["Piscine intérieure", "Sauna", "Hammam"]}'::jsonb
  );