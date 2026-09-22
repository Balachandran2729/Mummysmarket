import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS } from '../../core/common/colour';
import {
  useAppDispatch,
  useAppSelector,
  toggleFavorite,
  addToCart,
  productSelectors,
} from '../../core/redux';
import type { Product } from '../../core/redux';
import type { AppStackParamList } from '../../core/navigation/types';
import { usePostHog } from 'posthog-react-native';

interface ProductCardProps {
  product: Product;
}

type NavigationProp = StackNavigationProp<AppStackParamList>;

const getFirstPhoto = (photos: string): string | undefined => {
  try {
    const parsed = JSON.parse(photos);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // API sometimes leaves a trailing comma inside the URL string
      return String(parsed[0]).replace(/,+$/, '').trim();
    }
  } catch {
    // ignore malformed photos
  }
  return undefined;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector(productSelectors.selectIsFavorite(product.id));
  const cartQty = useAppSelector(productSelectors.selectCartQuantity(product.id));
  const posthog = usePostHog();

  const amount = parseFloat(product.amount);
  const offerPrice = parseFloat(product.offer_price);
  const offer = parseFloat(product.offer);
  const hasDiscount = offer > 0;
  const thumbnail = getFirstPhoto(product.photos);

    const handlePress = (product: Product) => {

      posthog.capture('ProductCard_clicked', {
      product_id: product.id,
      product_title: product.title,
      product_category: product.category,
      });
      console.log('Product Pressed...')
      navigation.navigate('ProductDetails', { product })

    }

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => handlePress(product)}
      className="rounded-2xl mb-4 overflow-hidden"
      style={{
        backgroundColor: COLORS.surface,
        width: '48%',
        borderWidth: 1,
        borderColor: COLORS.borderLight,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <View>
        <Image
          source={{ uri: thumbnail }}
          className="w-full h-32"
          resizeMode="cover"
          style={{ backgroundColor: COLORS.borderLight }}
        />

        {hasDiscount && (
          <View
            className="absolute top-2 left-2 px-2 py-0.5 rounded-full"
            style={{ backgroundColor: COLORS.error }}
          >
            <Text className="text-[10px] font-bold text-white">
              -{Math.round(offer)}%
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => dispatch(toggleFavorite(product))}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={16}
            color={isFavorite ? COLORS.favorite : COLORS.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View className="p-3">
        <View
          className="self-start px-2 py-0.5 rounded-full mb-1.5"
          style={{ backgroundColor: COLORS.primaryLight }}
        >
          <Text
            className="text-[10px] font-medium capitalize"
            style={{ color: COLORS.primaryDark }}
          >
            {product.category}
          </Text>
        </View>

        <Text
          numberOfLines={2}
          className="text-sm font-semibold leading-4 h-8"
          style={{ color: COLORS.text }}
        >
          {product.title}
        </Text>

        <View className="flex-row items-center mt-1.5">
          <Ionicons name="cube-outline" size={12} color={COLORS.textMuted} />
          <Text className="text-xs ml-1" style={{ color: COLORS.textSecondary }}>
            {product.available} left
          </Text>
        </View>

        <View className="flex-row items-center justify-between mt-2">
          <View>
            <Text className="text-base font-bold" style={{ color: COLORS.text }}>
              ₹{offerPrice.toFixed(2)}
            </Text>
            {hasDiscount && (
              <Text
                className="text-[11px] line-through"
                style={{ color: COLORS.textMuted }}
              >
                ₹{amount.toFixed(2)}
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={() => dispatch(addToCart(product))}
            className="w-9 h-9 rounded-full items-center justify-center"
            style={{
              backgroundColor: cartQty > 0 ? COLORS.primary : COLORS.primaryLight,
            }}
          >
            {cartQty > 0 ? (
              <Text className="text-xs font-bold text-white">{cartQty}</Text>
            ) : (
              <Ionicons name="add" size={18} color={COLORS.primaryDark} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(ProductCard);