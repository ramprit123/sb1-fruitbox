import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react-native';

export default function CartScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cart</Text>
      </View>
      
      <View style={styles.emptyState}>
        <ShoppingCart size={48} color="#d1d5db" />
        <Text style={styles.emptyStateTitle}>Your cart is empty</Text>
        <Text style={styles.emptyStateDescription}>Add some products to get started</Text>
        
        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
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