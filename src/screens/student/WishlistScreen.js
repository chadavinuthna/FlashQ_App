import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Button from '../../components/Button';
import Chip from '../../components/Chip';
import Icon from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { money } from '../../utils/slotHelper';
import { COLORS } from '../../theme/theme';

export default function WishlistScreen({ onSelectProduct, onBrowseMore }) {
  const { studentRoll } = useAuth();
  const { products, addToCart, toggleWaitlist } = useApp();

  const items = products.filter(p => p.waitlist && p.waitlist.includes(studentRoll));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topline}>
        <Text style={styles.eyebrow}>Saved</Text>
        <Text style={styles.h1}>Wishlist</Text>
      </View>

      <View style={styles.screenpad}>
        {items.length ? (
          items.map(p => {
            const out = p.stock === 0;
            return (
              <TouchableOpacity
                key={p.id}
                activeOpacity={0.8}
                style={styles.prodRow}
                onPress={() => onSelectProduct(p.id)}
              >
                <View style={styles.thumb}>
                  <Text style={{ fontSize: 20 }}>{p.icon}</Text>
                </View>
                <View style={styles.midInfo}>
                  <Text style={styles.prodName} numberOfLines={1}>{p.name}</Text>
                  <Text style={styles.price}>{money(p.price)}</Text>
                  <Chip
                    label={out ? 'Still Out of Stock' : 'Back in Stock!'}
                    type={out ? 'outstock' : 'instock'}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.addBtn, out && styles.outBtn]}
                  onPress={() => out ? toggleWaitlist(p.id, studentRoll) : addToCart(p.id)}
                >
                  <Icon name={out ? 'plus' : 'cart'} size={16} color="#FFF" />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>💖</Text>
            <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
            <Text style={styles.emptySub}>Tap "Notify Me When Back In Stock" on any out-of-stock item to save it here.</Text>
          </View>
        )}

        {items.length > 0 && (
          <Button
            title="Browse More Items"
            variant="outline"
            onPress={onBrowseMore}
            style={{ marginTop: 10 }}
          />
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
  prodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 16,
    padding: 12,
    marginBottom: 11,
  },
  thumb: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  midInfo: {
    flex: 1,
  },
  prodName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 3,
  },
  price: {
    fontWeight: '700',
    color: COLORS.primaryDark,
    fontSize: 12.5,
    marginBottom: 4,
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outBtn: {
    backgroundColor: COLORS.error,
    transform: [{ rotate: '45deg' }]
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
