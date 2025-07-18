import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Search, Filter, X } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

export default function SearchScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(category || 'all');
  const filterScale = useSharedValue(0);

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
          <Animated.View style={[filterAnimatedStyle, styles.filterContainer]}>
            <Text style={styles.filterTitle}>Filters</Text>
            <View style={styles.filterTags}>
              <TouchableOpacity
                style={[
                  styles.filterTag,
                  activeFilter === 'fruits' && styles.filterTagActive,
                ]}
                onPress={() => handleFilterSelect('fruits')}
              >
                <Text
                  style={
                    activeFilter === 'fruits'
                      ? styles.filterTagActiveText
                      : styles.filterTagText
                  }
                >
                  Fruits
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterTag,
                  activeFilter === 'vegetables' && styles.filterTagActive,
                ]}
                onPress={() => handleFilterSelect('vegetables')}
              >
                <Text
                  style={
                    activeFilter === 'vegetables'
                      ? styles.filterTagActiveText
                      : styles.filterTagText
                  }
                >
                  Vegetables
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterTag,
                  activeFilter === 'organic' && styles.filterTagActive,
                ]}
                onPress={() => handleFilterSelect('organic')}
              >
                <Text
                  style={
                    activeFilter === 'organic'
                      ? styles.filterTagActiveText
                      : styles.filterTagText
                  }
                >
                  Organic
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterTag,
                  activeFilter === 'salads' && styles.filterTagActive,
                ]}
                onPress={() => handleFilterSelect('salads')}
              >
                <Text
                  style={
                    activeFilter === 'salads'
                      ? styles.filterTagActiveText
                      : styles.filterTagText
                  }
                >
                  Salads
                </Text>
              </TouchableOpacity>
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
});
