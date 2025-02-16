import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type CountryCode = {
  code: string;
  flag: string;
  name: string;
  dial_code: string;
};

const countryCodes: CountryCode[] = [
  { code: 'FR', flag: '🇫🇷', name: 'France', dial_code: '+33' },
  { code: 'BE', flag: '🇧🇪', name: 'Belgique', dial_code: '+32' },
  { code: 'CH', flag: '🇨🇭', name: 'Suisse', dial_code: '+41' },
  { code: 'LU', flag: '🇱🇺', name: 'Luxembourg', dial_code: '+352' },
];

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  error?: string | null;
};

export default function PhoneInput({ value, onChangeText, error }: Props) {
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);

  const formatPhoneNumber = (number: string) => {
    // Remove all non-digit characters
    const cleaned = number.replace(/\D/g, '');
    
    // Format for French numbers: XX XX XX XX XX
    const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})$/);
    if (match) {
      const parts = match.slice(1).filter(Boolean);
      return parts.join(' ');
    }
    return cleaned;
  };

  const handlePhoneChange = (text: string) => {
    const formattedNumber = formatPhoneNumber(text);
    onChangeText(formattedNumber);
  };

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setIsCountryPickerOpen(false);
  };

  return (
    <View style={styles.container}>
      <Pressable 
        style={[styles.countryButton, error && styles.inputError]}
        onPress={() => setIsCountryPickerOpen(!isCountryPickerOpen)}
        accessibilityLabel="Sélectionner le pays"
        accessibilityHint="Ouvre la liste des pays disponibles"
      >
        <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
        <Text style={styles.countryCode}>{selectedCountry.dial_code}</Text>
        <Ionicons name="chevron-down" size={16} color="#666" />
      </Pressable>

      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={handlePhoneChange}
        placeholder="XX XX XX XX XX"
        keyboardType="phone-pad"
        maxLength={14}
        accessibilityLabel="Numéro de téléphone"
        accessibilityHint="Entrez votre numéro de téléphone"
      />

      {isCountryPickerOpen && (
        <ScrollView style={styles.countryPicker}>
          {countryCodes.map((country) => (
            <Pressable
              key={country.code}
              style={styles.countryOption}
              onPress={() => handleCountrySelect(country)}
            >
              <Text style={styles.countryFlag}>{country.flag}</Text>
              <View style={styles.countryInfo}>
                <Text style={styles.countryName}>{country.name}</Text>
                <Text style={styles.countryDialCode}>{country.dial_code}</Text>
              </View>
              {selectedCountry.code === country.code && (
                <Ionicons name="checkmark" size={20} color="#000" />
              )}
            </Pressable>
          ))}
        </ScrollView>
      )}

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 8,
  },
  countryCode: {
    flex: 1,
    fontSize: 16,
  },
  input: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#DC2626',
  },
  countryPicker: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 1000,
  },
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  countryInfo: {
    flex: 1,
    marginLeft: 8,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  countryDialCode: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    marginTop: 4,
  },
});