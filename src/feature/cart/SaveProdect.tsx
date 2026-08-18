import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

type NavigationProp = StackNavigationProp<AppStackParamList>;

const SavedRow: React.FC<{ product: Product }> = React.memo(({ product }) => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const cartQty = useAppSelector(productSelectors.selectCartQuantity(product.id));

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ProductDetails', { product })}
      className="flex-row p-3 rounded-2xl mb-3"
      style={{ backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.borderLight }}
    >
      <Image
        source={{ uri: product.thumbnail }}
        className="w-20 h-20 rounded-xl"
        resizeMode="cover"
        style={{ backgroundColor: COLORS.borderLight }}
      />

      <View className="flex-1 ml-3 justify-between">
        <View>
          <Text numberOfLines={1} className="text-sm font-semibold" style={{ color: COLORS.text }}>
            {product.title}
          </Text>
          <Text className="text-base font-bold mt-1" style={{ color: COLORS.primary }}>
            ${product.price.toFixed(2)}
          </Text>
        </View>

        <View className="flex-row items-center justify-between mt-1">
          <TouchableOpacity
            onPress={() => dispatch(addToCart(product))}
            className="flex-row items-center px-3 py-1.5 rounded-full"
            style={{ backgroundColor: cartQty > 0 ? COLORS.primary : COLORS.primaryLight }}
          >
            <Ionicons
              name="cart-outline"
              size={13}
              color={cartQty > 0 ? '#fff' : COLORS.primaryDark}
              style={{ marginRight: 4 }}
            />
            <Text
              className="text-xs font-semibold"
              style={{ color: cartQty > 0 ? '#fff' : COLORS.primaryDark }}
            >
              {cartQty > 0 ? `In Cart (${cartQty})` : 'Add to Cart'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => dispatch(toggleFavorite(product))}
            hitSlop={8}
            className="w-8 h-8 items-center justify-center rounded-full"
            style={{ backgroundColor: COLORS.favoriteLight }}
          >
            <Ionicons name="heart" size={16} color={COLORS.favorite} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const SaveProduct = () => {
  const favorites = useAppSelector(productSelectors.selectFavoriteItems);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <View
        className="items-center justify-center py-3"
        style={{ backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border }}
      >
        <Text className="text-lg font-bold" style={{ color: COLORS.text }}>
          Saved Products
        </Text>
      </View>

      {favorites.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="heart-outline" size={44} color={COLORS.textMuted} />
          <Text className="text-base font-semibold mt-3" style={{ color: COLORS.text }}>
            No saved products yet
          </Text>
          <Text className="text-sm text-center mt-1" style={{ color: COLORS.textSecondary }}>
            Tap the heart on any product to save it here
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <SavedRow product={item} />}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default SaveProduct;