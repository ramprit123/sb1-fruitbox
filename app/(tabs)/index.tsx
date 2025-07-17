import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Apple, Salad, RefreshCw, Plus, Star } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolate,
  runOnJS
} from 'react-native-reanimated';

interface CategoryItemProps {
  icon: React.ReactNode;
  title: string;
  color: string;
  onPress: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ icon, title, color, onPress }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    opacity.value = withTiming(0.7);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withTiming(1);
    runOnJS(onPress)();
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={styles.categoryItem}
    >
      <Animated.View style={[animatedStyle, styles.categoryContent]}>
        <View style={[styles.categoryIcon, { backgroundColor: color }]}>
          {icon}
        </View>
        <Text style={styles.categoryTitle}>{title}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

interface ProductCardProps {
  title: string;
  price: string;
  rating: number;
  image: string;
  onPress: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, price, rating, image, onPress }) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value }
      ],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
    translateY.value = withSpring(2);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    translateY.value = withSpring(0);
    runOnJS(onPress)();
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={styles.productCard}
    >
      <Animated.View style={[animatedStyle, styles.productCardContent]}>
        <Image
          source={{ uri: image }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{title}</Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#fbbf24" fill="#fbbf24" />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>{price}</Text>
            <TouchableOpacity style={styles.addButton}>
              <Plus size={16} color="#22c55e" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const headerOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 800 });
    cardTranslateY.value = withSpring(0, { 
      damping: 12,
      stiffness: 100,
    });
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [
        { translateY: interpolate(headerOpacity.value, [0, 1], [-20, 0]) }
      ],
    };
  });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: cardTranslateY.value }],
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <Animated.View style={[headerAnimatedStyle, styles.header]}>
          <Text style={styles.greeting}>Good morning, Sarah</Text>
          <View style={styles.locationContainer}>
            <MapPin size={16} color="#22c55e" />
            <Text style={styles.locationText}>Delivering to 123 Park Avenue</Text>
          </View>
        </Animated.View>

        <View style={styles.categoriesContainer}>
          <View style={styles.categoriesRow}>
            <CategoryItem
              icon={<Apple size={24} color="#22c55e" />}
              title="Fruit Box"
              color="#dcfce7"
              onPress={() => console.log('Fruit Box pressed')}
            />
            <CategoryItem
              icon={<Salad size={24} color="#22c55e" />}
              title="Salad Box"
              color="#dcfce7"
              onPress={() => console.log('Salad Box pressed')}
            />
            <CategoryItem
              icon={<RefreshCw size={24} color="#22c55e" />}
              title="Subscriptions"
              color="#dcfce7"
              onPress={() => console.log('Subscriptions pressed')}
            />
          </View>
        </View>

        <Animated.View style={[cardAnimatedStyle, styles.promoContainer]}>
          <View style={styles.promoCard}>
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeText}>20% OFF</Text>
            </View>
            <Text style={styles.promoSubtitle}>Today's Special</Text>
            <Text style={styles.promoTitle}>Mediterranean Box</Text>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Order Now</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Health Tips</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.healthTipCard}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg' }}
                style={styles.healthTipImage}
                resizeMode="cover"
              />
              <View style={styles.healthTipContent}>
                <Text style={styles.healthTipTitle}>Boost Your Immunity</Text>
                <Text style={styles.healthTipDescription}>Add these fruits to your daily diet</Text>
              </View>
            </View>
            <View style={styles.healthTipCard}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg' }}
                style={styles.healthTipImage}
                resizeMode="cover"
              />
              <View style={styles.healthTipContent}>
                <Text style={styles.healthTipTitle}>Healthy Eating</Text>
                <Text style={styles.healthTipDescription}>Make your meals more nutritious</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Popular This Week</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <ProductCard
              title="Fresh Fruit Box"
              price="$24.99"
              rating={4.8}
              image="https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg"
              onPress={() => console.log('Fresh Fruit Box pressed')}
            />
            <ProductCard
              title="Green Salad Box"
              price="$19.99"
              rating={4.6}
              image="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg"
              onPress={() => console.log('Green Salad Box pressed')}
            />
            <ProductCard
              title="Organic Mix"
              price="$29.99"
              rating={4.9}
              image="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
              onPress={() => console.log('Organic Mix pressed')}
            />
          </ScrollView>
        </View>

        <View style={styles.filtersContainer}>
          <View style={styles.filtersRow}>
            <TouchableOpacity style={[styles.filterButton, styles.filterButtonActive]}>
              <Text style={styles.filterButtonActiveText}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Fruits</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Salads</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Organic</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.recommendedContainer}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          <View style={styles.recommendedGrid}>
            <View style={styles.recommendedItem}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg' }}
                style={styles.recommendedImage}
                resizeMode="cover"
              />
              <View style={styles.recommendedInfo}>
                <Text style={styles.recommendedTitle}>Berry Box</Text>
                <Text style={styles.recommendedPrice}>$22.99</Text>
              </View>
            </View>
            <View style={styles.recommendedItem}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg' }}
                style={styles.recommendedImage}
                resizeMode="cover"
              />
              <View style={styles.recommendedInfo}>
                <Text style={styles.recommendedTitle}>Tropical Mix</Text>
                <Text style={styles.recommendedPrice}>$26.99</Text>
              </View>
            </View>
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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#6b7280',
    marginLeft: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
    flex: 1,
  },
  categoryContent: {
    alignItems: 'center',
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  promoContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  promoCard: {
    backgroundColor: '#f59e0b',
    borderRadius: 16,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  promoBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  promoBadgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  promoSubtitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  promoTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  promoButton: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    color: '#111827',
    fontWeight: '600',
  },
  sectionContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  healthTipCard: {
    width: 288,
    marginRight: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  healthTipImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f3f4f6',
  },
  healthTipContent: {
    padding: 16,
  },
  healthTipTitle: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
  },
  healthTipDescription: {
    color: '#6b7280',
    fontSize: 14,
  },
  productCard: {
    width: 192,
    marginRight: 16,
  },
  productCardContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  productImage: {
    width: '100%',
    height: 128,
    backgroundColor: '#f3f4f6',
  },
  productInfo: {
    padding: 16,
  },
  productTitle: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    color: '#f59e0b',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 4,
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    color: '#16a34a',
    fontWeight: 'bold',
    fontSize: 18,
  },
  addButton: {
    backgroundColor: '#dcfce7',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#22c55e',
  },
  filterButtonText: {
    color: '#374151',
    fontWeight: '500',
  },
  filterButtonActiveText: {
    color: 'white',
    fontWeight: '500',
  },
  recommendedContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  recommendedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recommendedItem: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  recommendedImage: {
    width: '100%',
    height: 128,
    backgroundColor: '#f3f4f6',
  },
  recommendedInfo: {
    padding: 16,
  },
  recommendedTitle: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  recommendedPrice: {
    color: '#16a34a',
    fontWeight: 'bold',
    fontSize: 18,
  },
});