import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ExperienceCard from '../../components/ExperienceCard';
import SearchBar from '../../components/SearchBar';
import { getExperiences, getWishlistItems } from '../../lib/api';
import type { Experience } from '../../types/experience';

const categories = [
  { id: 'spa', icon: '🛁', label: 'Spa' },
  { id: 'diner', icon: '🍽️', label: 'Dîner' },
  { id: 'late-checkout', icon: '🌙', label: 'Late check-out' },
  { id: 'nature', icon: '🌿', label: 'Au vert' },
  { id: 'chateau', icon: '🏰', label: 'Château' },
  { id: 'hammam', icon: '💆‍♂️', label: 'Hammam' },
];

const sections = [
  { id: 'best-rated', title: 'Les mieux notés' },
  { id: 'nearest', title: 'Les plus proches de vous' },
  { id: 'popular', title: 'Les plus populaires' },
];

export default function HomeTab() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [experiencesData, wishlistData] = await Promise.all([
        getExperiences(),
        getWishlistItems()
      ]);
      
      setExperiences(experiencesData);
      setWishlistIds(new Set(wishlistData.map(item => item.experience_id)));
      setError(null);
    } catch (err) {
      setError('Failed to load experiences');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
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
        <Pressable style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SearchBar />
      
      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Explorer par expérience</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {categories.map(category => (
            <Pressable
              key={category.id}
              style={styles.categoryButton}
              onPress={() => setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              )}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryLabel}>{category.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {sections.map(section => (
        <View key={section.id} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Pressable>
              <Ionicons name="chevron-forward" size={24} color="#000" />
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sectionContent}
          >
            {experiences.map(experience => (
              <View key={experience.id} style={styles.cardWrapper}>
                <ExperienceCard
                  experience={experience}
                  size={section.id === 'best-rated' ? 'large' : 'regular'}
                  isWishlisted={wishlistIds.has(experience.id)}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
    </SafeAreaView>

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
  categoriesContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  categories: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: 8,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionContent: {
    paddingHorizontal: 16,
  },
  cardWrapper: {
    width: 320,
    marginRight: 16,
  },
});