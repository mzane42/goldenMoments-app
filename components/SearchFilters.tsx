import { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { SearchFilters } from '../lib/api';

type Props = {
  visible: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
};

const filterSections = [
  {
    title: 'Trier par',
    items: [{ id: 'relevance', label: 'Pertinence' }],
  },
  {
    title: 'Participants',
    type: 'guests',
    items: [
      { id: 'adults', label: 'Adultes', min: 1, max: 10 },
      { id: 'children', label: 'Enfants', description: '2 à 12 ans.', min: 0, max: 6 },
      { id: 'infants', label: 'Bébés', description: '- 2 ans.', min: 0, max: 4 },
    ],
  },
  {
    title: 'Expériences',
    type: 'amenities',
    items: [
      { id: 'pool', label: 'Piscine', count: 136 },
      { id: 'late-checkout', label: 'Late check-out', count: 321 },
      { id: 'sauna', label: 'Sauna', count: 194 },
      { id: 'hammam', label: 'Hammam', count: 146 },
      { id: 'spa', label: 'Spa', count: 293 },
      { id: 'whirlpool', label: 'Bain à remous', count: 81 },
    ],
  },
  {
    title: 'Distance',
    type: 'distance',
    items: [
      { id: '0-5', label: 'Moins de 5km', count: 247 },
      { id: '5-20', label: 'De 5 à 20km', count: 59 },
      { id: '20-50', label: 'De 20 à 50km', count: 51 },
      { id: '50-100', label: 'De 50 à 100km', count: 28 },
      { id: '100-250', label: 'De 100 à 250km', count: 141 },
    ],
  },
  {
    title: 'Food & Drinks',
    type: 'amenities',
    items: [
      { id: 'breakfast', label: 'Petit déjeuner', count: 568 },
      { id: 'brunch', label: 'Brunch', count: 19 },
      { id: 'lunch', label: 'Déjeuner', count: 30 },
    ],
  },
];

export default function SearchFilters({ visible, onClose, filters, onFiltersChange }: Props) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  const handleGuestChange = (type: string, value: number) => {
    setLocalFilters(prev => ({
      ...prev,
      guests: {
        ...prev.guests,
        [type]: value,
      },
    }));
  };

  const toggleAmenity = (amenityId: string) => {
    setLocalFilters(prev => {
      const amenities = prev.amenities || [];
      const newAmenities = amenities.includes(amenityId)
        ? amenities.filter(id => id !== amenityId)
        : [...amenities, amenityId];
      
      return {
        ...prev,
        amenities: newAmenities,
      };
    });
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const clearFilters = () => {
    const emptyFilters: SearchFilters = {
      guests: { adults: 2, children: 0, infants: 0 },
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Filtres</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#000" />
          </Pressable>
        </View>

        <ScrollView style={styles.content}>
          {filterSections.map(section => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              
              {section.type === 'guests' ? (
                <View style={styles.guestsContainer}>
                  {section.items.map(item => (
                    <View key={item.id} style={styles.guestRow}>
                      <View>
                        <Text style={styles.guestLabel}>{item.label}</Text>
                        {item.description && (
                          <Text style={styles.guestDescription}>{item.description}</Text>
                        )}
                      </View>
                      <View style={styles.guestControls}>
                        <Pressable
                          style={[
                            styles.guestButton,
                            localFilters.guests?.[item.id] <= item.min && styles.guestButtonDisabled
                          ]}
                          onPress={() => handleGuestChange(
                            item.id,
                            (localFilters.guests?.[item.id] || 0) - 1
                          )}
                          disabled={localFilters.guests?.[item.id] <= item.min}
                        >
                          <Ionicons name="remove" size={24} color="#000" />
                        </Pressable>
                        <Text style={styles.guestCount}>
                          {localFilters.guests?.[item.id] || 0}
                        </Text>
                        <Pressable
                          style={[
                            styles.guestButton,
                            localFilters.guests?.[item.id] >= item.max && styles.guestButtonDisabled
                          ]}
                          onPress={() => handleGuestChange(
                            item.id,
                            (localFilters.guests?.[item.id] || 0) + 1
                          )}
                          disabled={localFilters.guests?.[item.id] >= item.max}
                        >
                          <Ionicons name="add" size={24} color="#000" />
                        </Pressable>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                section.items.map(item => (
                  <Pressable
                    key={item.id}
                    style={styles.filterItem}
                    onPress={() => toggleAmenity(item.id)}
                  >
                    <View style={styles.filterItemContent}>
                      <Text style={[
                        styles.filterItemLabel,
                        localFilters.amenities?.includes(item.id) && styles.filterItemLabelSelected
                      ]}>
                        {item.label}
                        <Text style={[
                          styles.filterItemCount,
                          localFilters.amenities?.includes(item.id) && styles.filterItemCountSelected
                        ]}>
                          {item.count && ` (${item.count})`}
                        </Text>
                      </Text>
                      <View style={[
                        styles.checkbox,
                        localFilters.amenities?.includes(item.id) && styles.checkboxSelected
                      ]}>
                        {localFilters.amenities?.includes(item.id) && (
                          <Ionicons name="checkmark" size={16} color="#FFF" />
                        )}
                      </View>
                    </View>
                  </Pressable>
                ))
              )}
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable 
            style={styles.clearButton}
            onPress={clearFilters}
          >
            <Text style={styles.clearButtonText}>Tout effacer</Text>
          </Pressable>
          <Pressable 
            style={styles.applyButton}
            onPress={handleApply}
          >
            <Text style={styles.applyButtonText}>
              Voir 568 résultats
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  guestsContainer: {
    gap: 24,
  },
  guestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guestLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  guestDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  guestControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  guestButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestButtonDisabled: {
    opacity: 0.5,
  },
  guestCount: {
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 24,
    textAlign: 'center',
  },
  filterItem: {
    paddingVertical: 12,
  },
  filterItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterItemLabel: {
    fontSize: 16,
  },
  filterItemLabelSelected: {
    color: '#FFFFFF',
  },
  filterItemCount: {
    color: '#666',
  },
  filterItemCountSelected: {
    color: '#FFFFFF',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  applyButton: {
    flex: 2,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: '#000',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
  },
});