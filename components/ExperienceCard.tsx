import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ImageBackground, GestureResponderEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming,
  useSharedValue
} from 'react-native-reanimated';
import { toggleWishlist } from '../lib/api';
import type { Experience } from '../types/experience';

type Props = {
  experience: Experience;
  size?: 'large' | 'regular';
  showBadge?: boolean;
  isWishlisted?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ExperienceCard({ 
  experience, 
  size = 'regular',
  showBadge = true,
  isWishlisted = false,
}: Props) {
  const router = useRouter();
  const scale = useSharedValue(1);
  const heartScale = useSharedValue(1);
  const [isInWishlist, setIsInWishlist] = useState(isWishlisted);

  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(experience.price);

  const originalPrice = experience.price * 1.25;
  const formattedOriginalPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(originalPrice);

  const discount = Math.round((1 - experience.price / originalPrice) * 100);

  const handleWishlist = async (e: GestureResponderEvent) => {
    e.stopPropagation();
    try {
      // Animate heart
      heartScale.value = withSequence(
        withSpring(1.2),
        withSpring(1)
      );

      const added = await toggleWishlist(experience.id);
      setIsInWishlist(added);

      // Feedback animation
      scale.value = withSequence(
        withTiming(0.95, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const handlePress = () => {
    router.push(`/experience/${experience.id}`);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }]
  }));

  return (
    <AnimatedPressable
      style={[styles.container, size === 'large' && styles.containerLarge, animatedStyle]}
      onPress={handlePress}
    >
      <ImageBackground
        source={{ uri: experience.images[0] }}
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        {showBadge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Plus que 3</Text>
          </View>
        )}
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.overlay}
        >
          <Text style={styles.title}>{experience.title.toUpperCase()}</Text>
        </LinearGradient>

        <AnimatedPressable 
          style={[styles.wishlistButton, heartAnimatedStyle]}
          onPress={handleWishlist}
        >
          <Ionicons 
            name={isInWishlist ? "heart" : "heart-outline"} 
            size={24} 
            color={isInWishlist ? "#FF3B30" : "#FFF"} 
          />
        </AnimatedPressable>
      </ImageBackground>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.location}>{experience.location.city}</Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color="#000" />
            <Text style={styles.ratingText}>
              {experience.rating} ({experience.reviewCount}+)
            </Text>
          </View>
        </View>

        <Text style={styles.hotelName} numberOfLines={1}>
          {experience.description}
        </Text>

        <Text style={styles.amenities}>
          {experience.category} • {experience.description}
        </Text>

        <View style={styles.priceContainer}>
          <View style={styles.priceContent}>
            <Text style={styles.price}>{formattedPrice}</Text>
            <Text style={styles.originalPrice}>{formattedOriginalPrice}</Text>
            <Text style={styles.perNight}> / nuit</Text>
          </View>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  containerLarge: {
    marginBottom: 32,
  },
  image: {
    height: 240,
    width: '100%',
  },
  imageStyle: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
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
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    height: '50%',
  },
  title: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  wishlistButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
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
});