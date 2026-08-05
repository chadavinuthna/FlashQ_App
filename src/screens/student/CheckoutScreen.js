import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import SlotPicker from '../../components/SlotPicker';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  suggestSlot,
  generateSlots,
  generateSlotsAround,
  timeStringToDateToday,
  money
} from '../../utils/slotHelper';
import { COLORS } from '../../theme/theme';

export default function CheckoutScreen({ onOrderConfirmed, onBackToCart }) {
  const { studentRoll } = useAuth();
  const {
    cart,
    setCart,
    products,
    setProducts,
    orders,
    setOrders,
    printOrders,
    storeOpen,
    slotCapacity,
    preferredSlot,
    preferredSlotEmergency,
    pushNotification,
    showToast,
    nextId
  } = useApp();

  const [checkoutSlot, setCheckoutSlot] = useState(
    preferredSlot || suggestSlot(slotCapacity, orders, printOrders)
  );
  const [checkoutEmergency, setCheckoutEmergency] = useState(
    preferredSlot ? !!preferredSlotEmergency : false
  );
  const [slotPickerOpen, setSlotPickerOpen] = useState(false);
  const [customSlots, setCustomSlots] = useState(null);
  const [prefTime, setPrefTime] = useState('');

  if (!storeOpen) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyWrap}>
          <Text style={{ fontSize: 32 }}>🔒</Text>
          <Text style={styles.emptyTitle}>Store Currently Closed</Text>
          <Text style={styles.emptySub}>The admin has closed new orders. Please check back later.</Text>
          <Button title="Back to Cart" variant="outline" onPress={onBackToCart} style={{ marginTop: 16 }} />
        </View>
      </View>
    );
  }

  const items = cart
    .map(c => ({ ...products.find(p => p.id === c.id), qty: c.qty }))
    .filter(i => i.name);

  const base = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const emergencyFee = checkoutEmergency ? Math.round(base * 0.25) : 0;
  const grandTotal = base + emergencyFee;

  const slotsToShow = customSlots || generateSlots(9, slotCapacity, orders, printOrders);

  const handleSelectSlot = (label, wasFull) => {
    setCheckoutSlot(label);
    setCheckoutEmergency(!!wasFull);
    if (wasFull) {
      showToast('Emergency pickup selected — 25% surcharge applies');
    }
  };

  const handleFindNearby = () => {
    if (!prefTime) {
      showToast('Pick a preferred time first (HH:MM)');
      return;
    }
    const center = timeStringToDateToday(prefTime);
    const slots = generateSlotsAround(center, 7, slotCapacity, orders, printOrders);
    if (center.getTime() < Date.now()) {
      showToast('That time has passed — showing nearest upcoming slots');
    }
    setCustomSlots(slots);
  };

  const handleConfirmOrder = () => {
    // Deduct stock
    setProducts(prev => prev.map(p => {
      const c = cart.find(x => x.id === p.id);
      if (c) {
        return { ...p, stock: Math.max(0, p.stock - c.qty) };
      }
      return p;
    }));

    const newOrder = {
      id: nextId('ORD'),
      roll: studentRoll,
      type: 'Stationery',
      items,
      baseTotal: base,
      emergencyFee,
      emergency: checkoutEmergency,
      total: grandTotal,
      slot: checkoutSlot,
      status: 'Accepted',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setOrders(prev => [newOrder, ...prev]);
    pushNotification(`Order ${newOrder.id} confirmed — pickup ${newOrder.slot}`, '✅');
    setCart([]);

    onOrderConfirmed(newOrder.id);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topline}>
        <Text style={styles.eyebrow}>Checkout</Text>
        <Text style={styles.h1}>Confirm Order</Text>
      </View>

      <View style={styles.screenpad}>
        <Card>
          <Text style={styles.eyebrow}>Order Summary</Text>
          {items.map(i => (
            <View key={i.id} style={styles.rline}>
              <Text style={styles.k}>{i.name} × {i.qty}</Text>
              <Text style={styles.v}>{money(i.price * i.qty)}</Text>
            </View>
          ))}
          {emergencyFee > 0 && (
            <View style={styles.rlineEmergency}>
              <Text style={styles.kEmergency}>⚡ Emergency Pickup Fee (25%)</Text>
              <Text style={styles.vEmergency}>{money(emergencyFee)}</Text>
            </View>
          )}
          <View style={styles.rtotal}>
            <Text style={styles.rtotalLabel}>Total</Text>
            <Text style={styles.rtotalAmount}>{money(grandTotal)}</Text>
          </View>
        </Card>

        <Card tint>
          <Text style={styles.eyebrow}>⭐ Smart Pickup Slot</Text>
          <Text style={styles.sub}>Best available 10-minute slot based on current bookings & capacity:</Text>
          <Text style={styles.slotTitle}>{checkoutSlot}</Text>
          {checkoutEmergency && (
            <View style={styles.emergencyBanner}>
              <Text style={styles.bannerText}>⚡ Emergency pickup selected — 25% surcharge applied</Text>
            </View>
          )}
          <Text style={styles.autoHint}>Auto-reserved — no admin approval needed while store is open.</Text>

          <TouchableOpacity onPress={() => setSlotPickerOpen(!slotPickerOpen)} style={{ marginTop: 10 }}>
            <Text style={styles.linkText}>
              {slotPickerOpen ? 'Hide slot options' : "Don't like this slot? Choose another"}
            </Text>
          </TouchableOpacity>

          {slotPickerOpen && (
            <View style={{ marginTop: 10 }}>
              <View style={styles.prefRow}>
                <View style={{ flex: 1 }}>
                  <Input
                    placeholder="e.g. 14:30"
                    value={prefTime}
                    onChangeText={setPrefTime}
                    style={{ marginBottom: 0 }}
                  />
                </View>
                <Button
                  title="Find Nearby"
                  variant="outline"
                  small
                  onPress={handleFindNearby}
                  style={{ marginLeft: 8 }}
                />
              </View>

              {customSlots && (
                <TouchableOpacity onPress={() => setCustomSlots(null)} style={{ alignSelf: 'flex-end', marginTop: 4 }}>
                  <Text style={styles.linkText}>Reset to suggested</Text>
                </TouchableOpacity>
              )}

              <SlotPicker
                slots={slotsToShow}
                currentSlot={checkoutSlot}
                onSelectSlot={handleSelectSlot}
              />
            </View>
          )}
        </Card>

        <Button title="Confirm Order" variant="accent" onPress={handleConfirmOrder} />
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
  sub: {
    color: COLORS.muted,
    fontSize: 12,
    marginBottom: 8,
  },
  slotTitle: {
    fontSize: 20,
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  emergencyBanner: {
    backgroundColor: COLORS.pendingBg,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 8,
  },
  bannerText: {
    color: '#8A6415',
    fontSize: 11.5,
    fontWeight: '600',
  },
  autoHint: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 6,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 12.5,
    fontWeight: '600',
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 4,
  }
});
