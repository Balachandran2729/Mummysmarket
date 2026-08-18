import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { COLORS } from '../../core/common/colour';
import {
  useAppDispatch,
  useAppSelector,
  addToCart,
  decreaseQuantity,
  removeFromCart,
  productSelectors,
} from '../../core/redux';
import type { CartItem } from '../../core/redux';
import type { AppStackParamList } from '../../core/navigation/types';

type NavigationProp = StackNavigationProp<AppStackParamList>;

const CartRow: React.FC<{ item: CartItem }> = React.memo(({ item }) => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const { product, quantity } = item;

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
          <View
            className="flex-row items-center rounded-full"
            style={{ backgroundColor: COLORS.borderLight }}
          >
            <TouchableOpacity
              onPress={() => dispatch(decreaseQuantity(product.id))}
              hitSlop={8}
              className="w-8 h-8 items-center justify-center"
            >
              <Ionicons name="remove" size={16} color={COLORS.text} />
            </TouchableOpacity>
            <Text className="text-sm font-semibold w-6 text-center" style={{ color: COLORS.text }}>
              {quantity}
            </Text>
            <TouchableOpacity
              onPress={() => dispatch(addToCart(product))}
              hitSlop={8}
              className="w-8 h-8 items-center justify-center"
            >
              <Ionicons name="add" size={16} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => dispatch(removeFromCart(product.id))}
            hitSlop={8}
            className="w-8 h-8 items-center justify-center rounded-full"
            style={{ backgroundColor: COLORS.favoriteLight }}
          >
            <Ionicons name="trash-outline" size={15} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const CartScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const tabBarHeight = useBottomTabBarHeight();
  const cartItems = useAppSelector(productSelectors.selectCartItems);
  const total = useAppSelector(productSelectors.selectCartTotal);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <View
        className="flex-row items-center justify-between px-4 py-3"
        style={{ backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border }}
      >
        <View style={{ width: 36 }} />
        <Text className="text-lg font-bold" style={{ color: COLORS.text }}>
          My Cart
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('SaveProduct')}
          hitSlop={8}
          className="w-9 h-9 rounded-full items-center justify-center"
          style={{ backgroundColor: COLORS.favoriteLight }}
        >
          <Ionicons name="heart-outline" size={18} color={COLORS.favorite} />
        </TouchableOpacity>
      </View>

      {cartItems.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="cart-outline" size={44} color={COLORS.textMuted} />
          <Text className="text-base font-semibold mt-3" style={{ color: COLORS.text }}>
            Your cart is empty
          </Text>
          <Text className="text-sm text-center mt-1" style={{ color: COLORS.textSecondary }}>
            Products you add to cart will show up here
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.product.id.toString()}
            renderItem={({ item }) => <CartRow item={item} />}
            contentContainerStyle={{ padding: 16, paddingBottom: tabBarHeight + 100 }}
            showsVerticalScrollIndicator={false}
          />

          <View
            className="absolute left-0 right-0 px-4 pt-3"
            style={{
              bottom: tabBarHeight,
              backgroundColor: COLORS.surface,
              borderTopWidth: 1,
              borderTopColor: COLORS.border,
              paddingBottom: 12,
            }}
          >
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm" style={{ color: COLORS.textSecondary }}>
                Total ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)
              </Text>
              <Text className="text-xl font-bold" style={{ color: COLORS.text }}>
                ${total.toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity
              className="h-12 rounded-xl items-center justify-center"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Text className="text-white font-semibold text-sm">Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;