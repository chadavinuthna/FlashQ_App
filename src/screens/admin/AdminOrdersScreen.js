import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Chip from '../../components/Chip';
import { useApp } from '../../context/AppContext';
import { money } from '../../utils/slotHelper';
import { COLORS } from '../../theme/theme';

export default function AdminOrdersScreen({ onSelectOrder }) {
  const { orders, setOrders, pushNotification, showToast } = useApp();
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const [fromDate, setFromDate] = useState(todayStr);
  const [toDate, setToDate] = useState(todayStr);
  const [preset, setPreset] = useState('today');

  const applyPreset = (p) => {
    setPreset(p);
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    if (p === 'today') {
      setFromDate(today);
      setToDate(today);
    } else if (p === '7days') {
      const d = new Date();
      d.setDate(d.getDate() - 6);
      setFromDate(d.toISOString().split('T')[0]);
      setToDate(today);
    } else if (p === 'month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      setFromDate(firstDay);
      setToDate(today);
    } else if (p === 'all') {
      setFromDate('');
      setToDate('');
    }
  };

  const getOrderDateStr = (o) => {
    if (o.createdDate) return o.createdDate;
    if (o.timestamp) return new Date(o.timestamp).toISOString().split('T')[0];
    return todayStr;
  };

  const filteredOrders = orders.filter(o => {
    const d = getOrderDateStr(o);
    if (fromDate && d < fromDate) return false;
    if (toDate && d > toDate) return false;
    return true;
  });

  const activeIds = filteredOrders.filter(o => o.status !== 'Collected' && o.status !== 'Cancelled' && o.status !== 'Not Collected').map(o => o.id);
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

  const steps = ['Accepted', 'Preparing', 'Ready For Pickup', 'Collected'];
  const getNextStatus = (currentStatus) => {
    const idx = steps.indexOf(currentStatus);
    return idx >= 0 && idx < steps.length - 1 ? steps[idx + 1] : null;
  };

  const selectedItems = filteredOrders.filter(o => selectedOrders.includes(o.id));
  const breakdown = {};
  selectedItems.forEach(o => {
    const next = getNextStatus(o.status);
    if (next) {
      breakdown[next] = (breakdown[next] || 0) + 1;
    }
  });
  const breakdownEntries = Object.entries(breakdown);

  const handleConfirmBulkAdvance = () => {
    let count = 0;
    setOrders(prev => prev.map(o => {
      if (selectedOrders.includes(o.id)) {
        const next = getNextStatus(o.status);
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
    setShowConfirmModal(false);
    showToast(`${count} order(s) updated`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topline}>
        <Text style={styles.eyebrow}>History & Orders</Text>
        <Text style={styles.h1}>Order History</Text>
      </View>

      <View style={styles.screenpad}>
        {/* Date Range Filter Card */}
        <Card style={styles.filterCard}>
          <Text style={styles.filterTitle}>📅 Order History Filter</Text>
          <View style={styles.presetRow}>
            <TouchableOpacity style={[styles.presetBtn, preset === 'today' && styles.presetActive]} onPress={() => applyPreset('today')}>
              <Text style={[styles.presetText, preset === 'today' && styles.presetTextActive]}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.presetBtn, preset === '7days' && styles.presetActive]} onPress={() => applyPreset('7days')}>
              <Text style={[styles.presetText, preset === '7days' && styles.presetTextActive]}>Last 7 Days</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.presetBtn, preset === 'month' && styles.presetActive]} onPress={() => applyPreset('month')}>
              <Text style={[styles.presetText, preset === 'month' && styles.presetTextActive]}>This Month</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.presetBtn, preset === 'all' && styles.presetActive]} onPress={() => applyPreset('all')}>
              <Text style={[styles.presetText, preset === 'all' && styles.presetTextActive]}>All Time</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateInputsRow}>
            <View style={{ flex: 1 }}>
              <Input
                label="From Date"
                value={fromDate}
                onChangeText={(v) => { setFromDate(v); setPreset('custom'); }}
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Input
                label="To Date"
                value={toDate}
                onChangeText={(v) => { setToDate(v); setPreset('custom'); }}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </View>

          <View style={styles.statsRow}>
            <Text style={styles.filterSummaryText}>
              Showing <Text style={{ fontWeight: '700' }}>{filteredOrders.length}</Text> order(s) · Revenue: <Text style={{ fontWeight: '700', color: COLORS.primaryDark }}>{money(filteredOrders.filter(o => o.status === 'Collected').reduce((s, o) => s + o.total, 0))}</Text>
            </Text>
          </View>
        </Card>

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
            <Button title="Advance Selected" variant="success" small onPress={() => setShowConfirmModal(true)} />
          </Card>
        )}

        {filteredOrders.length ? (
          filteredOrders.map(o => {
            const canSelect = o.status !== 'Collected' && o.status !== 'Cancelled' && o.status !== 'Not Collected';
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
                    type={o.status === 'Collected' ? 'success' : (o.status === 'Cancelled' || o.status === 'Not Collected') ? 'error' : 'pending'}
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

      {/* Bulk Advance Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>
              Advance {selectedOrders.length} selected {selectedOrders.length === 1 ? 'order' : 'orders'}?
            </Text>
            <Text style={styles.modalSubheading}>
              Resulting status breakdown:
            </Text>
            <View style={styles.breakdownBox}>
              {breakdownEntries.length > 0 ? (
                breakdownEntries.map(([nextStatus, count]) => (
                  <View key={nextStatus} style={styles.breakdownRow}>
                    <Text style={styles.breakdownText}>
                      • {count} {count === 1 ? 'order' : 'orders'} → <Text style={{ fontWeight: '700' }}>{nextStatus}</Text>
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.subText}>No eligible orders to advance.</Text>
              )}
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <Button title="Cancel" variant="outline" onPress={() => setShowConfirmModal(false)} style={{ flex: 1 }} />
              <Button title="Confirm Advance" variant="success" onPress={handleConfirmBulkAdvance} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
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
  filterCard: {
    marginBottom: 14,
    padding: 14,
  },
  filterTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginBottom: 10,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  presetBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  presetActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  presetText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: COLORS.muted,
  },
  presetTextActive: {
    color: '#FFF',
  },
  dateInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statsRow: {
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
  },
  filterSummaryText: {
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  modalHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginBottom: 6,
  },
  modalSubheading: {
    fontSize: 12.5,
    color: COLORS.muted,
    marginBottom: 10,
  },
  breakdownBox: {
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  breakdownRow: {
    paddingVertical: 3,
  },
  breakdownText: {
    fontSize: 13,
    color: COLORS.text,
  }
});
