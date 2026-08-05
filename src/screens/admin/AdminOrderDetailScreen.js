import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Chip from '../../components/Chip';
import Icon from '../../components/Icons';
import { useApp } from '../../context/AppContext';
import { money } from '../../utils/slotHelper';
import { COLORS } from '../../theme/theme';

export default function AdminOrderDetailScreen({ orderId, onBack }) {
  const { orders, setOrders, pushNotification, showToast } = useApp();

  const o = orders.find(x => x.id === orderId);

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

  const steps = ['Accepted', 'Preparing', 'Ready For Pickup', 'Collected'];
  const idx = steps.indexOf(o.status);
  const nextStep = idx >= 0 ? steps[idx + 1] : null;

  const advanceOrder = (next) => {
    setOrders(prev => prev.map(ord => ord.id === o.id ? { ...ord, status: next } : ord));
    if (next === 'Ready For Pickup') {
      pushNotification(`Order ${o.id} is ready for pickup`, '📦');
    }
    showToast('Order updated to ' + next);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Icon name="back" size={14} color={COLORS.primary} />
        <Text style={styles.backText}>Back to orders</Text>
      </TouchableOpacity>

      <Card>
        <View style={styles.ohead}>
          <View>
            <Text style={styles.oid}>{o.id}</Text>
            <Text style={styles.odate}>{o.roll}</Text>
          </View>
          <Chip label={o.status} type={o.status === 'Collected' ? 'success' : 'pending'} />
        </View>

        {o.items.map((i, idx) => (
          <View key={idx} style={styles.rline}>
            <Text style={styles.k}>{i.name} × {i.qty}</Text>
            <Text style={styles.v}>{money(i.price * i.qty)}</Text>
          </View>
        ))}

        {o.emergency && (
          <View style={styles.rlineEmergency}>
            <Text style={styles.kEmergency}>⚡ Emergency Pickup Fee (25%)</Text>
            <Text style={styles.vEmergency}>{money(o.emergencyFee)}</Text>
          </View>
        )}

        <View style={styles.rtotal}>
          <Text style={styles.rtotalLabel}>Total</Text>
          <Text style={styles.rtotalAmount}>{money(o.total)}</Text>
        </View>

        <View style={[styles.rline, { marginTop: 8 }]}>
          <Text style={styles.k}>Pickup Slot</Text>
          <Text style={styles.v}>{o.slot}{o.emergency ? ' ⚡' : ''}</Text>
        </View>
      </Card>

      {o.status === 'Cancelled' ? (
        <Text style={styles.subText}>This order was cancelled by the student.</Text>
      ) : nextStep ? (
        <Button
          title={`Mark as ${nextStep}`}
          variant="success"
          onPress={() => advanceOrder(nextStep)}
        />
      ) : (
        <Text style={styles.subText}>Order fully collected.</Text>
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
    marginVertical: 5,
  },
  k: {
    color: COLORS.muted,
    fontSize: 12.5,
  },
  v: {
    color: COLORS.text,
    fontSize: 12.5,
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
  subText: {
    color: COLORS.muted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
  },
  notFound: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 40,
  }
});
