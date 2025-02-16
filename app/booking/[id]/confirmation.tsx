import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ConfirmationScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={64} color="#22C55E" />
        </View>

        <Text style={styles.title}>Réservation confirmée !</Text>
        <Text style={styles.subtitle}>
          Votre réservation a été confirmée et un email de confirmation vous a été envoyé.
        </Text>

        <View style={styles.bookingDetails}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800' }}
            style={styles.hotelImage}
          />
          <View style={styles.detailsContent}>
            <Text style={styles.hotelName}>La Drawing House</Text>
            <Text style={styles.dateRange}>Mar. 18 févr. → Mer. 19 févr.</Text>
            <Text style={styles.roomType}>Chambre Supérieure • 2 adultes</Text>
          </View>
        </View>

        <View style={styles.referenceContainer}>
          <Text style={styles.referenceLabel}>Numéro de réservation</Text>
          <Text style={styles.referenceNumber}>STY-2024-02-18-001</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={styles.viewBookingButton}
          onPress={() => router.push('/bookings')}
        >
          <Text style={styles.viewBookingButtonText}>
            Voir ma réservation
          </Text>
        </Pressable>
        <Pressable
          style={styles.homeButton}
          onPress={() => router.push('/')}
        >
          <Text style={styles.homeButtonText}>
            Retour à l'accueil
          </Text>
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
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  bookingDetails: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  hotelImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailsContent: {
    gap: 4,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateRange: {
    fontSize: 16,
    color: '#666',
  },
  roomType: {
    fontSize: 16,
  },
  referenceContainer: {
    alignItems: 'center',
  },
  referenceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  referenceNumber: {
    fontSize: 18,
    fontWeight: '600', },
  footer: {
    padding: 24,
    gap: 12,
  },
  viewBookingButton: {
    height: 56,
    backgroundColor: '#000',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewBookingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  homeButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});