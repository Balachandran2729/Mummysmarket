import React, { useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { COLORS } from '../../core/common/colour';
import {
  useAppDispatch,
  useAppSelector,
  toggleFavorite,
  addToCart,
  productSelectors,
} from '../../core/redux';
import type { AppStackParamList } from '../../core/navigation/types';
import { usePostHog } from 'posthog-react-native';

type ProductDetailsRouteProp = RouteProp<AppStackParamList, 'ProductDetails'>;

const ProductDetails = () => {
  const navigation = useNavigation();
  const route = useRoute<ProductDetailsRouteProp>();
  const { product } = route.params;
  const posthog = usePostHog();

  useEffect(() => {
    const openedAt = Date.now();

     posthog.screen('ProductDetails');

    return () => {
      const durationMs = Date.now() - openedAt;
      posthog.capture('screen_duration', {
        screen_name: 'ProductDetails',
        product_id: product.id,
        product_title: product.title,
        duration_ms: durationMs,
        duration_seconds: Math.round(durationMs / 1000),
      });
    };
  }, [posthog, product.id, product.title]);

  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector(productSelectors.selectIsFavorite(product.id));
  const cartQty = useAppSelector(productSelectors.selectCartQuantity(product.id));

  const hasDiscount = product.discountPercentage > 0;
  const discountedPrice = product.price - (product.price * product.discountPercentage) / 100;
  const inStock = product.stock > 0; 

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <View
        className="flex-row items-center justify-between px-4 py-3"
        style={{ backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text className="text-base font-semibold" style={{ color: COLORS.text }}>
          Product Details
        </Text>
        <TouchableOpacity onPress={() => dispatch(toggleFavorite(product))} hitSlop={10}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite ? COLORS.favorite : COLORS.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: product.thumbnail }}
          className="w-full h-72"
          resizeMode="cover"
          style={{ backgroundColor: COLORS.borderLight }}
        />

        <View className="p-4">
          <View className="flex-row items-center justify-between">
            <View className="self-start px-2.5 py-1 rounded-full" style={{ backgroundColor: COLORS.primaryLight }}>
              <Text className="text-xs font-medium capitalize" style={{ color: COLORS.primaryDark }}>
                {product.category}
              </Text>
            </View>

            <View
              className="flex-row items-center px-2.5 py-1 rounded-full"
              style={{ backgroundColor: inStock ? '#DCFCE7' : COLORS.favoriteLight }}
            >
              <View
                className="w-1.5 h-1.5 rounded-full mr-1.5"
                style={{ backgroundColor: inStock ? COLORS.success : COLORS.error }}
              />
              <Text className="text-xs font-medium" style={{ color: inStock ? COLORS.success : COLORS.error }}>
                {inStock ? `In Stock (${product.stock})` : 'Out of Stock'}
              </Text>
            </View>
          </View>

          <Text className="text-xl font-bold mt-3" style={{ color: COLORS.text }}>
            {product.title}
          </Text>

          <View className="flex-row items-center mt-1.5">
            <Ionicons name="star" size={14} color={COLORS.star} />
            <Text className="text-sm ml-1" style={{ color: COLORS.textSecondary }}>
              {product.rating.toFixed(1)} rating
            </Text>
          </View>

          <View className="flex-row items-end mt-3">
            <Text className="text-2xl font-bold" style={{ color: COLORS.text }}>
              ${discountedPrice.toFixed(2)}
            </Text>
            {hasDiscount && (
              <>
                <Text className="text-sm line-through ml-2 mb-1" style={{ color: COLORS.textMuted }}>
                  ${product.price.toFixed(2)}
                </Text>
                <View className="ml-2 mb-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: COLORS.error }}>
                  <Text className="text-[10px] font-bold text-white">
                    -{Math.round(product.discountPercentage)}%
                  </Text>
                </View>
              </>
            )}
          </View>

          <View className="h-px my-4" style={{ backgroundColor: COLORS.border }} />

          <Text className="text-sm font-semibold mb-1.5" style={{ color: COLORS.text }}>
            Description
          </Text>
          <Text className="text-sm leading-5" style={{ color: COLORS.textSecondary }}>
            {product.description}
          </Text>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 flex-row items-center px-4 py-3 mb-4"
        style={{ backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border }}
      >
        <TouchableOpacity
          onPress={() => dispatch(toggleFavorite(product))}
          className="w-12 h-12 rounded-xl items-center justify-center mr-3"
          style={{ backgroundColor: isFavorite ? COLORS.favoriteLight : COLORS.borderLight }}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite ? COLORS.favorite : COLORS.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => dispatch(addToCart(product))}
          disabled={!inStock}
          className="flex-1 h-12 rounded-xl items-center justify-center flex-row"
          style={{ backgroundColor: inStock ? COLORS.primary : COLORS.border }}
        >
          <Ionicons name="cart-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
          <Text className="text-white font-semibold text-sm">
            {cartQty > 0 ? `Add More (${cartQty} in cart)` : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetails;