import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Chip from '../../components/Chip';
import Icon from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { money } from '../../utils/slotHelper';
import { COLORS } from '../../theme/theme';

export default function AdminDashboardScreen({ onNavigate }) {
  const { logout } = useAuth();
  const { storeOpen, setStoreOpen, products, orders, printOrders, showToast } = useApp();

  const todayOrders = orders.length;
  const printReq = printOrders.filter(o => o.status !== 'Collected').length;
  const revenue = orders.reduce((s, o) => s + o.total, 0) + printOrders.reduce((s, o) => s + o.cost, 0);
  const lowStockItems = products.filter(p => p.stock <= 5);
  const pendingPrints = printOrders.filter(o => o.status !== 'Collected');

  const toggleStore = () => {
    setStoreOpen(!storeOpen);
    showToast(!storeOpen ? 'Store marked Open' : 'Store marked Closed');
  };

  const quickTile = (iconName, label, targetScreen) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.quickTile}
      onPress={() => onNavigate(targetScreen)}
    >
      <View style={styles.quickIcon}>
        <Icon name={iconName} size={22} color={COLORS.primary} />
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topline}>
        <Text style={styles.eyebrow}>Admin</Text>
        <Text style={styles.h1}>Dashboard</Text>
      </View>

      <View style={styles.screenpad}>
        {/* Stat Grid */}
        <View style={styles.statgrid}>
          <Card style={[styles.stat, { borderLeftColor: COLORS.primary }]}>
            <Text style={styles.statNum}>{todayOrders}</Text>
            <Text style={styles.statLbl}>Today's Orders</Text>
          </Card>
          <Card style={[styles.stat, { borderLeftColor: COLORS.accent }]}>
            <Text style={styles.statNum}>{printReq}</Text>
            <Text style={styles.statLbl}>Print Requests</Text>
          </Card>
          <Card style={[styles.stat, { borderLeftColor: COLORS.success }]}>
            <Text style={styles.statNum}>{money(revenue)}</Text>
            <Text style={styles.statLbl}>Revenue</Text>
          </Card>
          <Card style={[styles.stat, lowStockItems.length > 0 && styles.statAlert]}>
            <Text style={[styles.statNum, lowStockItems.length > 0 && { color: COLORS.error }]}>
              {lowStockItems.length}
            </Text>
            <Text style={styles.statLbl}>Low Stock Items</Text>
          </Card>
        </View>

        {/* Store Toggle */}
        <Card style={styles.storeCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Store Status</Text>
            <Chip
              label={storeOpen ? 'Open' : 'Closed'}
              type={storeOpen ? 'success' : 'error'}
            />
          </View>
          <Text style={styles.subText}>
            {storeOpen ? 'Your store is open and accepting orders.' : 'New orders are currently disabled.'}
          </Text>
          <View style={styles.switchWrap}>
            <Switch
              value={storeOpen}
              onValueChange={toggleStore}
              trackColor={{ false: COLORS.line, true: COLORS.success }}
              thumbColor="#FFF"
            />
          </View>
        </Card>

        {/* Quick Actions */}
        <Text style={styles.eyebrow}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          {quickTile('box', 'Manage Inventory', 'inventory')}
          {quickTile('print', 'Print Queue', 'printqueue')}
          {quickTile('plus', 'Add Item', 'inventory')}
          {quickTile('orders', 'View Orders', 'orders')}
        </View>

        {/* Low Stock Alert */}
        <Card>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Low Stock Alert</Text>
            <TouchableOpacity onPress={() => onNavigate('inventory')}>
              <Text style={styles.linkText}>View all</Text>
            </TouchableOpacity>
          </View>
          {lowStockItems.length ? (
            lowStockItems.slice(0, 4).map(p => (
              <View key={p.id} style={styles.listRow}>
                <Text style={styles.rowText}>{p.icon} {p.name}</Text>
                <Text style={[styles.rowBadge, p.stock === 0 ? { color: COLORS.error } : { color: COLORS.accentDark }]}>
                  {p.stock === 0 ? 'Out of Stock' : `Only ${p.stock} left`}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.subText}>All stock levels are healthy.</Text>
          )}
        </Card>

        {/* Recent Orders Preview */}
        <Card>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => onNavigate('orders')}>
              <Text style={styles.linkText}>View all</Text>
            </TouchableOpacity>
          </View>
          {orders.length ? (
            orders.slice(0, 5).map(o => (
              <View key={o.id} style={styles.listRow}>
                <Text style={styles.boldText}>{o.id}</Text>
                <Text style={styles.rowText}>{money(o.total)}</Text>
                <Chip label={o.status} type={o.status === 'Collected' ? 'success' : 'pending'} />
              </View>
            ))
          ) : (
            <Text style={styles.subText}>No orders yet today.</Text>
          )}
        </Card>

        {/* Print Queue Preview */}
        <Card>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Print Queue ({pendingPrints.length})</Text>
            <TouchableOpacity onPress={() => onNavigate('printqueue')}>
              <Text style={styles.linkText}>View all</Text>
            </TouchableOpacity>
          </View>
          {pendingPrints.length ? (
            pendingPrints.slice(0, 4).map(o => (
              <View key={o.id} style={styles.listRow}>
                <Text style={styles.rowText} numberOfLines={1}>
                  {o.files && o.files.length ? o.files[0].name : 'Print Document'}
                </Text>
                <Chip label={o.status} type="pending" />
              </View>
            ))
          ) : (
            <Text style={styles.subText}>No pending print jobs.</Text>
          )}
        </Card>

        <Button
          title="⚙ Settings"
          variant="outline"
          onPress={() => onNavigate('settings')}
          style={{ marginTop: 10 }}
        />
        <Button
          title="Logout"
          variant="danger"
          onPress={logout}
          style={{ marginTop: 10 }}
        />
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
    marginBottom: 8,
  },
  h1: {
    fontWeight: '700',
    fontSize: 23,
    color: COLORS.text,
  },
  screenpad: {
    paddingHorizontal: 20,
  },
  statgrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stat: {
    width: '48%',
    borderLeftWidth: 4,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  statAlert: {
    borderLeftColor: COLORS.error,
  },
  statNum: {
    fontWeight: '700',
    fontSize: 23,
    color: COLORS.text,
  },
  statLbl: {
    fontSize: 10,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    color: COLORS.muted,
    marginTop: 3,
  },
  storeCard: {
    marginBottom: 14,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  subText: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },
  switchWrap: {
    alignItems: 'flex-start',
    marginTop: 10,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  quickTile: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  quickIcon: {
    marginBottom: 8,
  },
  quickLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: COLORS.text,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 12.5,
    fontWeight: '600',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  rowText: {
    fontSize: 12,
    color: COLORS.text,
  },
  boldText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  rowBadge: {
    fontSize: 11,
    fontWeight: '700',
  }
});
