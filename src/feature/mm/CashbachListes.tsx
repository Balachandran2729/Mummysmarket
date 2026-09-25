import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as Haptics from 'expo-haptics';
import cashbackData from '../../core/data/dummyData.json';
import CountUp from '../../core/common/CountUp';

const { width } = Dimensions.get('window');

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

// Baby-friendly pastel palette
const COLORS = {
  bg: '#FFF9F5',        // warm cream
  pink: '#FF6F9C',      // main accent
  pinkSoft: '#FFE8F0',
  text: '#4A3B47',
  subtext: '#8C7A88',
  border: '#FFE0EA',
};

// Logo tile backgrounds (baby blue, sunshine, mint, lavender)
const TILE_COLORS = ['#E3F2FD', '#FFF4CC', '#E4F8EF', '#F3E8FF'];

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

  const totalCashbackAllVendors = vendors.reduce(
    (sum, vendor) => sum + vendor.cashbackAmount,
    0
  );

  // Cannon is pre-mounted and fired by ref: no state change, no re-render
  const confettiRef = useRef<any>(null);
  const hasCelebrated = useRef(false);

  const handleCountFinish = useCallback(() => {
    if (hasCelebrated.current) return;
    hasCelebrated.current = true;
    confettiRef.current?.start();
    // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

 const renderItem = ({ item, index }: { item: VendorCashback; index: number }) => {
  const urgent = item.expiresInDays <= 7;
  const accent = urgent ? '#E07B2E' : '#2E9E6B';
  const accentSoft = urgent ? '#FFE9D6' : '#E4F8EF';

  const progress =
    Math.min(Math.max(item.expiresInDays / 30, 0.06), 1) * 100;

  return (
    <TouchableOpacity
      className="mb-2 rounded-2xl bg-white shadow-sm"
      style={{
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
      activeOpacity={0.85}
      onPress={() =>
        navigation.navigate('CashbackDetails', {
          vendorId: item.vendorId,
        })
      }
    >
      {/* Top: logo + vendor + status */}
      <View className="flex-row items-center p-4">
        {/* Smaller Logo */}
        <View
          className="items-center justify-center rounded-xl"
          style={{
            width: 72,
            height: 56,
            backgroundColor: TILE_COLORS[index % TILE_COLORS.length],
          }}
        >
          <Image
            source={{ uri: item.image }}
            style={{
              width: 56,
              height: 34,
            }}
            resizeMode="contain"
          />
        </View>

        {/* Vendor */}
        <View className="flex-1 ml-2">
          <Text
            className="text-[14px] font-bold mb-0.5"
            style={{ color: COLORS.text }}
            numberOfLines={1}
          >
            {item.vendorName}
          </Text>

          {/* Status */}
          <View
            className="flex-row items-center self-start rounded-full px-1.5 py-0.5"
            style={{ backgroundColor: accentSoft }}
          >
            <Ionicons
              name={urgent ? 'flame' : 'checkmark-circle'}
              size={12}
              color={accent}
            />

            <Text
              className="text-[12px] font-bold ml-0.5"
              style={{ color: accent }}
            >
              {urgent ? 'Expiring soon' : 'Active'}
            </Text>
          </View>
        </View>

        {/* Arrow */}
        <View
          className="items-center justify-center rounded-full"
          style={{
            width: 24,
            height: 24,
            backgroundColor: COLORS.pinkSoft,
          }}
        >
          <Ionicons
            name="chevron-forward"
            size={13}
            color={COLORS.pink}
          />
        </View>
      </View>

      {/* Ticket divider */}
      <View
        style={{
          height: 12,
          justifyContent: 'center',
        }}
      >
        {/* Left notch */}
        <View
          style={{
            position: 'absolute',
            left: -8,
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: COLORS.bg,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        />

        {/* Right notch */}
        <View
          style={{
            position: 'absolute',
            right: -8,
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: COLORS.bg,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        />

        {/* Dashed line */}
        <View
          className="flex-row justify-between"
          style={{
            marginHorizontal: 14,
          }}
        >
          {Array.from({ length: 22 }).map((_, i) => (
            <View
              key={i}
              style={{
                width: 3,
                height: 1.5,
                borderRadius: 1,
                backgroundColor: COLORS.border,
              }}
            />
          ))}
        </View>
      </View>

      {/* Bottom */}
      <View className="px-2 pb-2 pt-1.5">
        <View className="flex-row items-center justify-between">
          
          {/* Cashback Amount */}
          <View className="flex-row items-center">
            <View
              className="items-center justify-center rounded-full mr-1.5"
              style={{
                width: 28,
                height: 28,
                backgroundColor: COLORS.pinkSoft,
              }}
            >
              <Ionicons
                name="wallet-outline"
                size={12}
                color={COLORS.pink}
              />
            </View>

            <View>
              <Text
                className="text-[10px] font-semibold"
                style={{ color: COLORS.subtext }}
              >
                Cashback
              </Text>

              <Text
                className="text-[22px] font-extrabold mt-2"
                style={{
                  color: COLORS.pink,
                  lineHeight: 19,
                }}
              >
                ${item.cashbackAmount.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Expiry */}
          <View className="items-end">
            <View className="flex-row items-center">
              <Ionicons
                name={urgent ? 'alarm-outline' : 'time-outline'}
                size={12}
                color={accent}
              />

              <Text
                className="text-[10px] font-bold ml-1"
                style={{ color: accent }}
              >
                {item.expiresInDays} days left
              </Text>
            </View>

            <View className="flex-row items-center mt-2">
              <Ionicons
                name="calendar-outline"
                size={12}
                color={COLORS.subtext}
              />

              <Text
                className="text-[10px] font-medium ml-1"
                style={{ color: COLORS.subtext }}
              >
                {formatExpiry(item.expiryDate)}
              </Text>
            </View>
          </View>
        </View>

        {/* Progress */}
        <View
          className="mt-2 rounded-full overflow-hidden"
          style={{
            height: 3,
            backgroundColor: '#F4EAEE',
          }}
        >
          <View
            className="rounded-full"
            style={{
              width: `${progress}%`,
              height: 3,
              backgroundColor: urgent ? '#F59E42' : COLORS.pink,
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: COLORS.bg }}
      edges={['top']}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          className="items-center justify-center rounded-full bg-white shadow-sm"
          style={{ width: 40, height: 40 }}
        >
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </TouchableOpacity>

        <Text className="text-[18px] font-extrabold" style={{ color: COLORS.text }}>
          My Cashback
        </Text>

        <View style={{ width: 40 }} />
      </View>

      {/* Total cashback card */}
      <View
        className="mx-4 mt-2 mb-4 px-6 py-5 rounded-3xl overflow-hidden"
        style={{ backgroundColor: COLORS.pinkSoft }}
      >
        {/* Decorative bubbles */}
        <View
          className="absolute rounded-full"
          style={{
            width: 110,
            height: 110,
            right: -30,
            top: -30,
            backgroundColor: 'rgba(255,255,255,0.55)',
          }}
        />
        <View
          className="absolute rounded-full"
          style={{
            width: 80,
            height: 80,
            right: 40,
            bottom: -20,
            backgroundColor: 'rgba(255,255,255,0.4)',
          }}
        />
        <Image
          source={require('../../../assets/Don_t_miss_baby_fair_Header-removebg-preview.png')}
          style={{
            position: 'absolute',
            right: 12,
            top: 10,
            width: 80,
            height: 80,
          }}
          resizeMode="contain"
        />

        <Text
          className="text-[13px] font-semibold mb-1"
          style={{ color: COLORS.subtext }}
        >
          Total Cashback (All Vendors)
        </Text>

        <CountUp
          value={totalCashbackAllVendors}
          finishAt={0.98}
          onFinish={totalCashbackAllVendors > 0 ? handleCountFinish : undefined}
          className="text-[36px] font-extrabold text-[#FF6F9C]"
        />

        <View
          className="self-start rounded-2xl px-3 py-1.5 mt-2"
          style={{ backgroundColor: 'rgba(255,255,255,0.75)' }}
        >
          <Text className="text-[12px] font-medium" style={{ color: COLORS.text }}>
            💝 {note}
          </Text>
        </View>
      </View>

      {/* Section title */}
      <Text
        className="px-5 mb-2 text-[16px] font-bold"
        style={{ color: COLORS.text }}
      >
        Your Vendors 🧸
      </Text>

      <FlatList
        data={vendors}
        keyExtractor={(item) => item.vendorId.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Always mounted, hidden until start() is called. Keep it LAST. */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <ConfettiCannon
          ref={confettiRef}
          autoStart={false}
          count={320}
          origin={{ x: width / 2, y: -20 }}
          fadeOut
          explosionSpeed={250}
          fallSpeed={3000}
          colors={['#FF6F9C', '#FFB3CB', '#7CC7FF', '#FFD966', '#8EE3B8', '#C9A7FF']}
        />
      </View>
    </SafeAreaView>
  );
};

export default CashbackListScreen;