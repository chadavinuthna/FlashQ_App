import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/theme';

export default function Button({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'accent' | 'outline' | 'success' | 'danger'
  small = false,
  disabled = false,
  style,
  textStyle
}) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'accent':
        return styles.btnAccent;
      case 'outline':
        return styles.btnOutline;
      case 'success':
        return styles.btnSuccess;
      case 'danger':
        return styles.btnDanger;
      default:
        return styles.btnPrimary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.textOutline;
      default:
        return styles.textWhite;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.btn,
        getVariantStyle(),
        small && styles.btnSmall,
        disabled && styles.btnDisabled,
        style
      ]}
    >
      <Text style={[styles.text, getTextStyle(), small && styles.textSmall, disabled && styles.textDisabled, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  btnSmall: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: 'auto',
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
  },
  btnAccent: {
    backgroundColor: COLORS.accent,
  },
  btnOutline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  btnSuccess: {
    backgroundColor: COLORS.success,
  },
  btnDanger: {
    backgroundColor: COLORS.error,
  },
  btnDisabled: {
    backgroundColor: COLORS.line,
    borderColor: COLORS.line,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'System',
  },
  textSmall: {
    fontSize: 11.5,
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textOutline: {
    color: COLORS.primary,
  },
  textDisabled: {
    color: '#A6A38F',
  }
});
