import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../../../lib/utils';

type DateOption = {
  id: string;
  start: string;
  end: string;
  price: number;
  originalPrice: number;
  discount: number;
  availability: number;
};

const dateOptions: DateOption[] = [
  {
    id: '1',
    start: 'Dim. 16 févr.',
    end: 'Lun. 17 févr.',
    price: 254,
    originalPrice: 318,
    discount: 20,
    availability: 1
  },
  {
    id: '2',
    start: 'Lun. 17 févr.',
    end: 'Mar. 18 févr.',
    price: 262,
    originalPrice: 328,
    discount: 20,
    availability: 0
  },
  {
    id: '3',
    start: 'Mar. 18 févr.',
    end: 'Mer. 19 févr.',
    price: 278,
    originalPrice: 348,
    discount: 20,
    availability: 1
  },
  {
    id: '4',
    start: 'Mer. 19 févr.',
    end: 'Jeu. 20 févr.',
    price: 278,
    originalPrice: 348,
    discount: 20,
    availability: 0
  },
  {
    id: '5',
    start: 'Jeu. 20 févr.',
    end: 'Ven. 21 févr.',
    price: 270,
    originalPrice: 338,
    discount: 20,
    availability: 3
  }
];

export default function DateSelectionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [selectedDuration, setSelectedDuration] = useState<'1' | '2'>('1');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState(2);

  const handleContinue = () => {
    if (selectedDate) {
      router.push(`/booking/${id}/room`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
      </View>

      <View style={styles.guestSelector}>
        <View style={styles.guestInfo}>
          <Ionicons name="people-outline" size={24} color="#000" />
          <Text style={styles.guestCount}>{guestCount} adultes</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#000" />
      </View>

      <View style={styles.durationSelector}>
        <Pressable
          style={[
            styles.durationButton,
            selectedDuration === '1' && styles.durationButtonSelected
          ]}
          onPress={() => setSelectedDuration('1')}
        >
          <Text style={[
            styles.durationButtonText,
            selectedDuration === '1' && styles.durationButtonTextSelected
          ]}>1 nuit</Text>
        </Pressable>
        <Pressable
          style={[
            styles.durationButton,
            selectedDuration === '2' && styles.durationButtonSelected
          ]}
          onPress={() => setSelectedDuration('2')}
        >
          <Text style={[
            styles.durationButtonText,
            selectedDuration === '2' && styles.durationButtonTextSelected
          ]}>2 nuits</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.dateList}>
        {dateOptions.map((date) => (
          <Pressable
            key={date.id}
            style={[
              styles.dateOption,
              selectedDate === date.id && styles.dateOptionSelected
            ]}
            onPress={() => setSelectedDate(date.id)}
            disabled={date.availability === 0}
          >
            <View style={styles.dateContent}>
              <View style={styles.dateInfo}>
                <Text style={styles.dateRange}>
                  {date.start} → {date.end}
                </Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>{formatCurrency(date.price)}</Text>
                  <Text style={styles.originalPrice}>
                    {formatCurrency(date.originalPrice)}
                  </Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>-{date.discount}%</Text>
                  </View>
                </View>
              </View>
              {date.availability > 0 && (
                <Text style={styles.availability}>
                  Plus que {date.availability}
                </Text>
              )}
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.continueButton,
            !selectedDate && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedDate}
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
  guestSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  guestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  guestCount: {
    fontSize: 16,
    fontWeight: '600',
  },
  durationSelector: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  durationButton: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  durationButtonSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  durationButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  durationButtonTextSelected: {
    color: '#FFF',
  },
  dateList: {
    flex: 1,
  },
  dateOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  dateOptionSelected: {
    backgroundColor: '#F8FAFC',
  },
  dateContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInfo: {
    flex: 1,
  },
  dateRange: {
    fontSize: 16,
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 16,
    color: '#666',
    textDecorationLine: 'line-through',
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
  availability: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
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