import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Chip from '../../components/Chip';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme/theme';

export default function PrintQueueScreen({ onSelectPrint }) {
  const { printOrders, setPrintOrders, pushNotification, showToast } = useApp();
  const [selectedPrints, setSelectedPrints] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const activeIds = printOrders.filter(o => o.status !== 'Collected' && o.status !== 'Cancelled' && o.status !== 'Not Collected').map(o => o.id);
  const allSelected = activeIds.length > 0 && activeIds.every(id => selectedPrints.includes(id));

  const toggleSelect = (id) => {
    setSelectedPrints(prev => {
      const idx = prev.indexOf(id);
      if (idx === -1) return [...prev, id];
      return prev.filter(x => x !== id);
    });
  };

  const selectAll = () => setSelectedPrints(activeIds);
  const clearSelection = () => setSelectedPrints([]);

  const steps = ['Placed', 'Printing', 'Ready', 'Collected'];
  const getNextStatus = (currentStatus) => {
    const idx = steps.indexOf(currentStatus);
    return idx >= 0 && idx < steps.length - 1 ? steps[idx + 1] : null;
  };

  const selectedItems = printOrders.filter(o => selectedPrints.includes(o.id));
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
    setPrintOrders(prev => prev.map(o => {
      if (selectedPrints.includes(o.id)) {
        const next = getNextStatus(o.status);
        if (next) {
          count++;
          if (next === 'Ready') {
            pushNotification(`Print job ${o.id} is ready for pickup`, '🖨️');
          }
          return { ...o, status: next };
        }
      }
      return o;
    }));
    setSelectedPrints([]);
    setShowConfirmModal(false);
    showToast(`${count} print job(s) updated`);
  };

  const printSummary = (o) => {
    if (!o.files || !o.files.length) return 'Document';
    if (o.files.length === 1) return o.files[0].name;
    return `${o.files.length} files · ${o.totalPages} pages`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Advance</Text>
            <Text style={styles.modalBody}>The selected jobs will move to the next status:</Text>
            {breakdownEntries.map(([status, count]) => (
              <Text key={status} style={styles.breakdownText}>• {count} item(s) → {status}</Text>
            ))}
            <View style={styles.modalActions}>
              <Button title="Cancel" variant="ghost" onPress={() => setShowConfirmModal(false)} />
              <Button title="Confirm" variant="success" onPress={handleConfirmBulkAdvance} />
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.topline}>
        <Text style={styles.eyebrow}>Requests</Text>
        <Text style={styles.h1}>Print Queue</Text>
      </View>

      <View style={styles.screenpad}>
        {activeIds.length > 0 && (
          <View style={styles.rowBetween}>
            <TouchableOpacity onPress={allSelected ? clearSelection : selectAll}>
              <Text style={styles.linkText}>{allSelected ? 'Clear selection' : 'Select all'}</Text>
            </TouchableOpacity>
            {selectedPrints.length > 0 && (
              <Text style={styles.subText}>{selectedPrints.length} selected</Text>
            )}
          </View>
        )}

        {selectedPrints.length > 0 && (
          <Card tint style={styles.bulkCard}>
            <Text style={styles.subText}>{selectedPrints.length} print job(s) selected</Text>
            <Button title="Advance Selected" variant="success" small onPress={() => setShowConfirmModal(true)} />
          </Card>
        )}

        {printOrders.length ? (
          printOrders.map(o => {
            const canSelect = o.status !== 'Collected' && o.status !== 'Cancelled';
            const isSelected = selectedPrints.includes(o.id);
            return (
              <TouchableOpacity
                key={o.id}
                activeOpacity={0.8}
                onPress={() => onSelectPrint(o.id)}
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
                      <Text style={styles.orderSub}>{printSummary(o)} · {o.roll}</Text>
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
            <Text style={{ fontSize: 32, marginBottom: 8 }}>🖨️</Text>
            <Text style={styles.emptyTitle}>No print requests yet</Text>
            <Text style={styles.emptySub}>Print jobs submitted by students will appear here as soon as they come in.</Text>
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
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginBottom: 6,
  },
  modalBody: {
    fontSize: 12.5,
    color: COLORS.muted,
    marginBottom: 10,
  },
  breakdownText: {
    fontSize: 13,
    color: COLORS.text,
    paddingVertical: 2,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 14,
  }
});
