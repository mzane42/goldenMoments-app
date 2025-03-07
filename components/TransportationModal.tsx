import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ListingModal from './ListingModal';
import { Transportation } from '../types/experience';
import { translateTransportationKeys } from '../utils/translateTransportationKeys';
type TransportationProps = {
  transportation: Transportation;
  visible: boolean;
  onClose: () => void;
};

const TransportationModal: React.FC<TransportationProps> = ({ transportation, visible, onClose }) => {
  const hasTransportationData = Object.keys(transportation).length > 0;

  return (
    <ListingModal title="Comment s'y rendre ?" visible={visible} onClose={onClose}>
      <ScrollView>
        {
          !hasTransportationData && (
            <Text style={styles.transportationValue}>Aucune information disponible</Text>
          )
        }
        {Object.entries(transportation).map(([key, value], index) => (
        <View key={key} style={styles.scheduleItem}>
          <Text style={styles.scheduleLabel}>{translateTransportationKeys(key)}</Text>
          <Text style={styles.scheduleTime}>{value}</Text>
        </View>
      ))}
    </ScrollView>
    </ListingModal>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    padding: 16,
  },
  scheduleLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  scheduleTime: {
    fontSize: 16,
    color: '#000',
  },
  transportationValue: {
    fontSize: 16,
    color: '#000',
    marginBottom: 16,
  },
});

export default TransportationModal;