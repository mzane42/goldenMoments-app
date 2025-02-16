import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import type { Experience } from '../../types/experience';
import { LinearGradient } from 'expo-linear-gradient';

export default function WishlistScreen() {
  const [wishlistItems, setWishlistItems] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadWishlist();
    
    // Subscribe to wishlist changes
    const channel = supabase
      .channel('wishlist_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wishlists'
        },
        () => {
          loadWishlist();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadWishlist = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.replace('/');
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (!userData) {
        throw new Error('User not found');
      }

      const { data: wishlist, error: wishlistError } = await supabase
        .from('wishlists')
        .select(`
          experience_id,
          experiences (*)
        `)
        .eq('user_id', userData.id);

      if (wishlistError) throw wishlistError;

      setWishlistItems(wishlist.map(item => item.experiences as Experience));
      setError(null);
    } catch (err) {
      setError('Failed to load wishlist');
      console.error('Error loading wishlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (experienceId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.replace('/');
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (!userData) {
        throw new Error('User not found');
      }

      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', userData.id)
        .eq('experience_id', experienceId);

      if (error) throw error;

      setWishlistItems(items => items.filter(item => item.id !== experienceId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={loadWishlist}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Wishlist</Text>
        <View style={styles.emptyContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?w=800' }}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyTitle}>Wishlist vide</Text>
          <Text style={styles.emptyText}>
            Ajoutez des expériences à votre wishlist en parcourant notre catalogue.
          </Text>
          <Pressable 
            style={styles.exploreButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.exploreButtonText}>Explorer le catalogue</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Wishlist</Text>

      <View style={styles.list}>
        {wishlistItems.map((item, index) => {
          const originalPrice = Math.round(item.price * 1.25);
          const discount = Math.round((1 - item.price / originalPrice) * 100);
          
          return (
            <Pressable key={item.id} style={styles.card}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.images[0] }}
                  style={styles.image}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.gradient}
                >
                  <Text style={styles.experienceTitle}>{item.title}</Text>
                </LinearGradient>
                {index === 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Plus que 1</Text>
                  </View>
                )}
                <Pressable
                  style={styles.heartButton}
                  onPress={() => removeFromWishlist(item.id)}
                >
                  <Ionicons name="heart" size={24} color="#FF3B30" />
                </Pressable>
              </View>

              <View style={styles.content}>
                <Text style={styles.location}>{item.location.city}</Text>
                <Text style={styles.hotelName}>{item.description}</Text>
                <Text style={styles.amenities}>{item.category}</Text>
                
                <View style={styles.priceContainer}>
                  <View style={styles.priceContent}>
                    <Text style={styles.price}>{item.price}€</Text>
                    <Text style={styles.originalPrice}>{originalPrice}€</Text>
                    <Text style={styles.perNight}> / nuit</Text>
                  </View>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>-{discount}%</Text>
                  </View>
                </View>

                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#000" />
                  <Text style={styles.rating}>{item.rating}</Text>
                  <Text style={styles.reviewCount}>({item.reviewCount})</Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 24,
  },
  list: {
    padding: 16,
    gap: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    height: 240,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  experienceTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 1,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heartButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1,
  },
  content: {
    padding: 16,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  amenities: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 16,
    color: '#666',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  perNight: {
    fontSize: 16,
    color: '#666',
  },
  discountBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  emptyImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  exploreButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#DC2626',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});