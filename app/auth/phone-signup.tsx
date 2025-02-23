import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import PhoneInput from '../../components/PhoneInput';
import * as SecureStore from 'expo-secure-store';
// For development, we'll use a mock OTP
const MOCK_OTP = '123456';

export default function PhoneSignupScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const sendOtp = async (phoneNumber: string) => {
    // TODO: Implement the OTP sending logic
    console.log('Sending OTP to', phoneNumber);
  };

  const handleSignup = async () => {
    if (!phoneNumber) {
      setError('Veuillez entrer un numéro de téléphone');
      return;
    }

    // Clean phone number (remove spaces)
    const cleanedNumber = phoneNumber.replace(/\s/g, '');
    if (cleanedNumber.length !== 10) {
      setError('Numéro de téléphone invalide');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In development, we'll simulate the OTP send
      if (process.env.NODE_ENV === 'development') {
        // Store the mock OTP in SecureStore
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (process.env.EXPO_PUBLIC_PLATFORM === 'expo') {
          await SecureStore.setItemAsync('mockOtp', MOCK_OTP);
          await SecureStore.setItemAsync('phoneNumber', cleanedNumber);
        } else if (process.env.EXPO_PUBLIC_PLATFORM === 'web') {
          localStorage.setItem('mockOtp', MOCK_OTP);
          localStorage.setItem('phoneNumber', cleanedNumber);
        }
      } else {
        // In production, we'll send the OTP to the phone number
        await sendOtp(cleanedNumber);
      }

      // Redirect to verification page
      router.push({
        pathname: '/auth/phone-verification',
        params: { phone: phoneNumber }
      });
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError('Une erreur est survenue lors de l\'envoi du code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>S'inscrire</Text>
        <Text style={styles.subtitle}>
          Entrez votre numéro de téléphone pour recevoir un code de vérification.
        </Text>

        <PhoneInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          error={error}
        />

    
        {process.env.EXPO_PUBLIC_PLATFORM === 'expo' && (
          <Text style={styles.devNote}>
            Running in Expo environment
          </Text>
        )}
        {process.env.EXPO_PUBLIC_PLATFORM === 'web' && (
          <Text style={styles.devNote}>
            Running in Web environment
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.continueButton,
            (isLoading || !phoneNumber) && styles.continueButtonDisabled
          ]}
          onPress={handleSignup}
          disabled={isLoading || !phoneNumber}
        >
          <Text style={styles.continueButtonText}>
            {isLoading ? 'Envoi en cours...' : 'Continuer'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    paddingTop: 48,
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  continueButton: {
    height: 56,
    backgroundColor: '#000',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  devNote: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    color: '#666',
    fontSize: 14,
  },
});