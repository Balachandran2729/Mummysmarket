import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../core/common/colour';
import { useAppDispatch, useAppSelector, fetchProducts, productSelectors } from '../../core/redux';

const HomeScreen = () => {

    const dispatch = useAppDispatch();
    const products = useAppSelector(productSelectors.selectProducts);
    const loading = useAppSelector(productSelectors.selectProductsLoading);
    const error = useAppSelector(productSelectors.selectProductsError);

    useEffect(() => {
        dispatch(fetchProducts({ limit: 2, skip: 0 }));
    }, [dispatch]);

    console.log("Test Data :" , products);
    


    return (
        <SafeAreaView className="flex-1 bg-black">  
            <View className="flex-row items-center justify-between px-4 py-2 bg-black">
                <Text className="text-2xl font-bold text-white">
                    MummysMarket
                </Text>
            </View>
            <View className="flex-1 items-center justify-center">
                <Text className="text-white text-lg">Welcome to MummysMarket!</Text>
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen;