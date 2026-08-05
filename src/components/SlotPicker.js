import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../theme/theme';

export default function SlotPicker({ slots, currentSlot, onSelectSlot }) {
  return (
    <View style={styles.slotGrid}>
      {slots.map((s) => {
        const isActive = s.label === currentSlot;
        const isFull = s.full;
        return (
          <TouchableOpacity
            key={s.label}
            activeOpacity={0.8}
            style={[
              styles.slotBtn,
              isActive && styles.activeSlot,
              isFull && styles.fullSlot,
            ]}
            onPress={() => onSelectSlot(s.label, isFull)}
          >
            <Text style={[styles.slotLabel, isActive && styles.activeText, isFull && styles.fullText]}>
              {s.label}
            </Text>
            <Text style={[styles.slotCap, isActive && styles.activeCapText, isFull && styles.fullCapText]}>
              {isFull ? '⚡ Full · Emergency' : `${s.count}/${s.capacity}`}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  slotBtn: {
    width: '31%',
    paddingVertical: 9,
    paddingHorizontal: 4,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.line,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    marginBottom: 8,
  },
  activeSlot: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  fullSlot: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.pendingBg,
  },
  slotLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: COLORS.text,
  },
  activeText: {
    color: '#FFFFFF',
  },
  fullText: {
    color: '#8A6415',
  },
  slotCap: {
    fontSize: 9,
    fontWeight: '500',
    color: COLORS.muted,
    marginTop: 2,
  },
  activeCapText: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  fullCapText: {
    color: '#8A6415',
  }
});
