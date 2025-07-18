import { useCart } from '@/context/CartContext';
import { Tabs } from 'expo-router';
import { Home, Package, Search, ShoppingCart, User } from 'lucide-react-native';
import { Dimensions } from 'react-native';

export default function TabLayout() {
  const { width, height } = Dimensions.get('window');
  const isTablet = width >= 768;
  const isSmallScreen = width < 375;
  const { itemCount } = useCart();
  const getResponsiveValues = () => {
    if (isTablet) {
      return {
        tabBarHeight: 75,
        iconSize: 26,
        fontSize: 13,
        paddingVertical: 12,
        paddingHorizontal: 16,
      };
    } else if (isSmallScreen) {
      return {
        tabBarHeight: 60,
        iconSize: 20,
        fontSize: 10,
        paddingVertical: 6,
        paddingHorizontal: 8,
      };
    } else {
      return {
        tabBarHeight: 65,
        iconSize: 22,
        fontSize: 11,
        paddingVertical: 8,
        paddingHorizontal: 12,
      };
    }
  };

  const responsive = getResponsiveValues();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: {
          fontSize: responsive.fontSize,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Home size={responsive.iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="product/[id]"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            <Search size={responsive.iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarIcon: ({ color, size }) => (
            <ShoppingCart size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }) => (
            <Package size={responsive.iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <User size={responsive.iconSize} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
