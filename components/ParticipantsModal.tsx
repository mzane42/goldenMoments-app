import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ParticipantsModalProps = {
  visible: boolean;
  onClose: () => void;
  value: {
    adults: number;
    children: number;
    infants: number;
  };
  onChange: (value: any) => void;
};

export default function ParticipantsModal({ 
  visible, 
  onClose, 
  value,
  onChange 
}: ParticipantsModalProps) {
  const handleIncrement = (type: 'adults' | 'children' | 'infants') => {
    const limits = {
      adults: 10,
      children: 6,
      infants: 4
    };
    
    if (value[type] < limits[type]) {
      onChange({ ...value, [type]: value[type] + 1 });
    }
  };

  const handleDecrement = (type: 'adults' | 'children' | 'infants') => {
    const mins = {
      adults: 1,
      children: 0,
      infants: 0
    };
    
    if (value[type] > mins[type]) {
      onChange({ ...value, [type]: value[type] - 1 });
    }
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
            <Text style={styles.title}>Participants</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.participantRow}>
              <View>
                <Text style={styles.participantLabel}>Adultes</Text>
              </View>
              <View style={styles.controls}>
                <Pressable 
                  style={[styles.button, value.adults <= 1 && styles.buttonDisabled]}
                  onPress={() => handleDecrement('adults')}
                  disabled={value.adults <= 1}
                >
                  <Ionicons name="remove" size={24} color={value.adults <= 1 ? "#999" : "#000"} />
                </Pressable>
                <Text style={styles.count}>{value.adults}</Text>
                <Pressable 
                  style={[styles.button, value.adults >= 10 && styles.buttonDisabled]}
                  onPress={() => handleIncrement('adults')}
                  disabled={value.adults >= 10}
                >
                  <Ionicons name="add" size={24} color={value.adults >= 10 ? "#999" : "#000"} />
                </Pressable>
              </View>
            </View>

            <View style={styles.participantRow}>
              <View>
                <Text style={styles.participantLabel}>Enfants</Text>
                <Text style={styles.participantSubLabel}>2 à 12 ans.</Text>
              </View>
              <View style={styles.controls}>
                <Pressable 
                  style={[styles.button, value.children <= 0 && styles.buttonDisabled]}
                  onPress={() => handleDecrement('children')}
                  disabled={value.children <= 0}
                >
                  <Ionicons name="remove" size={24} color={value.children <= 0 ? "#999" : "#000"} />
                </Pressable>
                <Text style={styles.count}>{value.children}</Text>
                <Pressable 
                  style={[styles.button, value.children >= 6 && styles.buttonDisabled]}
                  onPress={() => handleIncrement('children')}
                  disabled={value.children >= 6}
                >
                  <Ionicons name="add" size={24} color={value.children >= 6 ? "#999" : "#000"} />
                </Pressable>
              </View>
            </View>

            <View style={styles.participantRow}>
              <View>
                <Text style={styles.participantLabel}>Bébés</Text>
                <Text style={styles.participantSubLabel}>- 2 ans.</Text>
              </View>
              <View style={styles.controls}>
                <Pressable 
                  style={[styles.button, value.infants <= 0 && styles.buttonDisabled]}
                  onPress={() => handleDecrement('infants')}
                  disabled={value.infants <= 0}
                >
                  <Ionicons name="remove" size={24} color={value.infants <= 0 ? "#999" : "#000"} />
                </Pressable>
                <Text style={styles.count}>{value.infants}</Text>
                <Pressable 
                  style={[styles.button, value.infants >= 4 && styles.buttonDisabled]}
                  onPress={() => handleIncrement('infants')}
                  disabled={value.infants >= 4}
                >
                  <Ionicons name="add" size={24} color={value.infants >= 4 ? "#999" : "#000"} />
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable 
              style={styles.clearButton}
              onPress={() => onChange({ adults: 1, children: 0, infants: 0 })}
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
  participantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  participantLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  participantSubLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  count: {
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 24,
    textAlign: 'center',
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