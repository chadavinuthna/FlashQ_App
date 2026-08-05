import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Input from '../../components/Input';
import Chip from '../../components/Chip';
import Icon from '../../components/Icons';
import { useApp } from '../../context/AppContext';
import { money } from '../../utils/slotHelper';
import { COLORS } from '../../theme/theme';

export default function ProductsScreen({ onSelectProduct }) {
  const { products, productFilter, setProductFilter, search, setSearch, addToCart } = useApp();

  const categories = ['All', ...new Set(products.map(p => p.category))];

  let filtered = products;
  if (productFilter !== 'All') {
    filtered = filtered.filter(p => p.category === productFilter);
  }
  if (search) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }

  const renderProductCard = (p) => {
    const low = p.stock > 0 && p.stock <= 5;
    const out = p.stock === 0;

    return (
      <TouchableOpacity
        key={p.id}
        activeOpacity={0.8}
        style={[styles.prodRow, out && styles.outRow]}
        onPress={() => onSelectProduct(p.id)}
      >
        <View style={styles.thumb}>
          <Text style={{ fontSize: 20 }}>{p.icon}</Text>
        </View>
        <View style={styles.midInfo}>
          <Text style={styles.prodName} numberOfLines={1}>{p.name}</Text>
          <Text style={styles.price}>{money(p.price)}</Text>
          <Chip
            label={out ? 'Out of Stock' : low ? `${p.stock} left` : 'In Stock'}
            type={out ? 'outstock' : low ? 'pending' : 'instock'}
          />
        </View>
        <TouchableOpacity
          disabled={out}
          style={[styles.addBtn, out && styles.disabledAddBtn]}
          onPress={() => addToCart(p.id)}
        >
          <Icon name="plus" size={16} color="#FFF" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topline}>
        <Text style={styles.eyebrow}>Shop</Text>
        <Text style={styles.h1}>Products</Text>
      </View>

      <View style={styles.screenpad}>
        <Input
          placeholder="Search products…"
          value={search}
          onChangeText={setSearch}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catbar}>
          {categories.map(c => (
            <TouchableOpacity
              key={c}
              style={[styles.catChip, productFilter === c && styles.activeCatChip]}
              onPress={() => setProductFilter(c)}
            >
              <Text style={[styles.catText, productFilter === c && styles.activeCatText]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filtered.length ? (
          filtered.map(renderProductCard)
        ) : (
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 30, marginBottom: 8 }}>🔍</Text>
            <Text style={styles.emptyTitle}>No products match your search</Text>
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
  catbar: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  catChip: {
    fontSize: 11.5,
    fontWeight: '600',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.card,
    marginRight: 8,
  },
  activeCatChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  catText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: COLORS.muted,
  },
  activeCatText: {
    color: '#FFF',
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
  outRow: {
    opacity: 0.5,
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
  disabledAddBtn: {
    backgroundColor: COLORS.line,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 36,
  },
  emptyTitle: {
    fontWeight: '600',
    color: COLORS.text,
  }
});
