import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../theme/theme';

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  isPassword = false,
  hint,
  disabled = false,
  keyboardType = 'default',
  style,
  inputStyle
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.fieldgroup, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrap}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.muted}
          secureTextEntry={isPassword && !showPassword}
          editable={!disabled}
          keyboardType={keyboardType}
          style={[
            styles.input,
            disabled && styles.disabled,
            isPassword && { paddingRight: 45 },
            inputStyle
          ]}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={{ fontSize: 16 }}>{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldgroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    color: COLORS.muted,
    marginBottom: 7,
  },
  inputWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    fontSize: 13.5,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 12,
    backgroundColor: COLORS.bg,
    color: COLORS.text,
  },
  disabled: {
    opacity: 0.6,
    backgroundColor: '#EAE5D9',
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  hint: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 6,
  }
});
