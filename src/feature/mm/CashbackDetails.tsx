import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import cashbackData from '../../core/data/dummyData.json';

type RootStackParamList = {
  CashbackList: undefined;
  CashbackDetails: { vendorId: number };
};

type DetailsRouteProp = RouteProp<RootStackParamList, 'CashbackDetails'>;

interface HistoryItem {
  date: string;
  type: 'purchase' | 'redemption';
  label: string;
  amount: number;
  purchaseAmount?: number;
  receiptNo?: string;
  remainingBalance?: number;
  expiryDate?: string;
}

interface VendorDetails {
  vendorId: number;
  vendorName: string;
  image: string;
  availableCashback: number;
  expiresInDays: number;
  expiryDate: string;
  history: HistoryItem[];
}

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const CashbackDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<DetailsRouteProp>();
  const { vendorId } = route.params;

  const [activeTab, setActiveTab] = useState<'history' | 'summary'>('history');

  const vendor = (cashbackData.cashbackDetails as VendorDetails[]).find(
    (v) => v.vendorId === vendorId
  );

  if (!vendor) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <Text className="p-5 text-center text-gray-400">
          Vendor cashback details not found.
        </Text>
      </SafeAreaView>
    );
  }

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
    const isPurchase = item.type === 'purchase';
    return (
      <View className="flex-row justify-between py-3 px-3 border-b border-gray-100">
        <View className="flex-1">
          <Text className="text-[12px] font-bold text-gray-500 mb-1">
            {formatDate(item.date)}
          </Text>
          <Text className="text-[18px] font-semibold text-gray-900 mb-2">
            {item.label}
          </Text>

          {isPurchase ? (
            <>
              <Text className="text-[14px] font-semibold text-gray-700 mb-1">
                Purchase: ${item.purchaseAmount?.toFixed(2)}
              </Text>
              {item.expiryDate && (
                <Text className="text-[14px] font-semibold text-gray-700 mb-1">
                  Expires: {formatDate(item.expiryDate)}
                </Text>
              )}
            </>
          ) : (
            <>
              {item.receiptNo && (
                <Text className="text-[14px] font-semibold text-gray-700 mb-1">
                  Receipt: {item.receiptNo}
                </Text>
              )}
              {item.remainingBalance !== undefined && (
                <Text className="text-[14px] font-semibold text-gray-700 mb-1">
                  Remaining: ${item.remainingBalance.toFixed(2)}
                </Text>
              )}
            </>
          )}
        </View>

        <Text
          className={`text-[16px] font-bold ${
            isPurchase ? 'text-green-600' : 'text-rose-600'
          }`}
        >
          {isPurchase ? '+' : '-'}${Math.abs(item.amount).toFixed(2)}
        </Text>
      </View>
    );
  };

  const totalEarned = vendor.history
    .filter((h) => h.type === 'purchase')
    .reduce((sum, h) => sum + h.amount, 0);

  const totalUsed = Math.abs(
    vendor.history
      .filter((h) => h.type === 'redemption')
      .reduce((sum, h) => sum + h.amount, 0)
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
        </TouchableOpacity>
        <Text className="text-[17px] font-bold text-gray-900">
          {vendor.vendorName}
        </Text>
        <Text></Text>
      </View>

      {/* Vendor summary card */}
      <View className="mx-4 mt-2 mb-3 p-4 rounded-2xl bg-rose-50">
        <View className="flex-row items-center">
          <Image
            source={{ uri: vendor.image }}
             style={{
                width: 130,
                height: 40,
              }}
            resizeMode="contain"
          />
          <View className="flex-1 ml-3">
            <Text className="text-[14px] font-semibold text-gray-900 mb-0.5">
              Available Cashback
            </Text>
            <Text className="text-[32px] font-bold text-rose-500">
              ${vendor.availableCashback.toFixed(2)}
            </Text>

            <Text className="text-[12px] font-semibold text-gray-700 mt-3">
              Expires in {vendor.expiresInDays} days ({formatDate(vendor.expiryDate)})
            </Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row px-4 border-b border-gray-100 mb-2">
        <TouchableOpacity
          className="flex-1 items-center pb-2.5"
          onPress={() => setActiveTab('history')}
        >
          <Text
            className={`text-sm font-semibold ${
              activeTab === 'history' ? 'text-rose-600' : 'text-gray-900'
            }`}
          >
            History
          </Text>
          {activeTab === 'history' && (
            <View className="mt-1.5 h-0.5 w-full rounded bg-rose-600" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center pb-2.5"
          onPress={() => setActiveTab('summary')}
        >
          <Text
            className={`text-sm font-semibold ${
              activeTab === 'summary' ? 'text-rose-600' : 'text-gray-900'
            }`}
          >
            Summary
          </Text>
          {activeTab === 'summary' && (
            <View className="mt-1.5 h-0.5 w-full rounded bg-rose-600" />
          )}
        </TouchableOpacity>
      </View>

      {/* Content — flex-1 wrapper is the key fix: it always fills the
          remaining space between the tabs and the button, so the button
          is pinned to the bottom on BOTH tabs, regardless of how much
          content there is. */}
      <View className="flex-1">
        {activeTab === 'history' ? (
          <FlatList
            data={vendor.history}
            keyExtractor={(_, index) => `${vendor.vendorId}-${index}`}
            renderItem={renderHistoryItem}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex-1 px-4 pt-2">
            <Text className="text-xs text-gray-400 mt-3">Total Earned</Text>
            <Text className="text-xl font-bold text-gray-900">
              ${totalEarned.toFixed(2)}
            </Text>

            <Text className="text-xs text-gray-400 mt-3">Total Used</Text>
            <Text className="text-xl font-bold text-gray-900">
              ${totalUsed.toFixed(2)}
            </Text>

            <Text className="text-xs text-gray-400 mt-3">
              Available Balance
            </Text>
            <Text className="text-xl font-bold text-gray-900">
              ${vendor.availableCashback.toFixed(2)}
            </Text>
          </View>
        )}
      </View>

      {/* Common bottom button - now always pinned to the screen bottom
          on both tabs, since the sibling content View above is flex-1 */}
      {/* <TouchableOpacity className="mb-6 py-3 pb-4 items-center bg-white border-t border-gray-200">
        <Text className="text-rose-600 font-semibold text-[14px]">
          View All Transactions
        </Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
};

export default CashbackDetailsScreen;