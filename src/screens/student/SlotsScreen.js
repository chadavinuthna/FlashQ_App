import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Chip from '../../components/Chip';
import Icon from '../../components/Icons';
import { useApp } from '../../context/AppContext';
import { generateSlots, suggestSlot } from '../../utils/slotHelper';
import { COLORS } from '../../theme/theme';

export default function SlotsScreen() {
  const {
    slotCapacity,
    orders,
    printOrders,
    setPreferredSlot,
    setPreferredSlotEmergency,
    showToast
  } = useApp();

  const slots = generateSlots(8, slotCapacity, orders, printOrders);
  const suggested = suggestSlot(slotCapacity, orders, printOrders);

  const handleSelect = (label, wasFull) => {
    setPreferredSlot(label);
    setPreferredSlotEmergency(!!wasFull);
    showToast(wasFull ? 'Emergency slot saved — 25% surcharge will apply' : "Slot saved — we'll use it at your next checkout");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topline}>
        <Text style={styles.eyebrow}>Plan Ahead</Text>
        <Text style={styles.h1}>Pickup Slots</Text>
      </View>

      <View style={styles.screenpad}>
        <Card tint style={styles.bannerCard}>
          <Icon name="star" size={18} color={COLORS.accentDark} />
          <Text style={styles.bannerText}>
            We've suggested the best available slot for you — 10-minute windows, updated live.
          </Text>
        </Card>

        {slots.map(sl => {
          const isRecommended = sl.label === suggested;
          return (
            <Card
              key={sl.label}
              style={[
                styles.slotCard,
                isRecommended && styles.recommendedCard
              ]}
            >
              <View style={{ flex: 1 }}>
                {isRecommended && (
                  <Chip label="⭐ Recommended" type="pending" style={{ marginBottom: 4 }} />
                )}
                <Text style={styles.slotTime}>{sl.label}</Text>
                <Text style={styles.slotSub}>
                  {sl.full ? 'Full — emergency only' : `Available · ${sl.count}/${sl.capacity}`}
                </Text>
              </View>
              <Button
                title={sl.full ? '⚡ Emergency' : 'Select'}
                variant={sl.full ? 'outline' : 'primary'}
                small
                onPress={() => handleSelect(sl.label, sl.full)}
              />
            </Card>
          );
        })}

        <Text style={styles.hint}>
          Slots are auto-confirmed if available — no admin approval needed. Full slots can still be booked as Emergency Pickup for a 25% fee.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bg,
    paddingBottom: 26,
  },
  topline: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 14,
  },
  eyebrow: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: COLORS.accentDark,
    marginBottom: 5,
  },
  h1: {
    fontWeight: '700',
    fontSize: 23,
    color: COLORS.text,
  },
  screenpad: {
    paddingHorizontal: 20,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bannerText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.muted,
  },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recommendedCard: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.pendingBg,
  },
  slotTime: {
    fontWeight: '600',
    fontSize: 14,
    color: COLORS.text,
  },
  slotSub: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  hint: {
    fontSize: 11,
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 8,
  }
});
