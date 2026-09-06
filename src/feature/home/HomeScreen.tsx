import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../core/common/colour';
import {
  useAppDispatch,
  useAppSelector,
  fetchProducts,
  loadFavorites,
  loadCart,
  productSelectors,
} from '../../core/redux';
import type { Product } from '../../core/redux';
import ProductCard from './ProductCard';
import SkeletonCard from './SkeletonCard';
import { usePostHog } from 'posthog-react-native';

const LIMIT = 15;

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(productSelectors.selectProducts);
  const loading = useAppSelector(productSelectors.selectProductsLoading);
  const error = useAppSelector(productSelectors.selectProductsError);
  const total = useAppSelector(productSelectors.selectProductsTotal);
  const cartCount = useAppSelector(productSelectors.selectCartCount);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const isFetchingRef = useRef(false);

  const posthog = usePostHog();

  useEffect(() => {
  const openedAt = Date.now();

  // Track screen view
  posthog.screen('HomeScreen');

  dispatch(fetchProducts({ limit: LIMIT, skip: 0 }));
  dispatch(loadFavorites());
  dispatch(loadCart());

  return () => {
    const durationMs = Date.now() - openedAt;

    posthog.capture('screen_duration', {
      screen_name: 'HomeScreen',
      duration_ms: durationMs,
      duration_seconds: Math.round(durationMs / 1000),
    });
  };
}, [dispatch, posthog]);

  const isInitialLoading = loading && products.length === 0;
  const hasMore = total === 0 || products.length < total;

  const handleLoadMore = useCallback(() => {
    if (isFetchingRef.current || loading || !hasMore || search.trim().length > 0) return;

    isFetchingRef.current = true;
    setIsLoadingMore(true);

    dispatch(fetchProducts({ limit: LIMIT, skip: products.length }))
      .unwrap()
      .catch((err) => console.log('Load more failed:', err))
      .finally(() => {
        isFetchingRef.current = false;
        setIsLoadingMore(false);
      });
  }, [dispatch, loading, hasMore, products.length, search]);

  const handleRetry = () => {
    dispatch(fetchProducts({ limit: LIMIT, skip: 0 }));
  };

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.trim().toLowerCase();
    return products.filter(
      (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [products, search]);

  const handlePress = () => {
      posthog.capture('Cart_button_clicked',{
      category: 'travel',
      has_image: true,
    });
      console.log('Cart button pressed');
  };

  const renderFooter = () => {
    if (search.trim().length > 0) return null;
    if (isLoadingMore) {
      return (
        <View className="py-4">
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      );
    }
    if (error && products.length > 0) {
      return (
        <TouchableOpacity onPress={handleLoadMore} className="py-4 items-center">
          <Text style={{ color: COLORS.error }} className="text-sm font-medium">
            Couldn't load more. Tap to retry.
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderEmpty = () => {
    if (isInitialLoading || (error && products.length === 0)) return null;
    return (
      <View className="flex-1 items-center justify-center py-24">
        <Ionicons name="search-outline" size={40} color={COLORS.textMuted} />
        <Text className="text-base font-medium mt-3" style={{ color: COLORS.text }}>
          No products found
        </Text>
        <Text className="text-sm mt-1 text-center px-8" style={{ color: COLORS.textSecondary }}>
          Try a different search term
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.background }}>
      {/* Header */}
      <View
        className="items-center justify-center py-3 relative"
        style={{ backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border }}
      >
        <Text className="text-lg font-bold" style={{ color: COLORS.text }}>
          MummysMarket
        </Text>

        <TouchableOpacity
          className="absolute right-4 top-2.5 w-9 h-9 rounded-full items-center justify-center"
          style={{ backgroundColor: COLORS.primaryLight }}
          onPress={handlePress}
        >
          <Ionicons name="cart-outline" size={18} color={COLORS.primaryDark} />
          {cartCount > 0 && (
            <View
              className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full items-center justify-center"
              style={{ backgroundColor: COLORS.error }}
            >
              <Text className="text-[10px] font-bold text-white">{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View className="px-4 py-3">
        <View
          className="flex-row items-center rounded-xl px-3"
          style={{ backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border }}
        >
          <Ionicons name="search" size={16} color={COLORS.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search products"
            placeholderTextColor={COLORS.textMuted}
            returnKeyType="search"
            onSubmitEditing={Keyboard.dismiss}
            className="flex-1 py-2.5 px-2 text-sm"
            style={{ color: COLORS.text }}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
              <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="flex-1">
        {isInitialLoading ? (
          <FlatList
            data={Array.from({ length: 6 })}
            keyExtractor={(_, i) => `skeleton-${i}`}
            renderItem={() => <SkeletonCard />}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
            contentContainerStyle={{ paddingTop: 4 }}
          />
        ) : error && products.length === 0 ? (
          <View className="flex-1 items-center justify-center px-6">
            <Ionicons name="cloud-offline-outline" size={44} color={COLORS.error} />
            <Text className="text-base font-semibold text-center mt-3" style={{ color: COLORS.text }}>
              Something went wrong
            </Text>
            <Text className="text-sm text-center mt-1" style={{ color: COLORS.textSecondary }}>
              {error}
            </Text>
            <TouchableOpacity
              onPress={handleRetry}
              className="mt-4 px-5 py-2.5 rounded-xl"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Text className="text-white font-semibold text-sm">Try again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item: Product) => item.id.toString()}
            renderItem={({ item }) => <ProductCard product={item} />}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
            contentContainerStyle={{ paddingTop: 4, paddingBottom: 24, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={Keyboard.dismiss}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;