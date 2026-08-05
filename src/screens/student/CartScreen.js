import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useApp } from '../../context/AppContext';
import { money } from '../../utils/slotHelper';
import { COLORS } from '../../theme/theme';

export default function CartScreen({ onCheckout, onBrowse }) {
  const { cart, products, changeCartQty, storeOpen } = useApp();

  const items = cart.map(c => ({
    ...products.find(p => p.id === c.id),
    qty: c.qty
  })).filter(i => i.name);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topline}>
        <Text style={styles.eyebrow}>Cart</Text>
        <Text style={styles.h1}>Your Cart</Text>
      </View>

      <View style={styles.screenpad}>
        {items.length ? (
          items.map(i => (
            <Card key={i.id} style={styles.cartRow}>
              <View style={styles.cartLeft}>
                <Text style={styles.cartItemTitle}>{i.icon} {i.name}</Text>
                <Text style={styles.subText}>{money(i.price)} × {i.qty}</Text>
              </View>
              <View style={styles.qtyRow}>
                <Button
                  title="−"
                  variant="outline"
                  small
                  onPress={() => changeCartQty(i.id, -1)}
                />
                <Button
                  title="+"
                  variant="outline"
                  small
                  onPress={() => changeCartQty(i.id, 1)}
                  style={{ marginLeft: 6 }}
                />
              </View>
            </Card>
          ))
        ) : (
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>🛒</Text>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySub}>Browse products and tap the + button to add them here.</Text>
            <Button
              title="Browse Products"
              variant="outline"
              onPress={onBrowse}
              style={{ marginTop: 16 }}
            />
          </View>
        )}

        {items.length > 0 && (
          <View>
            <Card tint style={styles.totalCard}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>{money(total)}</Text>
            </Card>

            {storeOpen ? (
              <Button
                title="Checkout"
                variant="accent"
                onPress={onCheckout}
              />
            ) : (
              <View style={styles.closedNotice}>
                <Text style={styles.closedText}>
                  🔒 Store is currently closed — you can keep browsing and edit your cart, but checkout is disabled until the admin reopens the store.
                </Text>
              </View>
            )}
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
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartLeft: {
    flex: 1,
  },
  cartItemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 3,
  },
  subText: {
    fontSize: 12,
    color: COLORS.muted,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontWeight: '700',
    fontSize: 14,
    color: COLORS.text,
  },
  totalAmount: {
    fontWeight: '800',
    fontSize: 16,
    color: COLORS.primaryDark,
  },
  closedNotice: {
    backgroundColor: COLORS.errorBg,
    borderWidth: 1,
    borderColor: '#E8B4AE',
    borderRadius: 18,
    padding: 12,
  },
  closedText: {
    color: '#A83231',
    fontSize: 12.5,
    fontWeight: '500',
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
