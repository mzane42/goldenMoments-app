import { supabase } from './supabase';
import type { Database } from '../types/database';
import { generateBookingReference } from './utils';

export type Experience = Database['public']['Tables']['experiences']['Row'];
export type User = Database['public']['Tables']['users']['Row'];
export type Wishlist = Database['public']['Tables']['wishlists']['Row'];
export type Reservation = Database['public']['Tables']['reservations']['Row'];

export type SearchFilters = {
  query?: string;
  category?: string;
  priceRange?: { min: number; max: number };
  distance?: string;
  dates?: { start: string; end: string };
  guests?: {
    adults: number;
    children: number;
    infants: number;
  };
  amenities?: string[];
  style?: string;
  situation?: string;
  roomType?: string;
};

export async function checkIfUserExists() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .maybeSingle();
    if (userError) {
      console.error('Error checking if user exists:', userError);
      return false;
    }
    return !!userData;
  } catch (error) {
    console.error('Error checking if user exists:', error);
    return false;
  }
}

export async function getExperiences() {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('rating', { ascending: false });

  if (error) {
    throw new Error('Failed to fetch experiences');
  }

  return data;
}

export async function getExperienceById(id: string) {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('id', id)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error('Failed to fetch experience');
  }

  if (!data) {
    throw new Error('Experience not found');
  }

  return data;
}

export async function getExperiencesByCategory(category: string) {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('category', category)
    .order('rating', { ascending: false });

  if (error) {
    throw new Error('Failed to fetch experiences by category');
  }

  return data;
}

export async function searchExperiences(filters: SearchFilters) {
  let query = supabase
    .from('experiences')
    .select('*')
    .order('rating', { ascending: false });

  // Full-text search on title and description
  if (filters.query) {
    query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
  }

  // Category filter
  if (filters.category) {
    query = query.eq('category', filters.category);
  }

  // Price range filter
  if (filters.priceRange) {
    if (filters.priceRange.min) {
      query = query.gte('price', filters.priceRange.min);
    }
    if (filters.priceRange.max) {
      query = query.lte('price', filters.priceRange.max);
    }
  }

  // Distance filter (using location data)
  if (filters.distance) {
    const [min, max] = filters.distance.split('-').map(Number);
    query = query.and(`location->>'distance_from_paris',gte,${min},lte,${max}`);
  }

  // Date availability filter
  if (filters.dates) {
    query = query.and(`
      date_start <= '${filters.dates.end}' and 
      date_end >= '${filters.dates.start}'
    `);
  }

  // Amenities filter
  if (filters.amenities && filters.amenities.length > 0) {
    const amenityConditions = filters.amenities.map(amenity => 
      `items->>'amenities' ? '${amenity}'`
    );
    query = query.and(amenityConditions.join(','));
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error('Failed to search experiences');
  }

  return { data, count };
}

export async function getWishlistItems() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }

  // First get the user's ID
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .maybeSingle();

  if (userError || !userData) {
    console.error('Error getting user data:', userError);
    return [];
  }

  // Then get their wishlist items
  const { data, error } = await supabase
    .from('wishlists')
    .select('experience_id')
    .eq('user_id', userData.id);

  if (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }

  return data;
}

export async function toggleWishlist(experienceId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Get user ID
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .maybeSingle();

  if (userError || !userData) {
    console.error('Error getting user data:', userError);
    throw new Error('User not found');
  }

  // Check if experience is already in wishlist
  const { data: existing, error: existingError } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', userData.id)
    .eq('experience_id', experienceId)
    .maybeSingle();

  if (existingError) {
    console.error('Error checking wishlist:', existingError);
    throw new Error('Failed to check wishlist status');
  }

  if (existing) {
    // Remove from wishlist
    const { error: deleteError } = await supabase
      .from('wishlists')
      .delete()
      .eq('id', existing.id);

    if (deleteError) {
      console.error('Error removing from wishlist:', deleteError);
      throw new Error('Failed to remove from wishlist');
    }
    
    return false;
  } else {
    // Add to wishlist
    const { error: insertError } = await supabase
      .from('wishlists')
      .insert({
        user_id: userData.id,
        experience_id: experienceId
      });

    if (insertError) {
      console.error('Error adding to wishlist:', insertError);
      throw new Error('Failed to add to wishlist');
    }
    
    return true;
  }
}

export async function createReservation(data: {
  experienceId: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  guestCount: number;
  totalPrice: number;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Get user ID
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .maybeSingle();

  if (userError || !userData) {
    throw new Error('User not found');
  }

  const bookingReference = generateBookingReference();

  const { data: reservation, error } = await supabase
    .from('reservations')
    .insert({
      user_id: userData.id,
      experience_id: data.experienceId,
      booking_reference: bookingReference,
      check_in_date: data.checkInDate,
      check_out_date: data.checkOutDate,
      room_type: data.roomType,
      guest_count: data.guestCount,
      total_price: data.totalPrice,
      status: 'confirmed',
      payment_status: 'paid'
    })
    .select()
    .single();

  if (error) {
    throw new Error('Failed to create reservation');
  }

  return reservation;
}

export async function getReservations(options?: {
  status?: 'confirmed' | 'cancelled' | 'completed';
  limit?: number;
  offset?: number;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Get user ID
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .maybeSingle();

  if (userError || !userData) {
    throw new Error('User not found');
  }

  let query = supabase
    .from('reservations')
    .select(`
      *,
      experience:experiences (
        title,
        description,
        images,
        location
      )
    `)
    .eq('user_id', userData.id)
    .order('check_in_date', { ascending: true });

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error('Failed to fetch reservations');
  }

  return data;
}

export async function getReservationById(id: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .maybeSingle();

  if (userError || !userData) {
    throw new Error('User not found');
  }

  const { data, error } = await supabase
    .from('reservations')
    .select(`
      *,
      experience:experiences (
        title,
        description,
        images,
        location,
        check_in_info,
        transportation
      )
    `)
    .eq('id', id)
    .eq('user_id', userData.id)
    .single();

  if (error) {
    throw new Error('Failed to fetch reservation');
  }

  return data;
}

export async function updateReservationStatus(
  id: string,
  status: 'confirmed' | 'cancelled' | 'completed'
) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .maybeSingle();

  if (userError || !userData) {
    throw new Error('User not found');
  }

  const { data, error } = await supabase
    .from('reservations')
    .update({ status })
    .eq('id', id)
    .eq('user_id', userData.id)
    .select()
    .single();

  if (error) {
    throw new Error('Failed to update reservation status');
  }

  return data;
}