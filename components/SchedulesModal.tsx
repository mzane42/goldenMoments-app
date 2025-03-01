import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ListingModal from './ListingModal';
import { Schedules } from '../types/experience';
import { translateScheduleKeys } from '../utils/translateScheduleKeys';
type SchedulesProps = {
  schedules: Schedules;
  visible: boolean;
  onClose: () => void;
};

const SchedulesModal: React.FC<SchedulesProps> = ({ schedules, visible, onClose }) => {
  const hasSchedulesData = Object.keys(schedules).length > 0;

  return (
    <ListingModal title="Horaires" visible={visible} onClose={onClose}>
      <ScrollView>
        {
          !hasSchedulesData && (
            <Text style={styles.scheduleValue}>Aucune information disponible</Text>
          )
        }
        {Object.entries(schedules).map(([key, value], index) => (
        <View key={key} style={styles.scheduleItem}>
          <Text style={styles.scheduleLabel}>{translateScheduleKeys(key)}</Text>
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
  scheduleValue: {
    fontSize: 16,
    color: '#000',
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
});

export default SchedulesModal;