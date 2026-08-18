import React from 'react';
import { View } from 'react-native';
import { COLORS } from '../../core/common/colour';

const SkeletonCard = () => (
  <View
    className="rounded-2xl mb-4 overflow-hidden"
    style={{ backgroundColor: COLORS.surface, width: '48%', borderWidth: 1, borderColor: COLORS.borderLight }}
  >
    <View className="w-full h-32" style={{ backgroundColor: COLORS.skeleton }} />
    <View className="p-3">
      <View className="w-14 h-4 rounded-full mb-2" style={{ backgroundColor: COLORS.skeleton }} />
      <View className="w-full h-3 rounded mb-1.5" style={{ backgroundColor: COLORS.skeleton }} />
      <View className="w-2/3 h-3 rounded mb-3" style={{ backgroundColor: COLORS.skeleton }} />
      <View className="w-1/2 h-4 rounded" style={{ backgroundColor: COLORS.skeleton }} />
    </View>
  </View>
);

export default SkeletonCard;