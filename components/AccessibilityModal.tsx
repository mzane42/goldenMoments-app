import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ListingModal from './ListingModal';
import { Accessibility } from '../types/experience';
import { translateAccessibilityKeys } from '../utils/translateAccessibilityKeys';


type AccessibilityModalProps = {
  accessibility: Accessibility;
  visible: boolean;
  onClose: () => void;
};

const AccessibilityModal: React.FC<AccessibilityModalProps> = ({ accessibility, visible, onClose }) => {
  return (
    <ListingModal title="Services et accessibilité" visible={visible} onClose={onClose}>
      <ScrollView>
        {Object.entries(accessibility).map(([key, value], index) => (
          <View key={key} style={styles.accessibilityItem}>
            <Text style={styles.accessibilityLabel}>{translateAccessibilityKeys(key)}</Text>
            <Text style={styles.accessibilityValue}>{!!value ? 'Oui' : 'Non'}</Text>
          </View>
        ))}
      </ScrollView>
    </ListingModal>
  );
};

const styles = StyleSheet.create({
  accessibilityItem: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
  },
  accessibilityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  accessibilityValue: { 
    fontSize: 16,
    color: '#000',
  },
});


export default AccessibilityModal;
