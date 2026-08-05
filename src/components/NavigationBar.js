import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LogoSVG from './LogoSVG';
import Icon from './Icons';
import { COLORS, SHADOWS } from '../theme/theme';

export function HeaderRoleBar({
  role,
  isLoggedIn,
  cartCount,
  onOpenCart,
  showBack,
  onGoBack
}) {
  return (
    <View style={styles.roleBar}>
      <View style={styles.brandRow}>
        {showBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onGoBack}>
            <Icon name="back" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        <View style={styles.logoMini}>
          <LogoSVG size={26} />
        </View>
        <Text style={styles.brandText}>FlashQ</Text>
      </View>
      <View style={styles.roleRight}>
        {role === 'student' && isLoggedIn && (
          <TouchableOpacity style={styles.cartBtn} onPress={onOpenCart}>
            <Icon name="cart" size={20} color={COLORS.primary} />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        {role === 'admin' && isLoggedIn && (
          <View style={styles.adminChip}>
            <Text style={styles.adminChipText}>Admin</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export function BottomTabBar({ role, currentScreen, onSelectTab }) {
  if (role === 'student') {
    return (
      <View style={[styles.navTabs, SHADOWS.nav]}>
        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => onSelectTab('home')}
        >
          <View style={[styles.icWrap, currentScreen === 'home' && styles.icActive]}>
            <Icon name="home" size={19} color={currentScreen === 'home' ? '#FFF' : 'rgba(255,255,255,0.5)'} />
          </View>
          <Text style={[styles.tabLabel, currentScreen === 'home' && styles.labelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, styles.raisedTab]}
          onPress={() => onSelectTab('print')}
        >
          <View style={[styles.raisedIc, SHADOWS.raised]}>
            <Icon name="print" size={22} color="#FFF" />
          </View>
          <Text style={[styles.tabLabel, styles.raisedLabel]}>Print</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => onSelectTab('profile')}
        >
          <View style={[styles.icWrap, currentScreen === 'profile' && styles.icActive]}>
            <Icon name="user" size={19} color={currentScreen === 'profile' ? '#FFF' : 'rgba(255,255,255,0.5)'} />
          </View>
          <Text style={[styles.tabLabel, currentScreen === 'profile' && styles.labelActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Admin bottom tab bar
  const adminTabs = [
    { id: 'dashboard', icon: 'dashboard', label: 'Home' },
    { id: 'inventory', icon: 'box', label: 'Stock' },
    { id: 'orders', icon: 'orders', label: 'Orders' },
    { id: 'printqueue', icon: 'print', label: 'Print' },
    { id: 'pickup', icon: 'search', label: 'Pickup' },
    { id: 'analytics', icon: 'stats', label: 'Stats' },
  ];

  return (
    <View style={[styles.navTabs, SHADOWS.nav]}>
      {adminTabs.map((t) => {
        const isActive = currentScreen === t.id;
        return (
          <TouchableOpacity
            key={t.id}
            style={styles.tabBtn}
            onPress={() => onSelectTab(t.id)}
          >
            <View style={[styles.icWrap, isActive && styles.icActive]}>
              <Icon name={t.icon} size={19} color={isActive ? '#FFF' : 'rgba(255,255,255,0.5)'} />
            </View>
            <Text style={[styles.tabLabel, isActive && styles.labelActive]}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  roleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  logoMini: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontWeight: '700',
    fontSize: 16.5,
    color: COLORS.primary,
  },
  backBtn: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    padding: 7,
    marginRight: 2,
  },
  roleRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBtn: {
    position: 'relative',
    backgroundColor: COLORS.primaryLight,
    padding: 9,
    borderRadius: 12,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.accent,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
  },
  adminChip: {
    backgroundColor: COLORS.pendingBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  adminChipText: {
    color: '#8A6415',
    fontSize: 11,
    fontWeight: '700',
  },

  // Bottom Nav Bar
  navTabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 10,
    paddingHorizontal: 6,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icWrap: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  icActive: {
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  tabLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  labelActive: {
    color: '#FFFFFF',
  },
  raisedTab: {
    position: 'relative',
  },
  raisedIc: {
    backgroundColor: COLORS.accent,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
  },
  raisedLabel: {
    color: '#E8C87A',
  }
});
