import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type FilterModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedFilters: string[];
  onFiltersChange: (filters: string[]) => void;
};

const filterSections = [
  {
    title: 'Trier par',
    items: [{ id: 'relevance', label: 'Pertinence' }],
  },
  {
    title: 'Participants',
    items: [{ id: 'adults', label: '2 adultes' }],
  },
  {
    title: 'Expériences',
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
    title: 'Food & Drinks',
    items: [
      { id: 'breakfast', label: 'Petit déjeuner', count: 568 },
      { id: 'brunch', label: 'Brunch', count: 19 },
      { id: 'lunch', label: 'Déjeuner', count: 30 },
    ],
  },
];

export default function FilterModal({ visible, onClose, selectedFilters, onFiltersChange }: FilterModalProps) {
  const toggleFilter = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter(id => id !== filterId)
      : [...selectedFilters, filterId];
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    onFiltersChange([]);
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
          {filterSections.map((section, index) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map(item => (
                <Pressable
                  key={item.id}
                  style={styles.filterItem}
                  onPress={() => toggleFilter(item.id)}
                >
                  <View style={styles.filterItemContent}>
                    <Text style={styles.filterItemLabel}>
                      {item.label}
                      {item.count && ` (${item.count})`}
                    </Text>
                    <View style={[
                      styles.checkbox,
                      selectedFilters.includes(item.id) && styles.checkboxSelected
                    ]}>
                      {selectedFilters.includes(item.id) && (
                        <Ionicons name="checkmark" size={16} color="#FFF" />
                      )}
                    </View>
                  </View>
                </Pressable>
              ))}
              {index < filterSections.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.clearButton} onPress={clearFilters}>
            <Text style={styles.clearButtonText}>Tout effacer</Text>
          </Pressable>
          <Pressable style={styles.applyButton} onPress={onClose}>
            <Text style={styles.applyButtonText}>
              Voir {568} résultats
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
  },
  sectionTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
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
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  separator: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginTop: 16,
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