import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ImageBackground, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LocationScreen() {
  const [city, setCity] = useState('');
  const router = useRouter();
  const [useLocation, setUseLocation] = useState(false);

  const handleContinue = () => {
    if (city.trim() || useLocation) {
      router.replace('/(tabs)');
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
          <Text style={styles.title}>Votre ville</Text>
          <Text style={styles.subtitle}>
            Retrouvez les meilleures expériences autour de là où vous habitez.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Paris"
            value={city}
            onChangeText={setCity}
            autoCapitalize="words"
          />

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.divider} />
          </View>

          <Pressable
            style={styles.locationButton}
            onPress={() => setUseLocation(true)}
          >
            <Ionicons name="navigate" size={24} color="#000" />
            <Text style={styles.locationButtonText}>
              Utiliser ma position actuelle
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.continueButton,
            (!city.trim() && !useLocation) && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continuer</Text>
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
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 32,
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
  footer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  continueButton: {
    height: 56,
    backgroundColor: '#000',
    borderRadius: 12,
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