import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
} from 'lucide-react-native';
import { useCart } from '@/context/CartContext';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

export default function CartScreen() {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } =
    useCart();

  const handleCheckout = () => {
    if (items.length === 0) return;

    Alert.alert(
      'Checkout',
      `Proceed to checkout with ${itemCount} items for $${total.toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Checkout',
          onPress: () => {
            Alert.alert('Success', 'Order placed successfully!');
            clearCart();
          },
        },
      ]
    );
  };

  const handleContinueShopping = () => {
    router.push('/');
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Cart</Text>
        </View>

        <View style={styles.emptyState}>
          <ShoppingCart size={48} color="#d1d5db" />
          <Text style={styles.emptyStateTitle}>Your cart is empty</Text>
          <Text style={styles.emptyStateDescription}>
            Add some products to get started
          </Text>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinueShopping}
          >
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cart ({itemCount} items)</Text>
        <TouchableOpacity onPress={clearCart} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {items.map((item) => (
          <CartItemComponent
            key={item.id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        ))}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Subtotal ({itemCount} items)
            </Text>
            <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>$4.99</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>
              ${(total * 0.08).toFixed(2)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ${(total + 4.99 + total * 0.08).toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.checkoutContainer}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <CreditCard size={20} color="#ffffff" />
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

interface CartItemProps {
  item: any;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

function CartItemComponent({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity === 0) {
      onRemove(item.id);
    } else {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    scale.value = withSpring(0.8, {}, () => {
      runOnJS(onRemove)(item.id);
    });
  };

  return (
    <Animated.View style={[animatedStyle, styles.cartItem]}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)} each</Text>
        <Text style={styles.itemSubtotal}>
          Subtotal: ${(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
          <Trash2 size={16} color="#ef4444" />
        </TouchableOpacity>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => handleQuantityChange(item.quantity - 1)}
            style={styles.quantityButton}
          >
            <Minus size={16} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => handleQuantityChange(item.quantity + 1)}
            style={styles.quantityButton}
          >
            <Plus size={16} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#dc2626',
    fontWeight: '500',
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  itemSubtotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22c55e',
  },
  itemActions: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 12,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    color: '#6b7280',
    fontSize: 16,
  },
  summaryValue: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    color: '#111827',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    color: '#22c55e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 16,
  },
  checkoutButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 18,
  },
  emptyStateDescription: {
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
  },
  continueButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 24,
  },
  continueButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
