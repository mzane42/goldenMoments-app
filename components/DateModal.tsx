import { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type DateModalProps = {
  visible: boolean;
  onClose: () => void;
};

const dates = [
  { start: 'Dim. 16 févr.', end: 'Lun. 17 févr.' },
  { start: 'Lun. 17 févr.', end: 'Mar. 18 févr.' },
  { start: 'Mar. 18 févr.', end: 'Mer. 19 févr.' },
  { start: 'Mer. 19 févr.', end: 'Jeu. 20 févr.' },
  { start: 'Jeu. 20 févr.', end: 'Ven. 21 févr.' },
  { start: 'Ven. 21 févr.', end: 'Sam. 22 févr.' },
  { start: 'Sam. 22 févr.', end: 'Dim. 23 févr.' },
];

export default function DateModal({ visible, onClose }: DateModalProps) {
  const [selectedDuration, setSelectedDuration] = useState<'1' | '2'>('1');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Dates</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#000" />
          </Pressable>
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

        <ScrollView style={styles.content}>
          {dates.map((date, index) => (
            <Pressable
              key={date.start}
              style={styles.dateItem}
              onPress={() => setSelectedDate(date.start)}
            >
              <View style={styles.dateContent}>
                <Text style={styles.dateText}>
                  {date.start} → {date.end}
                </Text>
                <View style={[
                  styles.checkbox,
                  selectedDate === date.start && styles.checkboxSelected
                ]}>
                  {selectedDate === date.start && (
                    <Ionicons name="checkmark" size={16} color="#FFF" />
                  )}
                </View>
              </View>
              {index < dates.length - 1 && <View style={styles.separator} />}
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.clearButton} onPress={() => setSelectedDate(null)}>
            <Text style={styles.clearButtonText}>Effacer</Text>
          </Pressable>
          <Pressable 
            style={[
              styles.applyButton,
              !selectedDate && styles.applyButtonDisabled
            ]} 
            onPress={onClose}
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
  content: {
    flex: 1,
  },
  dateItem: {
    padding: 16,
  },
  dateContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
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
  applyButtonDisabled: {
    opacity: 0.5,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
  },
});