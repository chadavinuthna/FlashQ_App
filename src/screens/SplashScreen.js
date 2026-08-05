import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import LogoSVG from '../components/LogoSVG';
import { COLORS } from '../theme/theme';

export default function SplashScreen({ onFinish }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.07,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: false,
    }).start(() => {
      onFinish();
    });
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <LogoSVG size={84} />
      </Animated.View>
      <View style={styles.wordmark}>
        <Text style={styles.wmFlash}>Flash</Text>
        <Text style={styles.wmQ}>Q</Text>
      </View>
      <Text style={styles.tagline}>Check · Book · Collect</Text>
      <View style={styles.barTrack}>
        <Animated.View style={[styles.barFill, { width: progressWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  wordmark: {
    flexDirection: 'row',
    marginTop: 14,
  },
  wmFlash: {
    fontWeight: '800',
    fontSize: 26,
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  wmQ: {
    fontWeight: '800',
    fontSize: 26,
    color: COLORS.accent,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: COLORS.muted,
    marginTop: 4,
  },
  barTrack: {
    width: 120,
    height: 4,
    backgroundColor: COLORS.line,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 20,
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  }
});
