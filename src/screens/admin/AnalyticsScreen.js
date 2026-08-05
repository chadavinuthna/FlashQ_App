import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Chip from '../../components/Chip';
import { useApp } from '../../context/AppContext';
import { money } from '../../utils/slotHelper';
import { COLORS } from '../../theme/theme';

export default function AnalyticsScreen() {
  const { orders, printOrders } = useApp();

  const totalSales = orders.reduce((s, o) => s + o.total, 0) + printOrders.reduce((s, o) => s + o.cost, 0);

  const salesByProduct = {};
  orders.forEach(o => o.items.forEach(i => {
    salesByProduct[i.name] = (salesByProduct[i.name] || 0) + i.qty;
  }));

  const top = Object.entries(salesByProduct).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxTop = Math.max(1, ...top.map(t => t[1]));
  const peakHours = ['9–10am', '12–1pm', '4–5pm'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topline}>
        <Text style={styles.eyebrow}>Insights</Text>
        <Text style={styles.h1}>Analytics</Text>
      </View>

      <View style={styles.screenpad}>
        <View style={styles.statgrid}>
          <Card style={[styles.stat, { borderLeftColor: COLORS.primary }]}>
            <Text style={styles.statNum}>{money(totalSales)}</Text>
            <Text style={styles.statLbl}>Daily Sales</Text>
          </Card>
          <Card style={[styles.stat, { borderLeftColor: COLORS.accent }]}>
            <Text style={styles.statNum}>{orders.length + printOrders.length}</Text>
            <Text style={styles.statLbl}>Total Requests</Text>
          </Card>
        </View>

        <Text style={styles.eyebrow}>Top Products</Text>
        <Card>
          {top.length ? (
            top.map(([name, qty]) => (
              <View key={name} style={styles.barRow}>
                <Text style={styles.blabel} numberOfLines={1}>{name}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${(qty / maxTop) * 100}%` }]} />
                </View>
                <Text style={styles.barNum}>{qty}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.subText}>No sales yet — place a student order to see data.</Text>
          )}
        </Card>

        <Text style={styles.eyebrow}>Peak Pickup Hours</Text>
        <Card style={styles.chipsCard}>
          {peakHours.map(h => (
            <Chip key={h} label={h} type="pending" style={{ marginRight: 6, marginBottom: 6 }} />
          ))}
        </Card>
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
    marginBottom: 8,
  },
  h1: {
    fontWeight: '700',
    fontSize: 23,
    color: COLORS.text,
  },
  screenpad: {
    paddingHorizontal: 20,
  },
  statgrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stat: {
    width: '48%',
    borderLeftWidth: 4,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  statNum: {
    fontWeight: '700',
    fontSize: 23,
    color: COLORS.text,
  },
  statLbl: {
    fontSize: 10,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    color: COLORS.muted,
    marginTop: 3,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  blabel: {
    width: 90,
    color: COLORS.muted,
    fontSize: 10.5,
  },
  barTrack: {
    flex: 1,
    backgroundColor: COLORS.bg,
    borderRadius: 4,
    height: 9,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  barNum: {
    width: 34,
    textAlign: 'right',
    fontSize: 10.5,
    color: COLORS.muted,
  },
  subText: {
    fontSize: 12,
    color: COLORS.muted,
  },
  chipsCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
});
