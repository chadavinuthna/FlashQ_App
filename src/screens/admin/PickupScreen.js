import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme/theme';

export default function PickupScreen() {
  const { students, orders, setOrders, printOrders, setPrintOrders, pushNotification, showToast } = useApp();

  const [pickupQuery, setPickupQuery] = useState('');

  const q = pickupQuery.trim();
  const matchRoll = q
    ? Object.keys(students).find(r => r.toLowerCase().includes(q.toLowerCase()) || r.toLowerCase().endsWith(q.toLowerCase()))
    : null;

  const stu = matchRoll ? students[matchRoll] : null;

  const readyOrders = matchRoll ? orders.filter(o => o.roll === matchRoll && o.status === 'Ready For Pickup') : [];
  const readyPrints = matchRoll ? printOrders.filter(o => o.roll === matchRoll && o.status === 'Ready') : [];
  const allReady = [
    ...readyOrders.map(o => ({ ...o, kind: 'order' })),
    ...readyPrints.map(o => ({ ...o, kind: 'print' }))
  ];

  const markCollected = (kind, id) => {
    if (kind === 'print') {
      setPrintOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Collected' } : o));
    } else {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Collected' } : o));
    }
    pushNotification(`${id} collected — thank you!`, '✅');
    showToast('Marked as collected');
  };

  const printSummary = (o) => {
    if (!o.files || !o.files.length) return 'Document';
    if (o.files.length === 1) return o.files[0].name;
    return `${o.files.length} files · ${o.totalPages} pages`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topline}>
        <Text style={styles.eyebrow}>Verify</Text>
        <Text style={styles.h1}>Pickup Verification</Text>
      </View>

      <View style={styles.screenpad}>
        <Input
          placeholder="Search roll number (e.g. 0501, A0501)"
          value={pickupQuery}
          onChangeText={setPickupQuery}
        />

        {matchRoll ? (
          <Card>
            <Text style={styles.studentName}>{stu?.name || 'Student'}</Text>
            <Text style={styles.studentRoll}>{matchRoll}</Text>

            {allReady.length ? (
              allReady.map(o => (
                <View key={o.id} style={styles.readyRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.orderId}>{o.id}{o.emergency ? ' ⚡' : ''}</Text>
                    <Text style={styles.orderSub}>
                      {o.kind === 'print' ? printSummary(o) : o.items.length + ' item(s)'}
                    </Text>
                  </View>
                  <Button
                    title="Mark Collected"
                    variant="success"
                    small
                    onPress={() => markCollected(o.kind, o.id)}
                  />
                </View>
              ))
            ) : (
              <Text style={styles.subText}>No items ready for pickup right now.</Text>
            )}
          </Card>
        ) : q ? (
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 30, marginBottom: 8 }}>🔎</Text>
            <Text style={styles.emptyTitle}>No matching student</Text>
          </View>
        ) : (
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 30, marginBottom: 8 }}>🎫</Text>
            <Text style={styles.emptyTitle}>Search a roll number to view pending pickups</Text>
          </View>
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
  studentName: {
    fontWeight: '700',
    fontSize: 14,
    color: COLORS.text,
  },
  studentRoll: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 10,
  },
  readyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  orderId: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  orderSub: {
    fontSize: 11,
    color: COLORS.muted,
  },
  subText: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 36,
  },
  emptyTitle: {
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  }
});
