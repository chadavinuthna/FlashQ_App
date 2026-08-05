import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Chip from '../../components/Chip';
import Icon from '../../components/Icons';
import { useApp } from '../../context/AppContext';
import { money } from '../../utils/slotHelper';
import { COLORS } from '../../theme/theme';

export default function PrintDetailScreen({ printId, onBack }) {
  const { printOrders, setPrintOrders, pushNotification, showToast } = useApp();

  const o = printOrders.find(x => x.id === printId);

  if (!o) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Icon name="back" size={14} color={COLORS.primary} />
          <Text style={styles.backText}>Back to print queue</Text>
        </TouchableOpacity>
        <Text style={styles.notFound}>Print job not found.</Text>
      </View>
    );
  }

  const steps = ['Placed', 'Printing', 'Ready', 'Collected'];
  const idx = steps.indexOf(o.status);
  const nextStep = idx >= 0 ? steps[idx + 1] : null;

  const advancePrint = (next) => {
    setPrintOrders(prev => prev.map(ord => ord.id === o.id ? { ...ord, status: next } : ord));
    if (next === 'Ready') {
      pushNotification(`Print job ${o.id} is ready for pickup`, '🖨️');
    }
    showToast('Print job updated to ' + next);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Icon name="back" size={14} color={COLORS.primary} />
        <Text style={styles.backText}>Back to print queue</Text>
      </TouchableOpacity>

      <Card>
        <View style={styles.ohead}>
          <View>
            <Text style={styles.oid}>{o.id}</Text>
            <Text style={styles.odate}>{o.roll}</Text>
          </View>
          <Chip label={o.status} type={o.status === 'Collected' ? 'success' : 'pending'} />
        </View>

        {o.files.map((f, i) => (
          <View key={i} style={styles.rline}>
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
          <Text style={styles.v}>{o.copies}</Text>
        </View>
        <View style={styles.rline}>
          <Text style={styles.k}>Mode</Text>
          <Text style={styles.v}>{o.color === 'color' ? 'Color' : 'B/W'}, {o.side}</Text>
        </View>

        {o.emergency && (
          <View style={styles.rlineEmergency}>
            <Text style={styles.kEmergency}>⚡ Emergency Pickup Fee (25%)</Text>
            <Text style={styles.vEmergency}>{money(o.emergencyFee)}</Text>
          </View>
        )}

        <View style={styles.rtotal}>
          <Text style={styles.rtotalLabel}>Total</Text>
          <Text style={styles.rtotalAmount}>{money(o.cost)}</Text>
        </View>

        <View style={[styles.rline, { marginTop: 8 }]}>
          <Text style={styles.k}>Pickup Slot</Text>
          <Text style={styles.v}>{o.slot}{o.emergency ? ' ⚡' : ''}</Text>
        </View>
      </Card>

      <Button
        title="⬇ Download PDF"
        variant="outline"
        onPress={() => showToast('PDF downloaded (simulated)')}
        style={{ marginBottom: 10 }}
      />

      {o.status === 'Cancelled' ? (
        <Text style={styles.subText}>This print job was cancelled by the student.</Text>
      ) : nextStep ? (
        <Button
          title={`Mark as ${nextStep}`}
          variant="success"
          onPress={() => advancePrint(nextStep)}
        />
      ) : (
        <Text style={styles.subText}>Collected.</Text>
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
