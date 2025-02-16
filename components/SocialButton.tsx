import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SocialButtonProps = {
  icon: string;
  provider: string;
  backgroundColor?: string;
  textColor?: string;
  onPress: () => void;
};

export default function SocialButton({
  icon,
  provider,
  backgroundColor = '#FFFFFF',
  textColor = '#000000',
  onPress,
}: SocialButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Ionicons name={icon as any} size={20} color={textColor} style={styles.icon} />
        <Text style={[styles.text, { color: textColor }]}>
          S'inscrire avec {provider}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
});