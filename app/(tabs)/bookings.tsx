import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getReservations } from '../../lib/api';
import type { Reservation } from '../../lib/api';
import { formatCurrency } from '../../lib/utils';

type ReservationWithExperience = Reservation & {
  experience: {
    title: string;
    description: string;
    images: string[];
    location: {
      city: string;
    };
  };
};

type Filter = 'upcoming' | 'past' | 'cancelled';

export default function BookingsScreen() {
  const router = useRouter();
  const [reservations, setReservations] = useState<ReservationWithExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('upcoming');

  useEffect(() => {
    loadReservations();
  }, [filter]);

  const loadReservations = async () => {
    try {
      setIsLoading(true);
      const data = await getReservations({
        status: filter === 'cancelled' ? 'cancelled' : 'confirmed'
      });
      
      // Filter reservations based on date
      const now = new Date();
      const filtered = data.filter((reservation: ReservationWithExperience) => {
        const checkInDate = new Date(reservation.check_in_date);
        if (filter === 'upcoming') {
          return checkInDate >= now;
        } else if (filter === 'past') {
          return checkInDate < now;
        }
        return true; // For cancelled reservations, show all
      });

      setReservations(filtered);
      setError(null);
    } catch (err) {
      setError('Failed to load reservations');
      console.error('Error loading reservations:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadReservations();
  };

  const handleCancelReservation = async (id: string) => {
    try {
      // Show confirmation dialog
      // If confirmed, update reservation status
      // Refresh reservations list
    } catch (error) {
      console.error('Error cancelling reservation:', error);
    }
  };

  if (isLoading && !isRefreshing) {
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
        <Pressable style={styles.retryButton} onPress={loadReservations}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Réservations</Text>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          <Pressable
            style={[
              styles.filterButton,
              filter === 'upcoming' && styles.filterButtonSelected
            ]}
            onPress={() => setFilter('upcoming')}
          >
            <Text style={[
              styles.filterButtonText,
              filter === 'upcoming' && styles.filterButtonTextSelected
            ]}>À venir</Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterButton,
              filter === 'past' && styles.filterButtonSelected
            ]}
            onPress={() => setFilter('past')}
          >
            <Text style={[
              styles.filterButtonText,
              filter === 'past' && styles.filterButtonTextSelected
            ]}>Passées</Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterButton,
              filter === 'cancelled' && styles.filterButtonSelected
            ]}
            onPress={() => setFilter('cancelled')}
          >
            <Text style={[
              styles.filterButtonText,
              filter === 'cancelled' && styles.filterButtonTextSelected
            ]}>Annulées</Text>
          </Pressable>
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {reservations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?w=800' }}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyTitle}>Aucune réservation</Text>
            <Text style={styles.emptyText}>
              Vous n'avez pas encore de réservation{' '}
              {filter === 'upcoming' ? 'à venir' : filter === 'past' ? 'passée' : 'annulée'}.
            </Text>
            <Pressable 
              style={styles.exploreButton}
              onPress={() => router.push('/')}
            >
              <Text style={styles.exploreButtonText}>Explorer le catalogue</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.reservationsList}>
            {reservations.map((reservation) => (
              <Pressable
                key={reservation.id}
                style={styles.reservationCard}
                onPress={() => router.push(`/booking/${reservation.id}`)}
              >
                <Image
                  source={{ uri: reservation.experience.images[0] }}
                  style={styles.reservationImage}
                />
                <View style={styles.reservationContent}>
                  <View style={styles.reservationHeader}>
                    <Text style={styles.reservationTitle}>
                      {reservation.experience.title}
                    </Text>
                    <Text style={styles.reservationLocation}>
                      {reservation.experience.location.city}
                    </Text>
                  </View>

                  <View style={styles.reservationDetails}>
                    <View style={styles.detailRow}>
                      <Ionicons name="calendar-outline" size={16} color="#666" />
                      <Text style={styles.detailText}>
                        {new Date(reservation.check_in_date).toLocaleDateString('fr-FR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short'
                        })}
                        {' → '}
                        {new Date(reservation.check_out_date).toLocaleDateString('fr-FR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short'
                        })}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="people-outline" size={16} color="#666" />
                      <Text style={styles.detailText}>
                        {reservation.guest_count} adultes
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="bed-outline" size={16} color="#666" />
                      <Text style={styles.detailText}>
                        {reservation.room_type}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.reservationFooter}>
                    <Text style={styles.reservationPrice}>
                      {formatCurrency(reservation.total_price)}
                    </Text>
                    {filter === 'upcoming' && (
                      <Pressable
                        style={styles.cancelButton}
                        onPress={() => handleCancelReservation(reservation.id)}
                      >
                        <Text style={styles.cancelButtonText}>Annuler</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
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
  filterContainer: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
    height: '100%',
  },
  filterButton: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },
  filterButtonSelected: {
    backgroundColor: '#000',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextSelected: {
    color: '#FFF',
  },
  content: {
    flex: 1,
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
  reservationsList: {
    padding: 16,
    gap: 16,
  },
  reservationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  reservationImage: {
    width: '100%',
    height: 200,
  },
  reservationContent: {
    padding: 16,
  },
  reservationHeader: {
    marginBottom: 12,
  },
  reservationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reservationLocation: {
    fontSize: 16,
    color: '#666',
  },
  reservationDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  reservationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reservationPrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#DC2626',
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