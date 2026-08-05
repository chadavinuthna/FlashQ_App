import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SHADOWS, RADIUS } from '../theme/theme';

export default function Card({ children, style, tint = false, onPress }) {
  const CardContainer = onPress ? TouchableOpacity : View;
  return (
    <CardContainer
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.card,
        tint && styles.tint,
        SHADOWS.card,
        style
      ]}
    >
      {children}
    </CardContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: RADIUS,
    padding: 20,
    marginBottom: 14,
  },
  tint: {
    backgroundColor: COLORS.primaryLight,
    borderColor: '#D7DEF0',
  }
});
