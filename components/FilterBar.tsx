import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FilterModal from './FilterModal';
import ParticipantsModal from './ParticipantsModal';
import DistanceModal from './DistanceModal';
import StyleModal from './StyleModal';
import SituationModal from './SituationModal';
import RoomModal from './RoomModal';

type FilterBarProps = {
  onFiltersChange: (filters: any) => void;
};

export default function FilterBar({ onFiltersChange }: FilterBarProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    participants: { adults: 2, children: 0, infants: 0 },
    distance: [],
    style: [],
    situation: [],
    room: [],
  });

  const handleModalClose = () => {
    setActiveModal(null);
  };

  const handleFilterChange = (type: string, value: any) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Pressable 
          style={styles.filterPill}
          onPress={() => setActiveModal('participants')}
        >
          <Ionicons name="people-outline" size={20} color="#000" />
          <Text style={styles.filterPillText}>
            {filters.participants.adults + filters.participants.children} pers.
          </Text>
        </Pressable>

        <Pressable 
          style={styles.filterPill}
          onPress={() => setActiveModal('style')}
        >
          <Text style={styles.filterPillText}>Style</Text>
          <Ionicons name="chevron-down" size={20} color="#000" />
        </Pressable>

        <Pressable 
          style={styles.filterPill}
          onPress={() => setActiveModal('situation')}
        >
          <Text style={styles.filterPillText}>Situation</Text>
          <Ionicons name="chevron-down" size={20} color="#000" />
        </Pressable>

        <Pressable 
          style={styles.filterPill}
          onPress={() => setActiveModal('distance')}
        >
          <Text style={styles.filterPillText}>Distance</Text>
          <Ionicons name="chevron-down" size={20} color="#000" />
        </Pressable>

        <Pressable 
          style={styles.filterPill}
          onPress={() => setActiveModal('room')}
        >
          <Text style={styles.filterPillText}>Chambre</Text>
          <Ionicons name="chevron-down" size={20} color="#000" />
        </Pressable>
      </ScrollView>

      <ParticipantsModal
        visible={activeModal === 'participants'}
        onClose={handleModalClose}
        value={filters.participants}
        onChange={(value) => handleFilterChange('participants', value)}
      />

      <DistanceModal
        visible={activeModal === 'distance'}
        onClose={handleModalClose}
        value={filters.distance}
        onChange={(value) => handleFilterChange('distance', value)}
      />

      <StyleModal
        visible={activeModal === 'style'}
        onClose={handleModalClose}
        value={filters.style}
        onChange={(value) => handleFilterChange('style', value)}
      />

      <SituationModal
        visible={activeModal === 'situation'}
        onClose={handleModalClose}
        value={filters.situation}
        onChange={(value) => handleFilterChange('situation', value)}
      />

      <RoomModal
        visible={activeModal === 'room'}
        onClose={handleModalClose}
        value={filters.room}
        onChange={(value) => handleFilterChange('room', value)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterPill: {
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPillText: {
    fontSize: 16,
    fontWeight: '500',
  },
});