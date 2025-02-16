import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const distances = [
  { id: '0-5', label: 'Moins de 5km', count: 247 },
  { id: '5-20', label: 'De 5 à 20km', count: 59 },
  { id: '20-50', label: 'De 20 à 50km', count: 51 },
  { id: '50-100', label: 'De 50 à 100km', count: 28 },
  { id: '100-250', label: 'De 100 à 250km', count: 141 },
];

type DistanceModalProps = {
  visible: boolean;
  onClose: () => void;
  value: string[];
  onChange: (value: string[]) => void;
};

export default function DistanceModal({ 
  visible, 
  onClose, 
  value,
  onChange 
}: DistanceModalProps) {
  const toggleDistance = (id: string) => {
    const newValue = value.includes(id)
      ? value.filter(v => v !== id)
      : [...value, id];
    onChange(newValue);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Distance</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </Pressable>
          </View>

          <View style={styles.content}>
            {distances.map(distance => (
              <Pressable
                key={distance.id}
                style={styles.distanceRow}
                onPress={() => toggleDistance(distance.id)}
              >
                <View style={styles.distanceInfo}>
                  <Text style={styles.distanceLabel}>{distance.label}</Text>
                  <Text style={styles.distanceCount}>({distance.count})</Text>
                </View>
                <View style={[
                  styles.checkbox,
                  value.includes(distance.id) && styles.checkboxSelected
                ]}>
                  {value.includes(distance.id) && (
                    <Ionicons name="checkmark" size={16} color="#FFF" />
                  )}
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.footer}>
            <Pressable 
              style={styles.clearButton}
              onPress={() => onChange([])}
            >
              <Text style={styles.clearButtonText}>Effacer</Text>
            </Pressable>
            <Pressable style={styles.applyButton} onPress={onClose}>
              <Text style={styles.applyButtonText}>
                Voir 568 résultats
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
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
    padding: 24,
  },
  distanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  distanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distanceLabel: {
    fontSize: 16,
  },
  distanceCount: {
    fontSize: 16,
    color: '#666',
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