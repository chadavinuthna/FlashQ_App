import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/theme';

export default function Chip({ label, type = 'info', style, textStyle }) {
  const getStyle = () => {
    if (label === 'Not Collected' || label === 'Cancelled') {
      return { bg: COLORS.errorBg, text: '#A83231' };
    }
    switch (type) {
      case 'success':
      case 'instock':
        return { bg: COLORS.successBg, text: '#1F6B44' };
      case 'error':
      case 'outstock':
        return { bg: COLORS.errorBg, text: '#A83231' };
      case 'pending':
        return { bg: COLORS.pendingBg, text: '#8A6415' };
      case 'info':
      default:
        return { bg: COLORS.infoBg, text: COLORS.primary };
    }
  };

  const colors = getStyle();

  return (
    <View style={[styles.chip, { backgroundColor: colors.bg }, style]}>
      <Text style={[styles.text, { color: colors.text }, textStyle]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  }
});
