import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Settings,
  CreditCard,
  MapPin,
  Bell,
  CircleHelp as HelpCircle,
  LogOut,
} from 'lucide-react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsSigningOut(true);
            await signOut();
            router.replace('/(auth)/sign-in');
          } catch (error) {
            console.error('Sign out error:', error);
            Alert.alert('Error', 'Failed to sign out. Please try again.');
          } finally {
            setIsSigningOut(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <User size={32} color="#22c55e" />
            </View>
            <Text style={styles.profileName}>
              {user?.fullName || user?.firstName || 'User'}
            </Text>
            <Text style={styles.profileEmail}>
              {user?.primaryEmailAddress?.emailAddress || 'No email'}
            </Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]}>
            <View style={styles.menuIcon}>
              <Settings size={20} color="#4b5563" />
            </View>
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]}>
            <View style={styles.menuIcon}>
              <CreditCard size={20} color="#4b5563" />
            </View>
            <Text style={styles.menuText}>Payment Methods</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]}>
            <View style={styles.menuIcon}>
              <MapPin size={20} color="#4b5563" />
            </View>
            <Text style={styles.menuText}>Addresses</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Bell size={20} color="#4b5563" />
            </View>
            <Text style={styles.menuText}>Notifications</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]}>
            <View style={styles.menuIcon}>
              <HelpCircle size={20} color="#4b5563" />
            </View>
            <Text style={styles.menuText}>Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, isSigningOut && styles.menuItemDisabled]}
            onPress={handleSignOut}
            disabled={isSigningOut}
          >
            <View style={[styles.menuIcon, styles.logoutIcon]}>
              {isSigningOut ? (
                <ActivityIndicator size={20} color="#ef4444" />
              ) : (
                <LogOut size={20} color="#ef4444" />
              )}
            </View>
            <Text style={styles.logoutText}>
              {isSigningOut ? 'Signing Out...' : 'Sign Out'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#dcfce7',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  profileEmail: {
    color: '#6b7280',
  },
  menuSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemDisabled: {
    opacity: 0.6,
  },
  menuIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  logoutIcon: {
    backgroundColor: '#fef2f2',
  },
  menuText: {
    flex: 1,
    color: '#111827',
    fontWeight: '500',
  },
  logoutText: {
    flex: 1,
    color: '#ef4444',
    fontWeight: '500',
  },
});
