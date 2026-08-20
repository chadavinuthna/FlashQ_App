import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Chip from '../../components/Chip';
import Icon from '../../components/Icons';
import { useApp } from '../../context/AppContext';
import { money, isPickupCutoffPassed } from '../../utils/slotHelper';
import { COLORS } from '../../theme/theme';

export default function OrderDetailScreen({ orderKind, orderId, onBack }) {
  const {
    orders,
    setOrders,
    printOrders,
    setPrintOrders,
    products,
    setProducts,
    pushNotification,
    showToast
  } = useApp();

  const [editingOrder, setEditingOrder] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);

  const isPrint = orderKind === 'print';
  const o = isPrint
    ? printOrders.find(x => x.id === orderId)
    : orders.find(x => x.id === orderId);

  if (!o) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Icon name="back" size={14} color={COLORS.primary} />
          <Text style={styles.backText}>Back to orders</Text>
        </TouchableOpacity>
        <Text style={styles.notFound}>Order not found.</Text>
      </View>
    );
  }

  const stationerySteps = ['Accepted', 'Preparing', 'Ready For Pickup', 'Collected'];
  const printSteps = ['Placed', 'Printing', 'Ready', 'Collected'];
  const steps = isPrint ? printSteps : stationerySteps;
  const curIdx = steps.indexOf(o.status);

  const cutoffPassed = isPickupCutoffPassed(o.slot);
  const isTerminalState = o.status === 'Cancelled' || o.status === 'Collected' || o.status === 'Not Collected';
  const canEdit = !isTerminalState && !cutoffPassed && (isPrint ? o.status === 'Placed' : o.status === 'Accepted');

  const editOrderItemQty = (itemId, delta) => {
    setOrders(prev => prev.map(order => {
      if (order.id === o.id) {
        const item = order.items.find(i => i.id === itemId);
        const prod = products.find(p => p.id === itemId);
        if (!item) return order;

        let newQty = item.qty;
        if (delta > 0) {
          if (prod && prod.stock <= 0) {
            showToast('No more stock available for this item');
            return order;
          }
          newQty++;
          if (prod) {
            setProducts(pList => pList.map(p => p.id === itemId ? { ...p, stock: p.stock - 1 } : p));
          }
        } else {
          newQty--;
          if (prod) {
            setProducts(pList => pList.map(p => p.id === itemId ? { ...p, stock: p.stock + 1 } : p));
          }
        }

        let updatedItems = order.items.map(i => i.id === itemId ? { ...i, qty: newQty } : i).filter(i => i.qty > 0);

        if (updatedItems.length === 0) {
          handleCancelOrder();
          return { ...order, status: 'Cancelled' };
        }

        const baseTotal = updatedItems.reduce((sum, i) => sum + i.price * i.qty, 0);
        const emergencyFee = order.emergency ? Math.round(baseTotal * 0.25) : 0;
        const total = baseTotal + emergencyFee;

        return { ...order, items: updatedItems, baseTotal, emergencyFee, total };
      }
      return order;
    }));
  };

  const editPrintCopies = (delta) => {
    setPrintOrders(prev => prev.map(pOrder => {
      if (pOrder.id === o.id) {
        const newCopies = Math.max(1, pOrder.copies + delta);
        const perPage = pOrder.color === 'color' ? 8 : 2;
        const sideMultiplier = pOrder.side === 'double' ? 0.6 : 1;
        const baseCost = Math.round(perPage * pOrder.totalPages * newCopies * sideMultiplier);
        const emergencyFee = pOrder.emergency ? Math.round(baseCost * 0.25) : 0;
        const cost = baseCost + emergencyFee;

        return { ...pOrder, copies: newCopies, baseCost, emergencyFee, cost };
      }
      return pOrder;
    }));
  };

  const handleCancelOrder = () => {
    if (isPrint) {
      setPrintOrders(prev => prev.map(pOrder => pOrder.id === o.id ? { ...pOrder, status: 'Cancelled' } : pOrder));
      pushNotification(`Print job ${o.id} was cancelled`, '🚫');
    } else {
      // Restore stock
      o.items.forEach(i => {
        setProducts(pList => pList.map(p => p.id === i.id ? { ...p, stock: p.stock + i.qty } : p));
      });
      setOrders(prev => prev.map(ord => ord.id === o.id ? { ...ord, status: 'Cancelled' } : ord));
      pushNotification(`Order ${o.id} was cancelled`, '🚫');
    }
    setCancelConfirm(false);
    setEditingOrder(false);
    showToast('Order cancelled');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Icon name="back" size={14} color={COLORS.primary} />
        <Text style={styles.backText}>Back to orders</Text>
      </TouchableOpacity>

      <Card style={styles.orderCard}>
        <View style={styles.ohead}>
          <View>
            <Text style={styles.oid}>{o.id}</Text>
            <Text style={styles.odate}>{o.createdAt || 'Today'}</Text>
          </View>
          <Chip
            label={o.status}
            type={o.status === 'Collected' ? 'success' : o.status === 'Cancelled' ? 'error' : 'pending'}
          />
        </View>

        {isPrint ? (
          <View>
            {o.files.map((f, idx) => (
              <View key={idx} style={styles.rline}>
                <Text style={styles.k}>{f.name}</Text>
                <Text style={styles.v}>{f.pages} pg</Text>
              </View>
            ))}
            <View style={styles.rline}>
              <Text style={styles.k}>Total Pages</Text>
              <Text style={styles.v}>{o.totalPages}</Text>
            </View>
            <View style={styles.rline}>
              <Text style={styles.k}>Copies</Text>
              {editingOrder && canEdit ? (
                <View style={styles.editQtyWrap}>
                  <Button title="−" variant="outline" small onPress={() => editPrintCopies(-1)} />
                  <Text style={styles.editQtyText}>{o.copies}</Text>
                  <Button title="+" variant="outline" small onPress={() => editPrintCopies(1)} />
                </View>
              ) : (
                <Text style={styles.v}>{o.copies}</Text>
              )}
            </View>
            <View style={styles.rline}>
              <Text style={styles.k}>Mode</Text>
              <Text style={styles.v}>{o.color === 'color' ? 'Color' : 'B/W'}, {o.side}</Text>
            </View>
            <View style={styles.rline}>
              <Text style={styles.k}>Size</Text>
              <Text style={styles.v}>{o.size}</Text>
            </View>
          </View>
        ) : (
          <View>
            {o.items.map((i, idx) => (
              <View key={idx} style={styles.rline}>
                <Text style={styles.k}>{i.name}{editingOrder && canEdit ? '' : ` × ${i.qty}`}</Text>
                {editingOrder && canEdit ? (
                  <View style={styles.editQtyWrap}>
                    <Button title="−" variant="outline" small onPress={() => editOrderItemQty(i.id, -1)} />
                    <Text style={styles.editQtyText}>{i.qty}</Text>
                    <Button title="+" variant="outline" small onPress={() => editOrderItemQty(i.id, 1)} />
                  </View>
                ) : (
                  <Text style={styles.v}>{money(i.price * i.qty)}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {o.emergency && (
          <View style={styles.rlineEmergency}>
            <Text style={styles.kEmergency}>⚡ Emergency Pickup Fee (25%)</Text>
            <Text style={styles.vEmergency}>{money(o.emergencyFee)}</Text>
          </View>
        )}

        <View style={styles.rtotal}>
          <Text style={styles.rtotalLabel}>Total</Text>
          <Text style={styles.rtotalAmount}>{money(isPrint ? o.cost : o.total)}</Text>
        </View>

        <View style={[styles.rline, { marginTop: 8 }]}>
          <Text style={styles.k}>Pickup Slot</Text>
          <Text style={styles.v}>{o.slot}{o.emergency ? ' ⚡' : ''}</Text>
        </View>
      </Card>

      {o.status === 'Cancelled' ? (
        <View style={styles.closedNotice}>
          <Text style={styles.closedText}>🚫 This {isPrint ? 'print job' : 'order'} was cancelled.</Text>
        </View>
      ) : (
        <Card>
          <Text style={styles.eyebrow}>Status</Text>
          <View style={styles.timeline}>
            {steps.map((st, i) => {
              const isDone = i < curIdx;
              const isCurrent = i === curIdx;
              return (
                <View key={st} style={styles.timelineItem}>
                  <View style={[
                    styles.tdot,
                    isDone && styles.tdotDone,
                    isCurrent && styles.tdotCurrent
                  ]} />
                  <Text style={[
                    styles.tt,
                    (isDone || isCurrent) && styles.ttActive
                  ]}>
                    {st}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>
      )}

      {cutoffPassed && !isTerminalState && (
        <View style={styles.closedNotice}>
          <Text style={styles.closedText}>
            🔒 Editing locked — cutoff time (5 minutes before scheduled pickup slot {o.slot}) has passed.
          </Text>
        </View>
      )}

      {canEdit && (
        cancelConfirm ? (
          <View>
            <View style={styles.closedNotice}>
              <Text style={styles.closedText}>
                Cancel this {isPrint ? 'print job' : 'order'}? This can't be undone.
              </Text>
            </View>
            <View style={styles.grid2}>
              <Button title="Keep it" variant="outline" onPress={() => setCancelConfirm(false)} style={{ flex: 1 }} />
              <Button title="Yes, Cancel" variant="danger" onPress={handleCancelOrder} style={{ flex: 1, marginLeft: 8 }} />
            </View>
          </View>
        ) : (
          <View style={styles.grid2}>
            <Button
              title={editingOrder ? 'Done Editing' : (isPrint ? 'Edit Copies' : 'Edit Quantities')}
              variant="outline"
              onPress={() => setEditingOrder(!editingOrder)}
              style={{ flex: 1 }}
            />
            <Button
              title={isPrint ? 'Cancel Print Job' : 'Cancel Order'}
              variant="danger"
              onPress={() => setCancelConfirm(true)}
              style={{ flex: 1, marginLeft: 8 }}
            />
          </View>
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bg,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 26,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 5,
  },
  backText: {
    color: COLORS.primary,
    fontSize: 12.5,
    fontWeight: '600',
  },
  orderCard: {
    marginBottom: 14,
  },
  ohead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  oid: {
    fontWeight: '700',
    fontSize: 14,
    color: COLORS.text,
  },
  odate: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 2,
  },
  rline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  k: {
    color: COLORS.muted,
    fontSize: 12.5,
  },
  v: {
    color: COLORS.text,
    fontSize: 12.5,
    fontWeight: '500',
  },
  rlineEmergency: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  kEmergency: {
    color: COLORS.accentDark,
    fontWeight: '600',
    fontSize: 12.5,
  },
  vEmergency: {
    color: COLORS.accentDark,
    fontWeight: '600',
    fontSize: 12.5,
  },
  rtotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderTopColor: COLORS.line,
  },
  rtotalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  rtotalAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  eyebrow: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: COLORS.accentDark,
    marginBottom: 8,
  },
  timeline: {
    marginTop: 6,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  tdot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: COLORS.line,
  },
  tdotDone: {
    backgroundColor: COLORS.success,
  },
  tdotCurrent: {
    backgroundColor: COLORS.accent,
  },
  tt: {
    fontSize: 12.5,
    color: COLORS.muted,
  },
  ttActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  editQtyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editQtyText: {
    fontSize: 13,
    fontWeight: '600',
  },
  grid2: {
    flexDirection: 'row',
    marginTop: 10,
  },
  closedNotice: {
    backgroundColor: COLORS.errorBg,
    borderWidth: 1,
    borderColor: '#E8B4AE',
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
  },
  closedText: {
    color: '#A83231',
    fontSize: 12.5,
    fontWeight: '500',
  },
  notFound: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 40,
  }
});
