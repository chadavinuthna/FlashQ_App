import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Chip from '../../components/Chip';
import Icon from '../../components/Icons';
import { useApp } from '../../context/AppContext';
import { generateInventoryCSV, parseInventoryCSV } from '../../utils/csvHelper';
import { money } from '../../utils/slotHelper';
import { COLORS } from '../../theme/theme';

export default function InventoryScreen() {
  const { products, setProducts, pushNotification, showToast, nextId } = useApp();

  const [invAdd, setInvAdd] = useState(false);
  const [invEditId, setInvEditId] = useState(null);

  // New product form
  const [npName, setNpName] = useState('');
  const [npCat, setNpCat] = useState('');
  const [npPrice, setNpPrice] = useState('');
  const [npStock, setNpStock] = useState('');

  // Inline edit state
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');

  const handleSaveNew = () => {
    if (!npName.trim()) {
      showToast('Enter a product name');
      return;
    }
    const newProd = {
      id: nextId('p'),
      name: npName.trim(),
      category: npCat.trim() || 'Stationery',
      price: parseFloat(npPrice) || 0,
      stock: parseInt(npStock, 10) || 0,
      icon: '🗂️',
      waitlist: []
    };
    setProducts(prev => [...prev, newProd]);
    setInvAdd(false);
    setNpName('');
    setNpCat('');
    setNpPrice('');
    setNpStock('');
    showToast('Product added');
  };

  const startEdit = (p) => {
    setInvEditId(p.id);
    setEditPrice(String(p.price));
    setEditStock(String(p.stock));
  };

  const handleSaveEdit = (id) => {
    const newP = parseFloat(editPrice);
    const newS = parseInt(editStock, 10);

    if (editPrice.trim() === '' || isNaN(newP) || newP < 0) {
      showToast('Please enter a valid non-negative price');
      return;
    }

    if (editStock.trim() === '' || isNaN(newS) || newS < 0) {
      showToast('Please enter a valid non-negative stock quantity');
      return;
    }

    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const prevStock = p.stock;

        if (prevStock === 0 && newS > 0 && p.waitlist && p.waitlist.length) {
          pushNotification(`Good news! ${p.name} is back in stock`, '🔔');
        }

        return {
          ...p,
          price: newP,
          stock: newS,
          waitlist: prevStock === 0 && newS > 0 ? [] : p.waitlist
        };
      }
      return p;
    }));
    setInvEditId(null);
    showToast('Product updated');
  };

  const handleDelete = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product removed');
  };

  const handleExportCSV = () => {
    try {
      const csvContent = generateInventoryCSV(products);
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'flashq-inventory.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('Inventory exported successfully');
      } else {
        showToast('CSV generated successfully');
      }
    } catch (err) {
      showToast('Error exporting CSV');
    }
  };

  const processCSVText = (text) => {
    if (!text || !text.trim()) {
      showToast('Selected file is empty');
      return;
    }
    const items = parseInventoryCSV(text);
    if (!items || items.length === 0) {
      showToast('No valid product rows found in CSV');
      return;
    }

    setProducts(prevProducts => {
      let added = 0;
      let updated = 0;
      let updatedList = [...prevProducts];

      items.forEach(item => {
        const existingIndex = updatedList.findIndex(
          p => p.name.trim().toLowerCase() === item.name.trim().toLowerCase()
        );
        if (existingIndex !== -1) {
          updatedList[existingIndex] = {
            ...updatedList[existingIndex],
            category: item.category || updatedList[existingIndex].category,
            price: item.price,
            stock: item.stock
          };
          updated++;
        } else {
          updatedList.push({
            id: nextId('p'),
            name: item.name,
            category: item.category || 'Stationery',
            price: item.price,
            stock: item.stock,
            icon: item.icon || '🗂️',
            waitlist: []
          });
          added++;
        }
      });
      showToast(`Imported: ${added} added, ${updated} updated`);
      return updatedList;
    });
  };

  const handleImportCSV = async () => {
    try {
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv,text/csv,text/comma-separated-values';
        input.onchange = (e) => {
          const file = e.target.files && e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (event) => {
            processCSVText(event.target.result);
          };
          reader.onerror = () => showToast('Could not read CSV file');
          reader.readAsText(file);
        };
        input.click();
        return;
      }

      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'text/comma-separated-values', '*/*'],
        copyToCacheDirectory: true
      });

      if (result.canceled) return;
      const asset = result.assets ? result.assets[0] : result;
      if (asset && asset.uri) {
        const response = await fetch(asset.uri);
        const text = await response.text();
        processCSVText(text);
      }
    } catch (err) {
      showToast('Error opening CSV file');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topline}>
        <Text style={styles.eyebrow}>Manage</Text>
        <Text style={styles.h1}>Inventory</Text>
      </View>

      <View style={styles.screenpad}>
        <Button
          title={invAdd ? 'Cancel' : '+ Add Product'}
          variant="primary"
          onPress={() => setInvAdd(!invAdd)}
          style={{ marginBottom: 10 }}
        />

        <View style={styles.grid2}>
          <Button
            title="⬇ Export CSV"
            variant="outline"
            onPress={handleExportCSV}
            style={{ flex: 1 }}
          />
          <Button
            title="⬆ Import CSV"
            variant="outline"
            onPress={handleImportCSV}
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>

        {invAdd && (
          <Card>
            <Input label="Name" placeholder="Product name" value={npName} onChangeText={setNpName} />
            <Input label="Category" placeholder="Category" value={npCat} onChangeText={setNpCat} />
            <View style={styles.grid2}>
              <View style={{ flex: 1 }}>
                <Input label="Price (₹)" placeholder="0" value={npPrice} onChangeText={setNpPrice} keyboardType="numeric" />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Input label="Stock" placeholder="0" value={npStock} onChangeText={setNpStock} keyboardType="numeric" />
              </View>
            </View>
            <Button title="Save Product" variant="success" onPress={handleSaveNew} />
          </Card>
        )}

        <Card style={{ paddingHorizontal: 12 }}>
          {products.map(p => {
            const isEditing = invEditId === p.id;
            return (
              <View key={p.id} style={styles.tableRow}>
                <View style={{ flex: 2 }}>
                  <Text style={styles.prodTitle} numberOfLines={1}>{p.icon} {p.name}</Text>
                  <Text style={styles.prodCat}>{p.category}</Text>
                </View>

                {isEditing ? (
                  <View style={styles.editRow}>
                    <Input
                      value={editPrice}
                      onChangeText={setEditPrice}
                      keyboardType="numeric"
                      style={{ width: 55, marginBottom: 0 }}
                      inputStyle={{ paddingVertical: 4, paddingHorizontal: 6 }}
                    />
                    <Input
                      value={editStock}
                      onChangeText={setEditStock}
                      keyboardType="numeric"
                      style={{ width: 50, marginBottom: 0, marginLeft: 6 }}
                      inputStyle={{ paddingVertical: 4, paddingHorizontal: 6 }}
                    />
                    <Button title="Save" variant="success" small onPress={() => handleSaveEdit(p.id)} style={{ marginLeft: 6 }} />
                  </View>
                ) : (
                  <View style={styles.viewRow}>
                    <Text style={styles.priceText}>{money(p.price)}</Text>
                    <Chip
                      label={p.stock === 0 ? 'Out' : String(p.stock)}
                      type={p.stock === 0 ? 'outstock' : p.stock <= 5 ? 'pending' : 'instock'}
                      style={{ marginLeft: 8 }}
                    />
                    <TouchableOpacity onPress={() => startEdit(p)} style={styles.actionBtn}>
                      <Text style={styles.actionText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(p.id)} style={styles.actionBtn}>
                      <Text style={[styles.actionText, { color: COLORS.error }]}>Del</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </Card>
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
  grid2: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  prodTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  prodCat: {
    fontSize: 10.5,
    color: COLORS.muted,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  actionBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginLeft: 6,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  }
});
