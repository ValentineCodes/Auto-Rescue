import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  cancelAnimation,
} from 'react-native-reanimated';
import {Icon} from 'react-native-elements';

import {styles} from '../styles/reportButton';

export default function ReportButton({reportCrime, isReporting}) {
  const scale = useSharedValue(0.9);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  const animate = () => {
    scale.value = withRepeat(
      withTiming(1, {
        duration: 1500,
      }),
      10000,
      true,
    );
  };

  useEffect(() => {
    animate();

    return () => {
      cancelAnimation(scale);
    };
  }, []);
  return (
    <View style={styles.container}>
      <TouchableOpacity onLongPress={reportCrime} activeOpacity={0.8}>
        <Animated.View style={[styles.button, animatedStyle]}>
          {/* Toggle Loading Indicator */}
          {isReporting ? (
            <ActivityIndicator animating={true} color="white" size="large" />
          ) : (
            <>
              <Icon
                name="radio-outline"
                type="ionicon"
                size={50}
                color="white"
              />
              <Text allowFontScaling={false} style={styles.text}>
                Hold To Report
              </Text>
            </>
          )}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}
