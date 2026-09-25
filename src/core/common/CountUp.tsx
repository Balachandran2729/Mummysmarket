import React, { useCallback, useEffect, useRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedProps,
  useAnimatedReaction,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { cssInterop } from 'nativewind';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
cssInterop(AnimatedTextInput, { className: 'style' });

const DEFAULT_EASING = Easing.out(Easing.cubic);

interface CountUpProps
  extends Omit<TextInputProps, 'value' | 'defaultValue' | 'editable'> {
  value: number;
  from?: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: boolean;
  easing?: (t: number) => number;
  onFinish?: () => void;
  /**
   * 0 to 1. Fire onFinish when the number is this far along.
   * 1 = wait for the very end (default). 0.98 = fire slightly early,
   * which feels instant because the last few cents are barely visible.
   */
  finishAt?: number;
  className?: string;
}

const formatNumber = (
  n: number,
  decimals: number,
  separator: boolean,
  prefix: string,
  suffix: string
) => {
  'worklet';
  const fixed = n.toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');
  const int = separator
    ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : intPart;
  return `${prefix}${decPart ? `${int}.${decPart}` : int}${suffix}`;
};

const CountUp = ({
  value,
  from = 0,
  duration = 1500,
  delay = 0,
  decimals = 2,
  prefix = '$',
  suffix = '',
  separator = true,
  easing = DEFAULT_EASING,
  onFinish,
  finishAt = 0.95,
  style,
  ...rest
}: CountUpProps) => {
  const progress = useSharedValue(from);
  const startValue = useSharedValue(from);
  const targetValue = useSharedValue(value);
  const hasFired = useSharedValue(false);

  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;
  const handleFinish = useCallback(() => {
    onFinishRef.current?.();
  }, []);

  useEffect(() => {
    startValue.value = progress.value;
    targetValue.value = value;
    hasFired.value = false;

    progress.value = withDelay(
      delay,
      withTiming(value, { duration, easing }, (finished) => {
        // fallback: fires at the very end if it hasn't fired early
        if (finished && !hasFired.value) {
          hasFired.value = true;
          runOnJS(handleFinish)();
        }
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, delay]);

  // Fires onFinish early once the number is `finishAt` of the way there
  useAnimatedReaction(
    () => {
      const total = targetValue.value - startValue.value;
      return total === 0 ? 0 : (progress.value - startValue.value) / total;
    },
    (ratio) => {
      if (finishAt < 1 && !hasFired.value && ratio >= finishAt) {
        hasFired.value = true;
        runOnJS(handleFinish)();
      }
    }
  );

  const animatedProps = useAnimatedProps(() => {
    const text = formatNumber(progress.value, decimals, separator, prefix, suffix);
    return { text, defaultValue: text } as any;
  });

  const finalText = formatNumber(value, decimals, separator, prefix, suffix);

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