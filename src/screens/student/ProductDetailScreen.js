import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Chip from '../../components/Chip';
import Icon from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { money } from '../../utils/slotHelper';
import { COLORS } from '../../theme/theme';

export default function ProductDetailScreen({ productId, onBack }) {
  const { studentRoll } = useAuth();
  const { products, addToCart, toggleWaitlist } = useApp();

  const p = products.find(x => x.id === productId);

  if (!p) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Icon name="back" size={14} color={COLORS.primary} />
          <Text style={styles.backText}>Back to products</Text>
        </TouchableOpacity>
        <Text style={styles.notFound}>Product not found.</Text>
      </View>
    );
  }

  const out = p.stock === 0;
  const onWaitlist = p.waitlist && p.waitlist.includes(studentRoll);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Icon name="back" size={14} color={COLORS.primary} />
        <Text style={styles.backText}>Back to products</Text>
      </TouchableOpacity>

      <Card>
        <View style={styles.imageWrap}>
          <Text style={{ fontSize: 42 }}>{p.icon}</Text>
        </View>
        <Text style={styles.eyebrow}>{p.category}</Text>
        <Text style={styles.h1}>{p.name}</Text>
        <Text style={styles.price}>{money(p.price)}</Text>
        <Chip
          label={out ? 'Out of Stock' : `${p.stock} in stock`}
          type={out ? 'outstock' : 'instock'}
        />

        <Button
          title={out ? 'Out of Stock' : 'Add to Cart'}
          variant={out ? 'outline' : 'primary'}
          disabled={out}
          style={{ marginTop: 16 }}
          onPress={() => addToCart(p.id)}
        />

        {out && (
          <Button
            title={onWaitlist ? '🔔 We will notify you — tap to cancel' : '🔔 Notify Me When Back In Stock'}
            variant={onWaitlist ? 'success' : 'outline'}
            style={{ marginTop: 10 }}
            onPress={() => toggleWaitlist(p.id, studentRoll)}
          />
        )}
      </Card>
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
  imageWrap: {
    height: 110,
    borderRadius: 10,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: COLORS.accentDark,
    marginTop: 12,
  },
  h1: {
    fontWeight: '700',
    fontSize: 18,
    color: COLORS.text,
    marginTop: 2,
  },
  price: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginVertical: 8,
  },
  notFound: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 40,
  }
});
