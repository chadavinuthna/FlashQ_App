import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Chip from '../../components/Chip';
import { useApp } from '../../context/AppContext';
import { money } from '../../utils/slotHelper';
import { COLORS } from '../../theme/theme';

export default function AdminOrdersScreen({ onSelectOrder }) {
  const { orders, setOrders, pushNotification, showToast } = useApp();
  const [selectedOrders, setSelectedOrders] = useState([]);

  const activeIds = orders.filter(o => o.status !== 'Collected' && o.status !== 'Cancelled').map(o => o.id);
  const allSelected = activeIds.length > 0 && activeIds.every(id => selectedOrders.includes(id));

  const toggleSelect = (id) => {
    setSelectedOrders(prev => {
      const idx = prev.indexOf(id);
      if (idx === -1) return [...prev, id];
      return prev.filter(x => x !== id);
    });
  };

  const selectAll = () => setSelectedOrders(activeIds);
  const clearSelection = () => setSelectedOrders([]);

  const bulkAdvance = () => {
    const steps = ['Accepted', 'Preparing', 'Ready For Pickup', 'Collected'];
    let count = 0;
    setOrders(prev => prev.map(o => {
      if (selectedOrders.includes(o.id) && o.status !== 'Collected' && o.status !== 'Cancelled') {
        const idx = steps.indexOf(o.status);
        const next = steps[idx + 1];
        if (next) {
          count++;
          if (next === 'Ready For Pickup') {
            pushNotification(`Order ${o.id} is ready for pickup`, '📦');
          }
          return { ...o, status: next };
        }
      }
      return o;
    }));
    setSelectedOrders([]);
    showToast(`${count} order(s) advanced`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topline}>
        <Text style={styles.eyebrow}>Today</Text>
        <Text style={styles.h1}>Orders</Text>
      </View>

      <View style={styles.screenpad}>
        {activeIds.length > 0 && (
          <View style={styles.rowBetween}>
            <TouchableOpacity onPress={allSelected ? clearSelection : selectAll}>
              <Text style={styles.linkText}>{allSelected ? 'Clear selection' : 'Select all'}</Text>
            </TouchableOpacity>
            {selectedOrders.length > 0 && (
              <Text style={styles.subText}>{selectedOrders.length} selected</Text>
            )}
          </View>
        )}

        {selectedOrders.length > 0 && (
          <Card tint style={styles.bulkCard}>
            <Text style={styles.subText}>{selectedOrders.length} order(s) selected</Text>
            <Button title="Advance Selected →" variant="success" small onPress={bulkAdvance} />
          </Card>
        )}

        {orders.length ? (
          orders.map(o => {
            const canSelect = o.status !== 'Collected' && o.status !== 'Cancelled';
            const isSelected = selectedOrders.includes(o.id);
            return (
              <TouchableOpacity
                key={o.id}
                activeOpacity={0.8}
                onPress={() => onSelectOrder(o.id)}
              >
                <Card style={styles.orderRow}>
                  <View style={styles.rowLeft}>
                    {canSelect ? (
                      <TouchableOpacity
                        style={[styles.checkbox, isSelected && styles.checkboxActive]}
                        onPress={() => toggleSelect(o.id)}
                      >
                        {isSelected && <Text style={{ color: '#FFF', fontSize: 10 }}>✓</Text>}
                      </TouchableOpacity>
                    ) : (
                      <View style={{ width: 18 }} />
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.orderId}>{o.id}{o.emergency ? ' ⚡' : ''}</Text>
                      <Text style={styles.orderSub}>{o.roll} · {o.items.length} item(s) · {o.slot}</Text>
                    </View>
                  </View>
                  <Chip
                    label={o.status}
                    type={o.status === 'Collected' ? 'success' : o.status === 'Cancelled' ? 'error' : 'pending'}
                  />
                </Card>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>📓</Text>
            <Text style={styles.emptyTitle}>No orders yet today</Text>
            <Text style={styles.emptySub}>Orders placed by students will show up here in real time.</Text>
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
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 12.5,
    fontWeight: '600',
  },
  subText: {
    fontSize: 12,
    color: COLORS.muted,
  },
  bulkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
  },
  orderId: {
    fontSize: 12.5,
    fontWeight: '600',
    color: COLORS.text,
  },
  orderSub: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 36,
  },
  emptyTitle: {
    fontWeight: '600',
    color: COLORS.text,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 4,
  }
});
