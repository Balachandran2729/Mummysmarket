import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';



const ProdectDetails = () => {


    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className="flex-row items-center justify-between px-4 py-2 bg-black">
                <Text className="text-2xl font-bold text-white">
                     MummysMarket
                </Text>
            </View>
                <View className="flex-1 items-center justify-center">
                    <Text className="text-white text-lg">Welcome to Prodect Details!</Text>
                </View>

        </SafeAreaView>
    )
}

export default ProdectDetails;