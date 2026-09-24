import React, { useEffect } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { cssInterop } from 'nativewind';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

// lets NativeWind's className work on the animated input
cssInterop(AnimatedTextInput, { className: 'style' });

interface CountUpProps
  extends Omit<TextInputProps, 'value' | 'defaultValue' | 'editable'> {
  value: number | string;
  from?: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: boolean;
  className?: string;
}

// 'worklet' lets this function run on the UI thread
const formatNumber = (
  n: number | string,
  decimals: number,
  separator: boolean,
  prefix: string,
  suffix: string
) => {
  'worklet';
  const numericValue = typeof n === 'string' ? Number(n) : n;
  if (!Number.isFinite(numericValue)) {
    return `${prefix}${suffix}`;
  }

  const fixed = numericValue.toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');
  const int = separator ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : intPart;
  return `${prefix}${decPart ? `${int}.${decPart}` : int}${suffix}`;
};

const CountUp = ({
  value,
  from = 0,
  duration = 6500,
  delay = 1,
  decimals = 2,
  prefix = '$',
  suffix = '',
  separator = true,
  style,
  ...rest
}: CountUpProps) => {
  const numericValue = typeof value === 'string' ? Number(value) : value;
  const progress = useSharedValue(from);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(numericValue, {
        duration,
        easing: Easing.out(Easing.cubic), // fast start, long smooth slow-down
      })
    );
  }, [numericValue, duration, delay]);

  const animatedProps = useAnimatedProps(() => {
    const text = formatNumber(progress.value, decimals, separator, prefix, suffix);
    // `text` isn't in TextInput's types, so we cast
    return { text, defaultValue: text } as any;
  });

  // The final value is used as the initial text, so the input is measured at
  // its full width and the growing digits never get clipped.
  const finalText = formatNumber(numericValue, decimals, separator, prefix, suffix);

  return (
    <AnimatedTextInput
      {...rest}
      editable={false}
      defaultValue={finalText}
      animatedProps={animatedProps}
      underlineColorAndroid="transparent"
      style={[{ padding: 0, margin: 0 }, style]}
    />
  );
};

export default CountUp;