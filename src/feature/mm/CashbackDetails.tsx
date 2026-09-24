import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
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

// Same palette as the list screen (move to a shared file if you like)
const COLORS = {
  bg: '#FFF9F5',
  pink: '#FF6F9C',
  pinkSoft: '#FFE8F0',
  text: '#4A3B47',
  subtext: '#8C7A88',
  border: '#FFE0EA',
  green: '#2E9E6B',
  greenSoft: '#E4F8EF',
  orange: '#E07B2E',
  orangeSoft: '#FFE9D6',
  blue: '#3B8FE0',
  blueSoft: '#E3F2FD',
};

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Small icon + text pill used inside history cards
const Chip = ({
  icon,
  text,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  text: string;
}) => (
  <View
    className="flex-row items-center rounded-full px-2 py-1 mr-1.5 mt-1.5"
    style={{ backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border }}
  >
    <Ionicons name={icon} size={12} color={COLORS.subtext} />
    <Text
      className="text-[11px] font-semibold ml-1"
      style={{ color: COLORS.subtext }}
    >
      {text}
    </Text>
  </View>
);

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
      <SafeAreaView
        className="flex-1 items-center justify-center px-8"
        style={{ backgroundColor: COLORS.bg }}
        edges={['top']}
      >
        <View
          className="items-center justify-center rounded-full mb-3"
          style={{ width: 64, height: 64, backgroundColor: COLORS.pinkSoft }}
        >
          <Ionicons name="alert-circle-outline" size={32} color={COLORS.pink} />
        </View>
        <Text
          className="text-center text-[15px] font-semibold"
          style={{ color: COLORS.subtext }}
        >
          Vendor cashback details not found.
        </Text>
      </SafeAreaView>
    );
  }

  const totalEarned = vendor.history
    .filter((h) => h.type === 'purchase')
    .reduce((sum, h) => sum + h.amount, 0);

  const totalUsed = Math.abs(
    vendor.history
      .filter((h) => h.type === 'redemption')
      .reduce((sum, h) => sum + h.amount, 0)
  );

  const urgent = vendor.expiresInDays <= 7;
  const accent = urgent ? COLORS.orange : COLORS.green;
  const accentSoft = urgent ? COLORS.orangeSoft : COLORS.greenSoft;

  // assumes a 30-day window (change 30 if yours differs)
  const expiryProgress =
    Math.min(Math.max(vendor.expiresInDays / 30, 0.06), 1) * 100;

  const usedPercent =
    totalEarned > 0 ? Math.min((totalUsed / totalEarned) * 100, 100) : 0;

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
    const isPurchase = item.type === 'purchase';
    const tone = isPurchase ? COLORS.green : COLORS.pink;
    const toneSoft = isPurchase ? COLORS.greenSoft : COLORS.pinkSoft;

    return (
      <View
        className="flex-row items-center p-3.5 mb-3 rounded-3xl bg-white shadow-sm"
        style={{ borderWidth: 1, borderColor: COLORS.border }}
      >
        {/* Type icon */}
        <View
          className="items-center justify-center rounded-2xl"
          style={{ width: 46, height: 46, backgroundColor: toneSoft }}
        >
          <Ionicons
            name={isPurchase ? 'bag-check-outline' : 'gift-outline'}
            size={22}
            color={tone}
          />
        </View>

        {/* Details */}
        <View className="flex-1 ml-3 mr-2">
          <Text
            className="text-[15px] font-bold"
            style={{ color: COLORS.text }}
            numberOfLines={1}
          >
            {item.label}
          </Text>

          <View className="flex-row items-center mt-0.5">
            <Ionicons name="calendar-outline" size={12} color={COLORS.subtext} />
            <Text
              className="text-[11px] font-semibold ml-1"
              style={{ color: COLORS.subtext }}
            >
              {formatDate(item.date)}
            </Text>
          </View>

          <View className="flex-row flex-wrap">
            {isPurchase ? (
              <>
                {item.purchaseAmount !== undefined && (
                  <Chip
                    icon="cart-outline"
                    text={`Purchase $${item.purchaseAmount.toFixed(2)}`}
                  />
                )}
                {item.expiryDate && (
                  <Chip
                    icon="time-outline"
                    text={`Expires ${formatDate(item.expiryDate)}`}
                  />
                )}
              </>
            ) : (
              <>
                {item.receiptNo && (
                  <Chip icon="receipt-outline" text={item.receiptNo} />
                )}
                {item.remainingBalance !== undefined && (
                  <Chip
                    icon="wallet-outline"
                    text={`Left $${item.remainingBalance.toFixed(2)}`}
                  />
                )}
              </>
            )}
          </View>
        </View>

        {/* Amount pill */}
        <View
          className="rounded-full px-2.5 py-1.5"
          style={{ backgroundColor: toneSoft }}
        >
          <Text className="text-[14px] font-extrabold" style={{ color: tone }}>
            {isPurchase ? '+' : '-'}${Math.abs(item.amount).toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  // Stat card used in the Summary tab
  const StatCard = ({
    icon,
    label,
    value,
    tone,
    toneSoft,
  }: {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    label: string;
    value: number;
    tone: string;
    toneSoft: string;
  }) => (
    <View
      className="flex-1 p-4 rounded-3xl bg-white shadow-sm"
      style={{ borderWidth: 1, borderColor: COLORS.border }}
    >
      <View
        className="items-center justify-center rounded-2xl mb-3"
        style={{ width: 42, height: 42, backgroundColor: toneSoft }}
      >
        <Ionicons name={icon} size={22} color={tone} />
      </View>
      <Text className="text-[12px] font-semibold" style={{ color: COLORS.subtext }}>
        {label}
      </Text>
      <Text className="text-[22px] font-extrabold" style={{ color: COLORS.text }}>
        ${value.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: COLORS.bg }}
      edges={['top']}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="items-center justify-center rounded-full bg-white shadow-sm"
          style={{ width: 40, height: 40 }}
        >
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </TouchableOpacity>

        <Text className="text-[18px] font-extrabold" style={{ color: COLORS.text }}>
          {vendor.vendorName}
        </Text>

        <View style={{ width: 40 }} />
      </View>

      {/* Vendor summary card */}
      <View
        className="mx-4 mt-2 mb-4 p-5 rounded-3xl overflow-hidden"
        style={{ backgroundColor: COLORS.pinkSoft }}
      >
        {/* Decorative bubbles */}
        <View
          className="absolute rounded-full"
          style={{
            width: 120,
            height: 120,
            right: -35,
            top: -35,
            backgroundColor: 'rgba(255,255,255,0.55)',
          }}
        />
        <View
          className="absolute rounded-full"
          style={{
            width: 64,
            height: 64,
            right: 50,
            bottom: -24,
            backgroundColor: 'rgba(255,255,255,0.4)',
          }}
        />
        <Ionicons
          name="sparkles"
          size={22}
          color={COLORS.pink}
          style={{ position: 'absolute', right: 16, top: 14, opacity: 0.6 }}
        />

        <View className="flex-row items-center">
          <View
            className="items-center justify-center rounded-2xl bg-white"
            style={{ width: 96, height: 72 }}
          >
            <Image
              source={{ uri: vendor.image }}
              style={{ width: 76, height: 36 }}
              resizeMode="contain"
            />
          </View>

          <View className="flex-1 ml-4">
            <Text
              className="text-[13px] font-semibold mb-0.5"
              style={{ color: COLORS.subtext }}
            >
              Available Cashback
            </Text>
            <Text
              className="text-[32px] font-extrabold"
              style={{ color: COLORS.pink, lineHeight: 38 }}
            >
              ${vendor.availableCashback.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Expiry row */}
        <View className="flex-row items-center justify-between mt-4">
          <View
            className="flex-row items-center rounded-full px-2.5 py-1.5"
            style={{ backgroundColor: accentSoft }}
          >
            <Ionicons
              name={urgent ? 'alarm-outline' : 'time-outline'}
              size={14}
              color={accent}
            />
            <Text className="text-[12px] font-bold ml-1" style={{ color: accent }}>
              {vendor.expiresInDays} days left
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={13} color={COLORS.subtext} />
            <Text
              className="text-[12px] font-semibold ml-1"
              style={{ color: COLORS.subtext }}
            >
              {formatDate(vendor.expiryDate)}
            </Text>
          </View>
        </View>

        {/* Expiry progress */}
        <View
          className="mt-3 rounded-full overflow-hidden"
          style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.8)' }}
        >
          <View
            className="rounded-full"
            style={{
              width: `${expiryProgress}%`,
              height: 6,
              backgroundColor: urgent ? '#F59E42' : COLORS.pink,
            }}
          />
        </View>
      </View>

      {/* Segmented tabs */}
      <View
        className="flex-row mx-4 mb-3 p-1 rounded-2xl bg-white"
        style={{ borderWidth: 1, borderColor: COLORS.border }}
      >
        {(
          [
            { key: 'history', label: 'History', icon: 'list-outline' },
            { key: 'summary', label: 'Summary', icon: 'stats-chart-outline' },
          ] as const
        ).map((tab) => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl"
              style={{ backgroundColor: active ? COLORS.pink : 'transparent' }}
              activeOpacity={0.8}
              onPress={() => setActiveTab(tab.key)}
            >
              <Ionicons
                name={tab.icon}
                size={16}
                color={active ? '#FFFFFF' : COLORS.subtext}
              />
              <Text
                className="text-[14px] font-bold ml-1.5"
                style={{ color: active ? '#FFFFFF' : COLORS.subtext }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
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
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Earned + Used side by side */}
            <View className="flex-row" style={{ gap: 12 }}>
              <StatCard
                icon="trending-up"
                label="Total Earned"
                value={totalEarned}
                tone={COLORS.green}
                toneSoft={COLORS.greenSoft}
              />
              <StatCard
                icon="gift-outline"
                label="Total Used"
                value={totalUsed}
                tone={COLORS.pink}
                toneSoft={COLORS.pinkSoft}
              />
            </View>

            {/* Available balance */}
            <View
              className="mt-3 p-4 rounded-3xl bg-white shadow-sm"
              style={{ borderWidth: 1, borderColor: COLORS.border }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View
                    className="items-center justify-center rounded-2xl mr-3"
                    style={{
                      width: 46,
                      height: 46,
                      backgroundColor: COLORS.blueSoft,
                    }}
                  >
                    <Ionicons name="wallet-outline" size={23} color={COLORS.blue} />
                  </View>
                  <View>
                    <Text
                      className="text-[12px] font-semibold"
                      style={{ color: COLORS.subtext }}
                    >
                      Available Balance
                    </Text>
                    <Text
                      className="text-[26px] font-extrabold"
                      style={{ color: COLORS.text, lineHeight: 30 }}
                    >
                      ${vendor.availableCashback.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Usage bar */}
              <View className="flex-row items-center justify-between mt-4 mb-1.5">
                <Text
                  className="text-[12px] font-semibold"
                  style={{ color: COLORS.subtext }}
                >
                  Cashback used
                </Text>
                <Text className="text-[12px] font-bold" style={{ color: COLORS.pink }}>
                  {usedPercent.toFixed(0)}%
                </Text>
              </View>
              <View
                className="rounded-full overflow-hidden"
                style={{ height: 8, backgroundColor: '#F4EAEE' }}
              >
                <View
                  className="rounded-full"
                  style={{
                    width: `${usedPercent}%`,
                    height: 8,
                    backgroundColor: COLORS.pink,
                  }}
                />
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CashbackDetailsScreen;