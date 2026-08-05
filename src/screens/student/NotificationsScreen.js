import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme/theme';

export default function NotificationsScreen() {
  const { notifications } = useApp();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topline}>
        <Text style={styles.eyebrow}>Alerts</Text>
        <Text style={styles.h1}>Notifications</Text>
      </View>

      <View style={styles.screenpad}>
        <Card>
          {notifications.length ? (
            notifications.map((n, idx) => (
              <View key={n.id || idx} style={[styles.notifItem, idx === notifications.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={styles.notifIcon}>
                  <Text style={{ fontSize: 14 }}>{n.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifText}>{n.text}</Text>
                  <Text style={styles.notifTime}>{n.time}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyWrap}>
              <Text style={{ fontSize: 30, marginBottom: 8 }}>🔕</Text>
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptySub}>Place an order or submit a print job to see updates here.</Text>
            </View>
          )}
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
  notifItem: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  notifIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifText: {
    fontSize: 13,
    color: COLORS.text,
  },
  notifTime: {
    fontSize: 10.5,
    color: COLORS.muted,
    marginTop: 2,
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
