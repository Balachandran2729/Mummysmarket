import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../core/common/colour';
import type { Product } from '../../core/redux';

interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress?.(product)}
      className="rounded-2xl mb-4 overflow-hidden"
      style={{ backgroundColor: COLORS.white, width: '48%' }}
    >
      <Image
        source={{ uri: product.thumbnail }}
        className="w-full h-32"
        resizeMode="cover"
      />

      <View className="p-2">
        <Text
          numberOfLines={1}
          className="text-sm font-semibold"
          style={{ color: COLORS.text }}
        >
          {product.title}
        </Text>

        <View className="flex-row items-center justify-between mt-1">
          <Text className="text-base font-bold" style={{ color: COLORS.primary }}>
            ${product.price.toFixed(2)}
          </Text>

          <View className="flex-row items-center">
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text className="text-xs ml-1" style={{ color: COLORS.textSecondary }}>
              {product.rating.toFixed(1)}
            </Text>
          </View>
        </View>

        <Text
          numberOfLines={1}
          className="text-xs mt-1 capitalize"
          style={{ color: COLORS.textSecondary }}
        >
          {product.category}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;