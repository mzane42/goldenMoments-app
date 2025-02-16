import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import * as Location from 'expo-location';

export default function CompleteProfileScreen() {
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email) {
      setError('L\'email est requis');
      return;
    }

    if (!email.includes('@')) {
      setError('Email invalide');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      // Update user profile
      const { error: updateError } = await supabase
        .from('users')
        .update({
          email,
          preferences: {
            city: city || null
          }
        })
        .eq('auth_id', user.id);

      if (updateError) throw updateError;

      // Redirect to home
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Une erreur est survenue lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrentLocation = async () => {
    setIsLocating(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Permission d\'accès à la localisation refusée');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      
      // Get city name from coordinates
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${location.coords.latitude}+${location.coords.longitude}&key=YOUR_API_KEY`
      );
      const data = await response.json();
      
      if (data.results && data.results[0]) {
        const cityComponent = data.results[0].components.city || 
                            data.results[0].components.town ||
                            data.results[0].components.village;
        if (cityComponent) {
          setCity(cityComponent);
        }
      }
    } catch (err) {
      console.error('Error getting location:', err);
      setError('Impossible de récupérer votre position');
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} bounces={false}>
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1920' }}
          style={styles.coverImage}
        >
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </Pressable>
        </ImageBackground>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Vous y êtes presque</Text>
            <Text style={styles.subtitle}>
              Retrouvez les meilleures expériences autour de là où vous habitez.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                value={email}
                onChangeText={setEmail}
                placeholder="votre@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ville</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="Paris"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.divider} />
            </View>

            <Pressable
              style={styles.locationButton}
              onPress={handleCurrentLocation}
              disabled={isLocating}
            >
              <Ionicons name="navigate" size={24} color="#000" />
              <Text style={styles.locationButtonText}>
                {isLocating ? 'Localisation...' : 'Utiliser ma position actuelle'}
              </Text>
            </Pressable>

            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color="#DC2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.submitButton,
            (isLoading || !email) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={isLoading || !email}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Enregistrement...' : 'Continuer'}
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
  scrollView: {
    flex: 1,
  },
  coverImage: {
    height: 200,
    width: '100%',
  },
  backButton: {
    margin: 24,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
    fontSize: 16,
  },
  locationButton: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  locationButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#000',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  errorText: {
    color: '#DC2626',
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  submitButton: {
    height: 56,
    backgroundColor: '#000',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});