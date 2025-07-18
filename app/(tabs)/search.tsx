import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Search, Filter, X, Star, Plus } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useCart } from '@/context/CartContext';

export default function SearchScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(category || 'all');
  const filterScale = useSharedValue(0);
  const { addItem } = useCart();

  // Fetch data from Convex
  const categories = useQuery(api.products.getCategories);
  const searchResults = useQuery(
    api.products.searchProducts,
    searchQuery || activeFilter !== 'all'
      ? {
          searchTerm: searchQuery,
          category: activeFilter !== 'all' ? activeFilter : undefined,
          limit: 50,
        }
      : 'skip',
  );

  const allProducts = useQuery(api.products.getProducts, { limit: 50 });

  const products =
    searchQuery || activeFilter !== 'all' ? searchResults : allProducts;

  const filterAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: filterScale.value }],
    };
  });

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    filterScale.value = withSpring(isFilterOpen ? 0 : 1);
  };

  const handleFilterSelect = (filter: string) => {
    setActiveFilter(filter);
    setIsFilterOpen(false);
    filterScale.value = withSpring(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>

        <View style={styles.searchContainer}>
          <View style={styles.searchInput}>
            <Search size={20} color="#9ca3af" />
            <TextInput
              style={styles.textInput}
              placeholder="Search for products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={toggleFilter} style={styles.filterButton}>
            <Filter size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {isFilterOpen && (
          <Animated.View style={[styles.filterPanel, filterAnimatedStyle]}>
            <View style={styles.filterTags}>
              <TouchableOpacity
                style={[
                  styles.filterTag,
                  activeFilter === 'all' && styles.filterTagActive,
                ]}
                onPress={() => handleFilterSelect('all')}
              >
                <Text
                  style={
                    activeFilter === 'all'
                      ? styles.filterTagActiveText
                      : styles.filterTagText
                  }
                >
                  All
                </Text>
              </TouchableOpacity>
              {categories &&
                categories.map((category) => (
                  <TouchableOpacity
                    key={category._id}
                    style={[
                      styles.filterTag,
                      activeFilter === category.name && styles.filterTagActive,
                    ]}
                    onPress={() => handleFilterSelect(category.name)}
                  >
                    <Text
                      style={
                        activeFilter === category.name
                          ? styles.filterTagActiveText
                          : styles.filterTagText
                      }
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </Animated.View>
        )}
      </View>

      <ScrollView style={styles.content}>
        {category && (
          <View style={styles.categoryBanner}>
            <Text style={styles.categoryBannerText}>
              Browsing: {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Popular Searches</Text>
        <View style={styles.popularTags}>
          {[
            'Fresh Fruits',
            'Green Salads',
            'Organic Box',
            'Berry Mix',
            'Tropical Fruits',
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.popularTag}
              onPress={() => setSearchQuery(item)}
            >
              <Text style={styles.popularTagText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.emptyState}>
          <Search size={48} color="#d1d5db" />
          <Text style={styles.emptyStateText}>
            {searchQuery
              ? 'No results found'
              : 'Start typing to search for products'}
          </Text>
        </View>

        {/* Products Section */}
        {products && products.length > 0 && (
          <View style={styles.productsSection}>
            <Text style={styles.sectionTitle}>
              {searchQuery ? 'Search Results' : 'Products'} ({products.length})
            </Text>
            <View style={styles.productsGrid}>
              {products.map((product) => (
                <TouchableOpacity
                  key={product._id}
                  style={styles.productCard}
                  onPress={() => router.push(`/product/${product._id}`)}
                >
                  <Image
                    source={{ uri: product.imageUrl }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productDescription} numberOfLines={2}>
                      {product.description}
                    </Text>
                    <View style={styles.productFooter}>
                      <View style={styles.productPriceContainer}>
                        <Text style={styles.productPrice}>
                          ${product.price.toFixed(2)}
                        </Text>
                        {product.rating && (
                          <View style={styles.ratingContainer}>
                            <Star size={12} color="#fbbf24" fill="#fbbf24" />
                            <Text style={styles.ratingText}>
                              {product.rating}
                            </Text>
                          </View>
                        )}
                      </View>
                      <TouchableOpacity
                        style={styles.addToCartButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          addItem({
                            id: product._id,
                            title: product.name,
                            price: product.price,
                            image: product.imageUrl,
                          });
                        }}
                      >
                        <Plus size={16} color="#22c55e" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Loading State */}
        {products === undefined && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#22c55e" />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        )}

        {/* No Results State */}
        {products &&
          products.length === 0 &&
          (searchQuery || activeFilter !== 'all') && (
            <View style={styles.emptyState}>
              <Search size={48} color="#d1d5db" />
              <Text style={styles.emptyStateText}>
                No products found for "{searchQuery || activeFilter}"
              </Text>
            </View>
          )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    color: '#111827',
  },
  filterButton: {
    backgroundColor: '#22c55e',
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPanel: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  filterContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  filterTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterTag: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  filterTagActive: {
    backgroundColor: '#dcfce7',
  },
  filterTagText: {
    color: '#374151',
    fontWeight: '500',
  },
  filterTagActiveText: {
    color: '#16a34a',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  categoryBanner: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  categoryBannerText: {
    color: '#16a34a',
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  popularTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  popularTag: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  popularTagText: {
    color: '#374151',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
  },
  productsSection: {
    marginTop: 16,
    paddingBottom: 32,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f3f4f6',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 16,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPriceContainer: {
    flex: 1,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  addToCartButton: {
    backgroundColor: '#dcfce7',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
    fontWeight: '500',
  },
});
