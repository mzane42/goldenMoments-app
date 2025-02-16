import { View, Text, StyleSheet, ImageBackground, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import SocialButton from '../components/SocialButton';
import EmailButton from '../components/EmailButton';
import { signInWithGoogle, signInWithApple } from '../lib/auth';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleSocialLogin = async (provider: string) => {
    try {
      let result;
      switch (provider) {
        case 'Google':
          result = await signInWithGoogle();
          break;
        case 'Apple':
          result = await signInWithApple();
          break;
      }
      
      if (result?.error) {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error during social login:', error);
    }
  };

  const handlePhoneSignup = () => {
    router.push('/auth/phone-signup');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1920' }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Goûtez aux vacances{'\n'}du quotidien</Text>
              <Text style={styles.subtitle}>
                Vivez des expériences magiques dans les meilleurs hôtels près de chez vous.
              </Text>
            </View>

            <View style={styles.authContainer}>
              <SocialButton
                icon="logo-apple"
                provider="Apple"
                backgroundColor="#000000"
                textColor="#FFFFFF"
                onPress={() => handleSocialLogin('Apple')}
              />
              <SocialButton
                icon="logo-google"
                provider="Google"
                backgroundColor="#FFFFFF"
                textColor="#000000"
                onPress={() => handleSocialLogin('Google')}
              />
              
              <Pressable
                style={styles.phoneButton}
                onPress={handlePhoneSignup}
              >
                <Text style={styles.phoneButtonText}>
                  Continuer avec le téléphone
                </Text>
              </Pressable>

              <Text style={styles.termsText}>
                En créant un compte, vous reconnaissez avoir pris connaissance des{' '}
                <Text style={styles.link}>Conditions Générales de Golden Moments</Text> et de notre{' '}
                <Text style={styles.link}>Politique de confidentialité</Text>.
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  content: {
    padding: 24,
  },
  headerContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    lineHeight: 24,
    textShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
  },
  authContainer: {
    width: '100%',
    marginBottom: 24,
  },
  phoneButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#000000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  phoneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  termsText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
  link: {
    textDecorationLine: 'underline',
  },
});