import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package, Clock, CircleCheck as CheckCircle, Truck } from 'lucide-react-native';

export default function OrdersScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderNumber}>Order #12345</Text>
            <View style={[styles.statusBadge, styles.statusDelivered]}>
              <CheckCircle size={16} color="#22c55e" />
              <Text style={styles.statusDeliveredText}>Delivered</Text>
            </View>
          </View>
          <Text style={styles.orderItems}>Mediterranean Box + Fresh Fruits</Text>
          <View style={styles.orderFooter}>
            <Text style={styles.orderDate}>Dec 15, 2023</Text>
            <Text style={styles.orderTotal}>$44.98</Text>
          </View>
        </View>

        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderNumber}>Order #12346</Text>
            <View style={[styles.statusBadge, styles.statusInTransit]}>
              <Truck size={16} color="#3b82f6" />
              <Text style={styles.statusInTransitText}>In Transit</Text>
            </View>
          </View>
          <Text style={styles.orderItems}>Green Salad Box</Text>
          <View style={styles.orderFooter}>
            <Text style={styles.orderDate}>Dec 18, 2023</Text>
            <Text style={styles.orderTotal}>$19.99</Text>
          </View>
        </View>

        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderNumber}>Order #12347</Text>
            <View style={[styles.statusBadge, styles.statusProcessing]}>
              <Clock size={16} color="#f59e0b" />
              <Text style={styles.statusProcessingText}>Processing</Text>
            </View>
          </View>
          <Text style={styles.orderItems}>Berry Box + Tropical Mix</Text>
          <View style={styles.orderFooter}>
            <Text style={styles.orderDate}>Dec 20, 2023</Text>
            <Text style={styles.orderTotal}>$49.98</Text>
          </View>
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
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderNumber: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 18,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDelivered: {
    backgroundColor: '#dcfce7',
  },
  statusDeliveredText: {
    color: '#16a34a',
    fontWeight: '500',
    marginLeft: 8,
  },
  statusInTransit: {
    backgroundColor: '#dbeafe',
  },
  statusInTransitText: {
    color: '#2563eb',
    fontWeight: '500',
    marginLeft: 8,
  },
  statusProcessing: {
    backgroundColor: '#fef3c7',
  },
  statusProcessingText: {
    color: '#d97706',
    fontWeight: '500',
    marginLeft: 8,
  },
  orderItems: {
    color: '#6b7280',
    marginBottom: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderDate: {
    color: '#9ca3af',
  },
  orderTotal: {
    color: '#111827',
    fontWeight: '600',
  },
});