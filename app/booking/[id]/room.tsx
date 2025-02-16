import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type RoomOption = {
  id: string;
  name: string;
  price: number;
  size: number;
  bedType: string;
  amenities: string[];
  images: string[];
};

const roomOptions: RoomOption[] = [
  {
    id: 'superior',
    name: 'Supérieure',
    price: 16,
    size: 22,
    bedType: 'Lit double queen size',
    amenities: ['Douche', 'Douche effet pluie', 'TV'],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
    ]
  },
  {
    id: 'deluxe',
    name: 'Deluxe',
    price: 32,
    size: 28,
    bedType: 'Lit king size',
    amenities: ['Douche', 'Baignoire', 'TV', 'Mini bar'],
    images: [
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'
    ]
  }
];

export default function RoomSelectionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleContinue = () => {
    if (selectedRoom) {
      router.push(`/booking/${id}/payment`);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </Pressable>
          <Text style={styles.title}>Choisir une chambre</Text>
        </View>

        {roomOptions.map((room) => (
          <View key={room.id} style={styles.roomCard}>
            <Image
              source={{ uri: room.images[currentImageIndex] }}
              style={styles.roomImage}
            />
            <View style={styles.imageIndicators}>
              {room.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === currentImageIndex && styles.indicatorActive
                  ]}
                />
              ))}
            </View>

            <View style={styles.roomInfo}>
              <View style={styles.roomHeader}>
                <Text style={styles.roomName}>{room.name}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>+</Text>
                  <Text style={styles.price}>{room.price}€</Text>
                </View>
              </View>

              <View style={styles.amenitiesGrid}>
                <View style={styles.amenityItem}>
                  <Ionicons name="resize" size={24} color="#000" />
                  <Text style={styles.amenityValue}>{room.size}m²</Text>
                </View>
                <View style={styles.amenityItem}>
                  <Ionicons name="bed-outline" size={24} color="#000" />
                  <Text style={styles.amenityValue}>{room.bedType}</Text>
                </View>
                {room.amenities.map((amenity) => (
                  <View key={amenity} style={styles.amenityItem}>
                    <Ionicons
                      name={
                        amenity === 'TV' ? 'tv-outline' :
                        amenity === 'Douche' ? 'water-outline' :
                        amenity === 'Douche effet pluie' ? 'rainy-outline' :
                        amenity === 'Mini bar' ? 'wine-outline' :
                        'ellipse-outline'
                      }
                      size={24}
                      color="#000"
                    />
                    <Text style={styles.amenityValue}>{amenity}</Text>
                  </View>
                ))}
              </View>

              <Pressable
                style={[
                  styles.selectButton,
                  selectedRoom === room.id && styles.selectButtonSelected
                ]}
                onPress={() => setSelectedRoom(room.id)}
              >
                <Text style={[
                  styles.selectButtonText,
                  selectedRoom === room.id && styles.selectButtonTextSelected
                ]}>
                  {selectedRoom === room.id ? 'Sélectionnée' : 'Upgrader'}
                </Text>
                {selectedRoom === room.id && (
                  <Text style={styles.selectButtonPrice}>+{room.price}€</Text>
                )}
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.continueButton,
            !selectedRoom && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedRoom}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  roomCard: {
    marginBottom: 24,
  },
  roomImage: {
    width: '100%',
    height: 240,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 240,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  indicatorActive: {
    backgroundColor: '#FFFFFF',
  },
  roomInfo: {
    padding: 16,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  roomName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  amenityItem: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amenityValue: {
    fontSize: 14,
  },
  selectButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  selectButtonSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectButtonTextSelected: {
    color: '#FFFFFF',
  },
  selectButtonPrice: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  continueButton: {
    height: 56,
    backgroundColor: '#000',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});