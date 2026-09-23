import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import cashbackData from '../../core/data/dummyData.json';

type RootStackParamList = {
  CashbackList: undefined;
  CashbackDetails: { vendorId: number };
};

type NavProp = NativeStackNavigationProp<RootStackParamList, 'CashbackList'>;

interface VendorCashback {
  vendorId: number;
  vendorName: string;
  image: string;
  cashbackAmount: number;
  expiresInDays: number;
  expiryDate: string;
}

const formatExpiry = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const CashbackListScreen = () => {
  const navigation = useNavigation<NavProp>();

  const { note } = cashbackData.cashbackSummary;
  const vendors: VendorCashback[] = cashbackData.cashbackListing;

  const totalCashbackAllVendors = vendors.reduce( (sum, vendor) => sum + vendor.cashbackAmount, 0 );

  const renderItem = ({ item }: { item: VendorCashback }) => (
    <TouchableOpacity
      className="flex-row items-center p-3 mb-2"
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate('CashbackDetails', { vendorId: item.vendorId })
      }
    >
      <Image
        source={{ uri: item.image }}
        style={{
          width: 130,
          height: 40,
        }}
        resizeMode="contain"
      />

      <View className="flex-1">
        <Text className="text-md font-bold text-gray-700 mb-2">
          {item.vendorName}
        </Text>
        <Text className="text-[24px] font-semibold text-gray-900 mb-2">
          ${item.cashbackAmount.toFixed(2)}
        </Text>
        <Text className="text-[12px] font-semibold text-gray-700 mb-1">
          Expires in {item.expiresInDays} days ({formatExpiry(item.expiryDate)})
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#000" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>

      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
        </TouchableOpacity>
        <Text className="text-[17px] font-bold text-gray-900">
          My Cashback
        </Text>
        <Text></Text>
      </View>


      <View className="mx-4 mt-2 mb-3 px-6 py-4 rounded-2xl bg-rose-50">
        <Text className="text-md text-gray-900 mb-1 font-medium">
          Total Cashback (All Vendors)
        </Text>
        <Text className="text-[34px] font-bold text-rose-500 mb-1.5">
          ${totalCashbackAllVendors.toFixed(2)}
        </Text>
        <Text className="text-md text-gray-900  mb-1 font-medium">{note}</Text>
      </View>


      <FlatList
        data={vendors}
        keyExtractor={(item) => item.vendorId}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default CashbackListScreen;