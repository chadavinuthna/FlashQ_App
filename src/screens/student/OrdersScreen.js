import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Chip from '../../components/Chip';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { money } from '../../utils/slotHelper';
import { COLORS } from '../../theme/theme';

export default function OrdersScreen({ onSelectOrder }) {
  const { studentRoll } = useAuth();
  const { orders, printOrders } = useApp();

  const stationery = orders.filter(o => o.roll === studentRoll).map(o => ({ ...o, kind: 'order' }));
  const prints = printOrders.filter(o => o.roll === studentRoll).map(o => ({ ...o, kind: 'print' }));

  const all = [...stationery, ...prints].sort((a, b) => a.status === 'Collected' ? 1 : -1);
  const active = all.filter(o => o.status !== 'Collected');
  const done = all.filter(o => o.status === 'Collected');

  const printSummary = (o) => {
    if (!o.files || !o.files.length) return 'Document';
    if (o.files.length === 1) return o.files[0].name;
    return `${o.files.length} files · ${o.totalPages} pages`;
  };

  const renderStatusChip = (status) => {
    if (status === 'Collected') return <Chip label={status} type="success" />;
    if (status === 'Printing') return <Chip label={status} type="info" />;
    if (status === 'Cancelled') return <Chip label={status} type="error" />;
    return <Chip label={status} type="pending" />;
  };

  const renderOrderRow = (o) => {
    const label = o.kind === 'print' ? 'Print · ' + printSummary(o) : 'Stationery · ' + o.items.length + ' item(s)';
    const total = o.kind === 'print' ? o.cost : o.total;

    return (
      <TouchableOpacity
        key={o.id}
        activeOpacity={0.8}
        onPress={() => onSelectOrder(o.kind, o.id)}
      >
        <Card style={styles.orderCardRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.orderId}>{o.id}{o.emergency ? ' ⚡' : ''}</Text>
            <Text style={styles.orderSub}>{label}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.orderTotal}>{money(total)}</Text>
            {renderStatusChip(o.status)}
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topline}>
        <Text style={styles.eyebrow}>Tracking</Text>
        <Text style={styles.h1}>My Orders</Text>
      </View>

      <View style={styles.screenpad}>
        <Text style={styles.eyebrow}>Active</Text>
        {active.length ? (
          active.map(renderOrderRow)
        ) : (
          <Text style={styles.noOrdersText}>No active orders.</Text>
        )}

        <Text style={[styles.eyebrow, { marginTop: 16 }]}>Completed</Text>
        {done.length ? (
          done.map(renderOrderRow)
        ) : (
          <Text style={styles.noOrdersText}>No completed orders yet.</Text>
        )}
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
  orderCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderId: {
    fontSize: 12.5,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 3,
  },
  orderSub: {
    fontSize: 12,
    color: COLORS.muted,
  },
  orderTotal: {
    fontWeight: '700',
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 4,
  },
  noOrdersText: {
    color: COLORS.muted,
    fontSize: 13,
    marginBottom: 16,
  }
});
