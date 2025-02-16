import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

export default function PhoneVerificationScreen() {
  const { phone } = useLocalSearchParams();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleVerification = async () => {
    if (!code) {
      setError('Veuillez entrer le code de vérification');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In development, we'll verify against the mock OTP
      const storedOtp = await SecureStore.getItemAsync('mockOtp');
      
      if (code === storedOtp) {
        // Verification successful
        router.push('/auth/complete-profile');
      } else {
        setError('Code de vérification incorrect');
      }
    } catch (err) {
      console.error('Error verifying code:', err);
      setError('Une erreur est survenue lors de la vérification');
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
        <Text style={styles.title}>Vérification</Text>
        <Text style={styles.subtitle}>
          Entrez le code à 6 chiffres envoyé au {phone}.
        </Text>

        <TextInput
          style={[styles.input, error && styles.inputError]}
          value={code}
          onChangeText={setCode}
          placeholder="000000"
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
        />

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#DC2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Pressable style={styles.resendButton}>
          <Text style={styles.resendButtonText}>
            Je n'ai pas reçu le code
          </Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.continueButton,
            (isLoading || !code) && styles.continueButtonDisabled
          ]}
          onPress={handleVerification}
          disabled={isLoading || !code}
        >
          <Text style={styles.continueButtonText}>
            {isLoading ? 'Vérification...' : 'Continuer'}
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
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 8,
    textAlign: 'center',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  errorText: {
    color: '#DC2626',
    marginLeft: 8,
    flex: 1,
  },
  resendButton: {
    marginTop: 24,
    alignSelf: 'center',
  },
  resendButtonText: {
    fontSize: 16,
    color: '#000',
    textDecorationLine: 'underline',
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
});