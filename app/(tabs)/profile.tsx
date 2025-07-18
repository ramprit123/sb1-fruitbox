import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
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
  CreditCard as Edit,
  Camera,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const profileScale = useSharedValue(1);

  const profileAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: profileScale.value }],
    };
  });

  const handleEditProfile = () => {
    profileScale.value = withSpring(0.95, {}, () => {
      profileScale.value = withSpring(1);
    });
    setIsEditing(!isEditing);
  };

  const MenuSection = ({
    children,
    style = {},
  }: {
    children: React.ReactNode;
    style?: any;
  }) => <View style={[styles.menuSection, style]}>{children}</View>;

  const MenuItem = ({
    icon,
    title,
    onPress,
    isLast = false,
    isDestructive = false,
  }: {
    icon: React.ReactNode;
    title: string;
    onPress?: () => void;
    isLast?: boolean;
    isDestructive?: boolean;
  }) => {
    const itemScale = useSharedValue(1);

    const itemAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: itemScale.value }],
      };
    });

    const handlePress = () => {
      itemScale.value = withSpring(0.98, {}, () => {
        itemScale.value = withSpring(1);
      });
      onPress?.();
    };

    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <Animated.View
          style={[
            itemAnimatedStyle,
            styles.menuItem,
            !isLast && styles.menuItemBorder,
          ]}
        >
          <View
            style={[styles.menuIcon, isDestructive && styles.destructiveIcon]}
          >
            {icon}
          </View>
          <Text
            style={[styles.menuText, isDestructive && styles.destructiveText]}
          >
            {title}
          </Text>
          <View style={styles.menuArrow}>
            <Text style={styles.menuArrowText}>›</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity
            onPress={handleEditProfile}
            style={styles.editButton}
          >
            <Edit size={20} color="#22c55e" />
          </TouchableOpacity>
        </View>

        <Animated.View style={[profileAnimatedStyle, styles.profileCard]}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg',
              }}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Sarah Johnson</Text>
            <Text style={styles.profileEmail}>sarah.johnson@email.com</Text>
            <View style={styles.profileStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>24</Text>
                <Text style={styles.statLabel}>Orders</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>4.8</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>$340</Text>
                <Text style={styles.statLabel}>Saved</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <MenuSection>
          <MenuItem
            icon={<Settings size={20} color="#4b5563" />}
            title="Account Settings"
            onPress={() => console.log('Settings pressed')}
          />
          <MenuItem
            icon={<CreditCard size={20} color="#4b5563" />}
            title="Payment Methods"
            onPress={() => console.log('Payment pressed')}
          />
          <MenuItem
            icon={<MapPin size={20} color="#4b5563" />}
            title="Delivery Addresses"
            onPress={() => console.log('Addresses pressed')}
          />
          <MenuItem
            icon={<Bell size={20} color="#4b5563" />}
            title="Notifications"
            onPress={() => console.log('Notifications pressed')}
            isLast
          />
        </MenuSection>

        <MenuSection>
          <MenuItem
            icon={<HelpCircle size={20} color="#4b5563" />}
            title="Help & Support"
            onPress={() => console.log('Help pressed')}
          />
          <MenuItem
            icon={<LogOut size={20} color="#ef4444" />}
            title="Sign Out"
            onPress={() => console.log('Sign out pressed')}
            isLast
            isDestructive
          />
        </MenuSection>

        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Fresh Box App v1.0.0</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImageContainer: {
    alignSelf: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#22c55e',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    backgroundColor: '#22c55e',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  menuSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 60,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuIcon: {
    width: 44,
    height: 44,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  destructiveIcon: {
    backgroundColor: '#fef2f2',
  },
  menuText: {
    flex: 1,
    color: '#111827',
    fontWeight: '500',
    fontSize: 16,
  },
  destructiveText: {
    color: '#ef4444',
  },
  menuArrow: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuArrowText: {
    color: '#9ca3af',
    fontSize: 18,
    fontWeight: '300',
  },
  versionInfo: {
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 24,
  },
  versionText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
  },
});
