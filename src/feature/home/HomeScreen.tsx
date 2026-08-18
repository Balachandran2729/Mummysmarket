import React, {  useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../core/common/colour';
import { useAppDispatch, useAppSelector, fetchProducts, productSelectors } from '../../core/redux';
import type { Product } from '../../core/redux';
import ProductCard from './ProductCard';

const LIMIT = 15;

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(productSelectors.selectProducts);
  const loading = useAppSelector(productSelectors.selectProductsLoading);
  const error = useAppSelector(productSelectors.selectProductsError);
  const total = useAppSelector(productSelectors.selectProductsTotal);

  const isFetchingRef = useRef(false);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts({ limit: LIMIT, skip: 0 }));
  }, [dispatch]);

  const isInitialLoading = loading && products.length === 0;
  const hasMore = total === 0 || products.length < total;

  const handleLoadMore = useCallback(() => {
  if (isFetchingRef.current || loading || !hasMore) return;

  isFetchingRef.current = true;
  setIsLoadingMore(true);

  dispatch(fetchProducts({ limit: LIMIT, skip: products.length }))
    .unwrap()
    .catch((err) => {
      console.log('Load more failed:', err); // temp — see real cause below
    })
    .finally(() => {
      isFetchingRef.current = false;
      setIsLoadingMore(false);
    });
}, [dispatch, loading, hasMore, products.length]);

  const handleRetry = () => {
    dispatch(fetchProducts({ limit: LIMIT, skip: 0 }));
  };

  const renderFooter = () => {
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
          <Text style={{ color: COLORS.error }} className="text-sm">
            Failed to load more. Tap to retry.
          </Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="items-center justify-center py-3 bg-black">
        <Text className="text-2xl font-bold text-white">MummysMarket</Text>
      </View>

      <View className="flex-1">
        {isInitialLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : error && products.length === 0 ? (
          <View className="flex-1 items-center justify-center px-6">
            <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
            <Text style={{ color: COLORS.error }} className="text-base text-center mt-2">
              {error}
            </Text>
            <TouchableOpacity
              onPress={handleRetry}
              className="mt-4 px-5 py-2 rounded-lg"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Text className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item: Product) => item.id.toString()}
            renderItem={({ item }) => <ProductCard product={item} />}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 12 }}
            contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;