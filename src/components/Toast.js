import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/theme';

export default function Toast({ message }) {
  if (!message) return null;
  return (
    <View style={styles.toast}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 84,
    left: 18,
    right: 18,
    backgroundColor: COLORS.text,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    zIndex: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 8,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '600',
    textAlign: 'center',
  }
});
