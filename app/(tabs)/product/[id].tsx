import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import {
  ArrowLeft,
  Star,
  Plus,
  Minus,
  Heart,
  Share,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useCart } from '@/context/CartContext';

interface ProductData {
  [key: string]: {
    title: string;
    price: string;
    rating: number;
    image: string;
    description: string;
    ingredients: string[];
    nutrition: { [key: string]: string };
  };
}

const productData: ProductData = {
  'fresh-fruit-box': {
    title: 'Fresh Fruit Box',
    price: '$24.99',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg',
    description:
      'A carefully curated selection of the freshest seasonal fruits, handpicked for optimal taste and nutrition. Perfect for a healthy lifestyle.',
    ingredients: ['Apples', 'Bananas', 'Oranges', 'Grapes', 'Berries'],
    nutrition: {
      Calories: '120 per serving',
      'Vitamin C': '85% DV',
      Fiber: '4g',
      Sugar: '22g',
    },
  },
  'green-salad-box': {
    title: 'Green Salad Box',
    price: '$19.99',
    rating: 4.6,
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
    description:
      'Fresh, crisp greens and vegetables perfect for creating nutritious salads. Includes a variety of leafy greens and seasonal vegetables.',
    ingredients: [
      'Mixed Greens',
      'Spinach',
      'Arugula',
      'Cherry Tomatoes',
      'Cucumbers',
    ],
    nutrition: {
      Calories: '45 per serving',
      'Vitamin K': '120% DV',
      Folate: '15% DV',
      Iron: '8% DV',
    },
  },
  'organic-mix': {
    title: 'Organic Mix',
    price: '$29.99',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    description:
      'Premium organic fruits and vegetables sourced from certified organic farms. No pesticides, no chemicals, just pure nutrition.',
    ingredients: [
      'Organic Apples',
      'Organic Carrots',
      'Organic Broccoli',
      'Organic Bell Peppers',
    ],
    nutrition: {
      Calories: '95 per serving',
      'Vitamin A': '110% DV',
      'Vitamin C': '95% DV',
      Potassium: '12% DV',
    },
  },
  'berry-box': {
    title: 'Berry Box',
    price: '$22.99',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg',
    description:
      'A delightful mix of antioxidant-rich berries including strawberries, blueberries, and raspberries. Perfect for smoothies or snacking.',
    ingredients: ['Strawberries', 'Blueberries', 'Raspberries', 'Blackberries'],
    nutrition: {
      Calories: '85 per serving',
      Antioxidants: 'High',
      'Vitamin C': '75% DV',
      Fiber: '6g',
    },
  },
  'tropical-mix': {
    title: 'Tropical Mix',
    price: '$26.99',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg',
    description:
      'Exotic tropical fruits that bring sunshine to your day. Sweet, juicy, and packed with vitamins and minerals.',
    ingredients: ['Pineapple', 'Mango', 'Papaya', 'Kiwi', 'Passion Fruit'],
    nutrition: {
      Calories: '110 per serving',
      'Vitamin C': '120% DV',
      'Vitamin A': '25% DV',
      Potassium: '15% DV',
    },
  },
  'mediterranean-box': {
    title: 'Mediterranean Box',
    price: '$34.99',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    description:
      'A taste of the Mediterranean with fresh vegetables, herbs, and premium ingredients inspired by coastal cuisine.',
    ingredients: [
      'Tomatoes',
      'Olives',
      'Feta Cheese',
      'Fresh Herbs',
      'Bell Peppers',
    ],
    nutrition: {
      Calories: '150 per serving',
      'Healthy Fats': '8g',
      Protein: '6g',
      Sodium: '320mg',
    },
  },
};

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addItem } = useCart();

  const buttonScale = useSharedValue(1);
  const heartScale = useSharedValue(1);

  const product = productData[id as string];

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const heartAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: heartScale.value }],
    };
  });

  const handleAddToCart = () => {
    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });

    const priceNumber = parseFloat(product.price.replace('$', ''));
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: id as string,
        title: product.title,
        price: priceNumber,
        image: product.image,
      });
    }
  };

  const toggleFavorite = () => {
    heartScale.value = withSpring(0.8, {}, () => {
      heartScale.value = withSpring(1);
    });
    setIsFavorite(!isFavorite);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Share size={24} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleFavorite}
            style={styles.headerButton}
          >
            <Animated.View style={heartAnimatedStyle}>
              <Heart
                size={24}
                color={isFavorite ? '#ef4444' : '#111827'}
                fill={isFavorite ? '#ef4444' : 'none'}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: product.image }}
          style={styles.productImage}
          resizeMode="cover"
        />

        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{product.title}</Text>

          <View style={styles.ratingContainer}>
            <Star size={16} color="#fbbf24" fill="#fbbf24" />
            <Text style={styles.ratingText}>{product.rating}</Text>
            <Text style={styles.reviewsText}>(124 reviews)</Text>
          </View>

          <Text style={styles.productPrice}>{product.price}</Text>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.productDescription}>{product.description}</Text>

          <Text style={styles.sectionTitle}>Ingredients</Text>
          <View style={styles.ingredientsList}>
            {product.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Nutrition Facts</Text>
          <View style={styles.nutritionContainer}>
            {Object.entries(product.nutrition).map(([key, value]) => (
              <View key={key} style={styles.nutritionItem}>
                <Text style={styles.nutritionKey}>{key}</Text>
                <Text style={styles.nutritionValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            style={styles.quantityButton}
          >
            <Minus size={20} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            onPress={() => setQuantity(quantity + 1)}
            style={styles.quantityButton}
          >
            <Plus size={20} color="#111827" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleAddToCart}
          style={styles.addToCartButton}
        >
          <Animated.View style={buttonAnimatedStyle}>
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
  productImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f3f4f6',
  },
  productInfo: {
    padding: 24,
  },
  productTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    color: '#fbbf24',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 4,
  },
  reviewsText: {
    color: '#6b7280',
    marginLeft: 8,
  },
  productPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    marginTop: 8,
  },
  productDescription: {
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: 24,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  ingredientItem: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  ingredientText: {
    color: '#374151',
    fontSize: 14,
  },
  nutritionContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  nutritionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  nutritionKey: {
    color: '#374151',
    fontWeight: '500',
  },
  nutritionValue: {
    color: '#111827',
    fontWeight: '600',
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginRight: 16,
  },
  quantityButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 16,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
