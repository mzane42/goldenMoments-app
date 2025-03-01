import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import SearchFilters from './SearchFilters';
import DateModal from './DateModal';
import type { SearchFilters as SearchFiltersType } from '../lib/api';

type SearchBarProps = {
  onSearch?: (filters: SearchFiltersType) => void;
  city?: string;
};

export default function SearchBar({ onSearch, city = 'Alger' }: SearchBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [showDates, setShowDates] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFiltersType>({
    guests: { adults: 2, children: 0, infants: 0 },
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.({ ...filters, query });
  };

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
    onSearch?.({ ...newFilters, query: searchQuery });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Rechercher une ville ou un hotel`}
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <Pressable 
          style={styles.datesButton}
          onPress={() => setShowDates(true)}
        >
          <Text style={styles.datesText}>Dates</Text>
        </Pressable>
      </View>

      <View style={styles.filterContainer}>
        <Pressable 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="options-outline" size={20} color="#000" />
        </Pressable>
        <Pressable style={styles.guestsButton}>
          <Ionicons name="people-outline" size={20} color="#000" />
          <Text style={styles.guestsText}>
            {filters.guests?.adults || 2}
          </Text>
        </Pressable>
        <Pressable style={styles.filterPill}>
          <Text style={styles.filterPillText}>Expérience</Text>
          <Ionicons name="chevron-down" size={20} color="#000" />
        </Pressable>
        <Pressable style={styles.filterPill}>
          <Text style={styles.filterPillText}>Distance</Text>
          <Ionicons name="chevron-down" size={20} color="#000" />
        </Pressable>
        <Pressable style={styles.filterPill}>
          <Text style={styles.filterPillText}>Budget</Text>
          <Ionicons name="chevron-down" size={20} color="#000" />
        </Pressable>
      </View>

      <SearchFilters 
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <DateModal
        visible={showDates}
        onClose={() => setShowDates(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop: 48,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  datesButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  datesText: {
    fontSize: 16,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestsButton: {
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 4,
  },
  guestsText: {
    fontSize: 16,
    fontWeight: '500',
  },
  filterPill: {
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 4,
  },
  filterPillText: {
    fontSize: 16,
    fontWeight: '500',
  },
});