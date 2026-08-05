import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from '../../components/Icons';
import Card from '../../components/Card';
import Chip from '../../components/Chip';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { suggestSlot } from '../../utils/slotHelper';
import { COLORS } from '../../theme/theme';

export default function HomeScreen({ onNavigate }) {
  const { studentRoll } = useAuth();
  const { storeOpen, slotCapacity, orders, printOrders } = useApp();

  const suggested = suggestSlot(slotCapacity, orders, printOrders);

  const homeTile = (iconName, label, targetScreen) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.tileCard}
      onPress={() => onNavigate(targetScreen)}
    >
      <View style={styles.tileIcon}>
        <Icon name={iconName} size={23} color={COLORS.text} />
      </View>
      <Text style={styles.tileLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topline}>
        <Text style={styles.eyebrow}>Welcome back</Text>
        <Text style={styles.h1}>{studentRoll} 👋</Text>
        <Text style={styles.sub}>What would you like to do today?</Text>
      </View>

      <View style={styles.screenpad}>
        <View style={styles.grid2}>
          {homeTile('box', 'Browse Items', 'products')}
          {homeTile('heart', 'Wishlist', 'wishlist')}
          {homeTile('print', 'Print Documents', 'print')}
          {homeTile('orders', 'My Orders', 'orders')}
          {homeTile('calendar', 'Pickup Slots', 'slots')}
          {homeTile('bell', 'Notifications', 'notifications')}
        </View>

        <View style={styles.rowHeader}>
          <Text style={styles.eyebrowNoMargin}>Recommended Pickup Slot</Text>
          <TouchableOpacity onPress={() => onNavigate('slots')}>
            <Text style={styles.linkText}>View all</Text>
          </TouchableOpacity>
        </View>

        <Card style={styles.slotCard}>
          <View style={styles.slotLeft}>
            <View style={styles.slotIconWrap}>
              <Icon name="calendar" size={18} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.todayText}>Today</Text>
              <Text style={styles.slotTimeText}>{suggested}</Text>
            </View>
          </View>
          <Chip
            label={storeOpen ? 'Available' : 'Store Closed'}
            type={storeOpen ? 'instock' : 'outstock'}
          />
        </Card>

        <TouchableOpacity activeOpacity={0.85} onPress={() => onNavigate('print')}>
          <Card tint style={styles.printPromoCard}>
            <Icon name="print" size={28} color={COLORS.primary} />
            <View style={styles.promoTextWrap}>
              <Text style={styles.promoTitle}>Upload. Print. Pickup.</Text>
              <Text style={styles.promoSub}>Fast, easy & hassle-free!</Text>
            </View>
          </Card>
        </TouchableOpacity>
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
  eyebrowNoMargin: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: COLORS.accentDark,
  },
  h1: {
    fontWeight: '700',
    fontSize: 23,
    color: COLORS.text,
  },
  sub: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  screenpad: {
    paddingHorizontal: 20,
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  tileCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  tileIcon: {
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 12.5,
    fontWeight: '600',
  },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slotLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  slotIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayText: {
    fontWeight: '600',
    fontSize: 13,
    color: COLORS.text,
  },
  slotTimeText: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 2,
  },
  printPromoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  promoTextWrap: {
    flex: 1,
  },
  promoTitle: {
    fontWeight: '700',
    fontSize: 13,
    color: COLORS.text,
  },
  promoSub: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  }
});
