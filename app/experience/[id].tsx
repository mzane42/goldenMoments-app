import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { toggleWishlist, getExperienceById } from '../../lib/api';
import type { Experience } from '../../types/experience';
import { supabase } from '../../lib/supabase';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
  withSequence
} from 'react-native-reanimated';
import Markdown from 'react-native-marked';
import SchedulesModal from '@/components/SchedulesModal';
import TransportationModal from '@/components/TransportationModal';
import AccessibilityModal from '@/components/AccessibilityModal';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Extra = {
  id: string;
  name: string;
  price: number;
  icon: string;
  description: string;
};

const extras: Extra[] = [
  {
    id: 'rose',
    name: 'Pétales de rose',
    price: 20,
    icon: '🌹',
    description: 'par séjour'
  },
  {
    id: 'wine',
    name: 'Bouteille de vin',
    price: 30,
    icon: '🍾',
    description: 'par séjour'
  },
  {
    id: 'late',
    name: 'Late check-out',
    price: 50,
    icon: '⏰',
    description: 'par séjour'
  }
];

export default function ExperienceScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const scale = useSharedValue(1);


  useEffect(() => {
    // load experience
    loadExperience();
  }, [id]);

  const loadExperience = async () => {
    try {
      setIsLoading(true);
      const experienceData = await getExperienceById(id as string);
      setExperience(experienceData);

      // Check if experience is in user's wishlist
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', user.id)
          .single();

        if (userData) {
          const { data: wishlistItem } = await supabase
            .from('wishlists')
            .select('id')
            .eq('user_id', userData.id)
            .eq('experience_id', id)
            .maybeSingle();

          setIsWishlisted(!!wishlistItem);
        }
      }

      setError(null);
    } catch (err) {
      setError('Failed to load experience');
      console.error('Error loading experience:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlist = async () => {
    try {
      scale.value = withSequence(
        withSpring(1.2),
        withSpring(1)
      );
      const added = await toggleWishlist(id as string);
      setIsWishlisted(added);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const handleShare = () => {
    // Implement share functionality
  };

  const toggleExtra = (extraId: string) => {
    setSelectedExtras(prev => {
      const next = new Set(prev);
      if (next.has(extraId)) {
        next.delete(extraId);
      } else {
        next.add(extraId);
      }
      return next;
    });
  };

  const handleContinue = () => {
    router.push(`/booking/${id}/date`);
  };

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (error || !experience) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Experience not found'}</Text>
        <Pressable style={styles.retryButton} onPress={loadExperience}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  const originalPrice = Math.round(experience.price * 1.25);
  const discount = Math.round((1 - experience.price / originalPrice) * 100);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        {/* Hero Section */}
        <View style={[styles.heroContainer, { height: width }]}>
          <Image
            source={{ uri: experience.images[0] }}
            style={styles.heroImage}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.8)']}
            style={styles.heroGradient}
          >
            <View style={styles.heroHeader}>
              <Pressable 
                style={styles.iconButton}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={24} color="#FFF" />
              </Pressable>
              <View style={styles.headerRight}>
                <AnimatedPressable 
                  style={[styles.iconButton, heartAnimatedStyle]}
                  onPress={handleWishlist}
                >
                  <Ionicons 
                    name={isWishlisted ? "heart" : "heart-outline"} 
                    size={24} 
                    color={isWishlisted ? "#FF3B30" : "#FFF"} 
                  />
                </AnimatedPressable>
                <Pressable 
                  style={styles.iconButton}
                  onPress={handleShare}
                >
                  <Ionicons name="share-outline" size={24} color="#FFF" />
                </Pressable>
              </View>
            </View>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{experience.title}</Text>
              <Pressable style={styles.discoverButton}>
                <Ionicons name="eye-outline" size={20} color="#000" />
                <Text style={styles.discoverButtonText}>Découvrir</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.hotelName}>{experience.description}</Text>
          <View style={styles.locationContainer}>
            <Text style={styles.location}>{experience.location.city}</Text>
            <Pressable style={styles.mapButton}>
              <Text style={styles.mapButtonText}>Carte</Text>
            </Pressable>
          </View>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color="#000" />
            <Text style={styles.rating}>{experience.rating}</Text>
            <Text style={styles.reviewCount}>({experience.reviewCount})</Text>
          </View>

          <Text style={styles.description}>
            <Markdown>{experience.long_description}</Markdown>
          </Text>

          {/* Included Services */}
          <Text style={styles.sectionTitle}>L'expérience</Text>
          <View style={styles.servicesGrid}>
            <View style={styles.serviceItem}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400' }}
                style={styles.serviceImage}
              />
              <View style={styles.serviceContent}>
                <Text style={styles.serviceLabel}>Inclus</Text>
                <Text style={styles.serviceName}>Chambre Double Classique</Text>
              </View>
            </View>
          </View>

          {/* Extras */}
          <Text style={styles.sectionTitle}>Les extras</Text>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.extrasContainer}
            snapToInterval={160 + 16}
            decelerationRate="fast"
          >
            {extras.map(extra => (
              <Pressable
                key={extra.id}
                style={[
                  styles.extraItem,
                  selectedExtras.has(extra.id) && styles.extraItemSelected
                ]}
                onPress={() => toggleExtra(extra.id)}
              >
                <Text style={styles.extraIcon}>{extra.icon}</Text>
                <Text style={[
                  styles.extraPrice,
                  selectedExtras.has(extra.id) && styles.extraTextSelected
                ]}>+{extra.price}€</Text>
                <Text style={[
                  styles.extraName,
                  selectedExtras.has(extra.id) && styles.extraTextSelected
                ]}>{extra.name}</Text>
                <Text style={[
                  styles.extraDescription,
                  selectedExtras.has(extra.id) && styles.extraTextSelected
                ]}>{extra.description}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Reviews */}
          <View style={styles.reviewsContainer}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.reviewsTitle}>Retour d'expérience</Text>
              <View style={styles.reviewsSummary}>
                <Text style={styles.reviewsScore}>{experience.rating}</Text>
                <Text style={styles.reviewsCount}>{experience.reviewCount} avis</Text>
              </View>
              <Pressable style={styles.reviewsButton}>
                <Text style={styles.reviewsButtonText}>Voir les avis</Text>
              </Pressable>
            </View>
            
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                  <Text style={styles.reviewerName}>Samy</Text>
                  <Text style={styles.reviewDate}>Reservation du 15/02/25</Text>
                </View>
                <View style={styles.reviewRating}>
                  <Ionicons name="star" size={16} color="#000" />
                  <Text style={styles.reviewScore}>4.8</Text>
                </View>
              </View>
              <Text style={styles.reviewText}>Très belle expérience</Text>
            </View>
          </View>

          {/* Practical Info */}
          <Text style={styles.sectionTitle}>Infos pratiques</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Check in</Text>
              
              <Text style={styles.infoValue}>À partir de {experience.check_in_info.check_in}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Check out</Text>
              <Text style={styles.infoValue}>Jusqu'à {experience.check_in_info.check_out}</Text>
            </View>
          </View>

          <Pressable onPress={() => setModal('schedules')} style={styles.infoButton}>
            <Ionicons name="time-outline" size={24} color="#000" />
            <Text style={styles.infoButtonText}>Horaires</Text>
            <Ionicons name="chevron-forward" size={24} color="#000" />
          </Pressable>

          <Pressable onPress={() => setModal('transportation')} style={styles.infoButton}>
            <Ionicons name="map-outline" size={24} color="#000" />
            <Text style={styles.infoButtonText}>Comment s'y rendre ?</Text>
            <Ionicons name="chevron-forward" size={24} color="#000" />
          </Pressable>

          <Pressable onPress={() => setModal('accessibility')} style={styles.infoButton}>
            <Ionicons name="accessibility-outline" size={24} color="#000" />
            <Text style={styles.infoButtonText}>Services et accessibilité</Text>
            <Ionicons name="chevron-forward" size={24} color="#000" />
          </Pressable>

          {/* Modals */}
          <SchedulesModal schedules={experience.schedules} visible={modal === 'schedules'} onClose={() => setModal(null)} />
          <TransportationModal transportation={experience.transportation} visible={modal === 'transportation'} onClose={() => setModal(null)} />
          <AccessibilityModal accessibility={experience.accessibility} visible={modal === 'accessibility'} onClose={() => setModal(null)} />
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <View style={styles.priceContent}>
            <Text style={styles.price}>{experience.price}€</Text>
            <Text style={styles.originalPrice}>{originalPrice}€</Text>
            <Text style={styles.perNight}> / nuit</Text>
          </View>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        </View>
        <Pressable 
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continuer</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroContainer: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  discoverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  discoverButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 24,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  location: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  mapButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  mapButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  servicesGrid: {
    gap: 16,
    marginBottom: 24,
  },
  serviceItem: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: 200,
  },
  serviceContent: {
    padding: 16,
    backgroundColor: '#F3F4F6',
  },
  serviceLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 16,
  },
  extrasContainer: {
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: 8,
  },
  extraItem: {
    width: 160,
    height: 160,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraItemSelected: {
    backgroundColor: '#000',
  },
  extraIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  extraPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  extraName: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  extraDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  extraTextSelected: {
    color: '#FFFFFF',
  },
  reviewsContainer: {
    marginBottom: 24,
  },
  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  reviewsSummary: {
    alignItems: 'center',
  },
  reviewsScore: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  reviewsCount: {
    fontSize: 14,
    color: '#666',
  },
  reviewsButton: {
    marginLeft: 16,
  },
  reviewsButtonText: {
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  reviewCard: {
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  reviewDate: {
    fontSize: 14,
    color: '#666',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewScore: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 16,
  },
  infoContainer: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    marginBottom: 16,
  },
  infoButtonText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  bottomBar: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  },
  continueButton: {
    height: 48,
    backgroundColor: '#000',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
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