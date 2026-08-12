import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Chip from '../../components/Chip';
import Icon from '../../components/Icons';
import { useApp } from '../../context/AppContext';
import { generateSlots, generateSlotsAround, suggestSlot, timeStringToDateToday } from '../../utils/slotHelper';
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

  const [prefTimeInput, setPrefTimeInput] = useState('');
  const [customSlots, setCustomSlots] = useState(null);

  const defaultSlots = generateSlots(8, slotCapacity, orders, printOrders);
  const slots = customSlots || defaultSlots;
  const suggested = suggestSlot(slotCapacity, orders, printOrders);

  const handleSelect = (label, wasFull) => {
    setPreferredSlot(label);
    setPreferredSlotEmergency(!!wasFull);
    showToast(wasFull ? 'Emergency slot saved — 25% surcharge will apply' : "Slot saved — we'll use it at your next checkout");
  };

  const handleFindNearby = () => {
    if (!prefTimeInput.trim()) {
      showToast('Enter your preferred time (e.g. 16:00 or 4:00 PM)');
      return;
    }
    const centerDate = timeStringToDateToday(prefTimeInput);
    const nearby = generateSlotsAround(centerDate, 7, slotCapacity, orders, printOrders);
    if (centerDate.getTime() < Date.now()) {
      showToast('That time has passed — showing nearest upcoming slots');
    } else {
      showToast(`Showing slots around ${prefTimeInput}`);
    }
    setCustomSlots(nearby);
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

        {/* Preferred Time Search Card */}
        <Card style={{ marginBottom: 14 }}>
          <Text style={styles.eyebrow}>Preferred Pickup Time</Text>
          <Text style={styles.subHint}>Enter a time to see closest available pickup slots:</Text>
          <View style={styles.prefSearchRow}>
            <View style={{ flex: 1 }}>
              <Input
                placeholder="e.g. 16:00 or 4:00 PM"
                value={prefTimeInput}
                onChangeText={setPrefTimeInput}
                style={{ marginBottom: 0 }}
              />
            </View>
            <Button
              title="Find Nearby"
              variant="primary"
              small
              onPress={handleFindNearby}
              style={{ marginLeft: 8 }}
            />
          </View>
          {customSlots && (
            <TouchableOpacity onPress={() => { setCustomSlots(null); setPrefTimeInput(''); }} style={{ alignSelf: 'flex-end', marginTop: 8 }}>
              <Text style={styles.linkText}>Reset to default slots</Text>
            </TouchableOpacity>
          )}
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
  },
  subHint: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 8,
  },
  prefSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  }
});
