/*
  # Update experiences data
  
  Updates the experiences table with new experience data including:
  - Full House - La Drawing House
  - Latin Lovers - Hôtel La Lanterne & Spa
  - Tokyo Les Bains - Hôtel Square Louvois
  - Rêve Party - Château de Brinville
  - Issy Merveilleux - Domaine de la Reine Margot

  Note: Ratings are scaled to be between 0 and 5
*/

-- First, clear existing example data
DELETE FROM experiences;

-- Insert new experiences
INSERT INTO experiences (
  title,
  description,
  long_description,
  price,
  images,
  category,
  location,
  rating,
  review_count,
  items,
  check_in_info,
  transportation,
  accessibility,
  additional_info,
  schedules
) VALUES
(
  'FULL HOUSE',
  'La Drawing House',
  'Un staycation pour voyager dans les années 70''s, dans un 4 étoiles en plein coeur du 14ème arrondissement. Plongez dans un décor artistique unique.',
  219,
  ARRAY['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
  'hotel',
  '{"city": "Paris 14e", "area": "Montparnasse", "latitude": 48.8417, "longitude": 2.3264}'::jsonb,
  4.6,
  112,
  '{"amenities": ["Artistic hotel rooms", "Rooftop terrace", "Indoor pool", "Blind Test rooms", "Open-space gallery"]}'::jsonb,
  '{"check_in": "15:00", "check_out": "12:00"}'::jsonb,
  '{"metro": ["Montparnasse-Bienvenüe"], "distance_from_center": "15 min"}'::jsonb,
  '{"wheelchair_accessible": true, "elevator": true}'::jsonb,
  '{"cancellation_policy": "Flexible up to 48h before arrival"}'::jsonb,
  '{"pool": "7:00-22:00", "brunch": "Saturday & Sunday 11:00-15:00"}'::jsonb
),
(
  'LATIN LOVERS',
  'Hôtel La Lanterne & Spa',
  'Un havre de paix romantique au cœur du Quartier Latin, offrant une expérience spa luxueuse et une vue imprenable sur Paris.',
  279,
  ARRAY['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
  'spa',
  '{"city": "Paris 5e", "area": "Quartier Latin", "latitude": 48.8448, "longitude": 2.3485}'::jsonb,
  4.75,
  130,
  '{"amenities": ["Romantic suites", "Private hammam", "Rooftop terrace", "Gourmet dining"]}'::jsonb,
  '{"check_in": "14:00", "check_out": "11:00"}'::jsonb,
  '{"metro": ["Saint-Michel", "Maubert-Mutualité"], "distance_from_notre_dame": "5 min"}'::jsonb,
  '{"wheelchair_accessible": true, "elevator": true}'::jsonb,
  '{"cancellation_policy": "Free cancellation up to 48h before arrival"}'::jsonb,
  '{"spa": "8:00-21:00", "breakfast": "7:00-10:30"}'::jsonb
),
(
  'TOKYO LES BAINS',
  'Hôtel Square Louvois',
  'Une escapade japonaise au cœur de Paris, mêlant tradition et modernité dans un cadre zen et raffiné.',
  289,
  ARRAY['https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800'],
  'spa',
  '{"city": "Paris 2e", "area": "Opera", "latitude": 48.8697, "longitude": 2.3389}'::jsonb,
  4.7,
  95,
  '{"amenities": ["Japanese onsen pool", "Tea lounge", "Meditation area", "Private soaking tubs"]}'::jsonb,
  '{"check_in": "15:00", "check_out": "12:00"}'::jsonb,
  '{"metro": ["Opéra", "Quatre-Septembre"], "distance_from_opera": "10 min"}'::jsonb,
  '{"wheelchair_accessible": true, "elevator": true}'::jsonb,
  '{"cancellation_policy": "Flexible up to 72h before arrival"}'::jsonb,
  '{"pool": "7:00-22:00", "tea_ceremony": "14:00-18:00"}'::jsonb
),
(
  'RÊVE PARTY',
  'Château de Brinville',
  'Une expérience féerique dans un château historique, où le luxe rencontre le mystère et la fête.',
  499,
  ARRAY['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
  'chateau',
  '{"city": "Saint-Sauveur-sur-École", "distance_from_paris": "45 min", "latitude": 48.5237, "longitude": 2.5479}'::jsonb,
  4.8,
  120,
  '{"amenities": ["Castle rooms", "Masquerade ball", "Wine tasting", "Private gardens"]}'::jsonb,
  '{"check_in": "16:00", "check_out": "11:00"}'::jsonb,
  '{"car": "45 min from Paris", "train": "30 min from Gare de Lyon"}'::jsonb,
  '{"wheelchair_accessible": false, "elevator": false}'::jsonb,
  '{"cancellation_policy": "Free up to 5 days before arrival"}'::jsonb,
  '{"events": "20:00-00:00", "breakfast": "8:00-10:30"}'::jsonb
),
(
  'ISSY MERVEILLEUX',
  'Domaine de la Reine Margot',
  'Un refuge royal 5 étoiles aux portes de Paris, alliant bien-être et gastronomie dans un cadre d''exception.',
  260,
  ARRAY['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'],
  'spa',
  '{"city": "Issy-les-Moulineaux", "distance_from_paris": "15 min", "latitude": 48.8228, "longitude": 2.2785}'::jsonb,
  4.8,
  200,
  '{"amenities": ["Luxury spa", "Indoor pool", "Fitness center", "Gourmet restaurant"]}'::jsonb,
  '{"check_in": "14:00", "check_out": "11:00"}'::jsonb,
  '{"metro": ["Mairie d''Issy"], "distance_from_expo": "15 min"}'::jsonb,
  '{"wheelchair_accessible": true, "elevator": true}'::jsonb,
  '{"cancellation_policy": "Free up to 24h before arrival"}'::jsonb,
  '{"spa": "7:00-22:00", "pool": "7:00-21:00"}'::jsonb
);