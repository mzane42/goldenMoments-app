import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/database';

type User = Database['public']['Tables']['users']['Row'];

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        router.replace('/');
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authUser.id)
        .single();

      if (userError) throw userError;

      setUser(userData);
      setError(null);
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error loading profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace('/');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={loadProfile}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>Utilisateur non trouvé</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user.profile_picture ? (
            <Image
              source={{ uri: user.profile_picture }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}
              </Text>
            </View>
          )}
          <Text style={styles.name}>{user.full_name || 'Anis'}</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <Pressable 
          style={styles.menuItem}
          onPress={() => router.push('/bookings')}
        >
          <Ionicons name="calendar-outline" size={24} color="#000" />
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>Mes staycations</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <Ionicons name="person-outline" size={24} color="#000" />
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>Compte</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <Ionicons name="mail-outline" size={24} color="#000" />
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>Notifications & E-mails</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <Ionicons name="gift-outline" size={24} color="#000" />
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>Carte cadeau</Text>
            <Text style={styles.menuItemSubtitle}>Créez et envoyez votre carte cadeau</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <Ionicons name="ticket-outline" size={24} color="#000" />
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>Parrainage</Text>
            <Text style={styles.menuItemSubtitle}>Gagnez 10€ pour chaque ami parrainé</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>1</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={24} color="#000" />
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>Aide</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <Ionicons name="star-outline" size={24} color="#000" />
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>Noter l'application</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <Ionicons name="chatbubble-outline" size={24} color="#000" />
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>Feedback</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </Pressable>
      </View>

      <Pressable 
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        <Text style={styles.signOutText}>Déconnexion</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 24,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarPlaceholder: {
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  menuSection: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  menuItemContent: {
    flex: 1,
    marginLeft: 16,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 6,
  },
  signOutButton: {
    padding: 16,
    marginTop: 8,
  },
  signOutText: {
    fontSize: 16,
    color: '#FF3B30',
  },
  errorText: {
    color: '#DC2626',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});