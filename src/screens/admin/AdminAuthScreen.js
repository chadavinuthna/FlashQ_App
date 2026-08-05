import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import LogoSVG from '../../components/LogoSVG';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme/theme';

export default function AdminAuthScreen({ onSwitchRole }) {
  const { loginAdmin } = useAuth();
  const { showToast } = useApp();

  const [adminEmail, setAdminEmail] = useState('admin@college.edu');
  const [adminPw, setAdminPw] = useState('admin123');

  const handleLogin = async () => {
    if (!adminEmail || !adminPw) {
      showToast('Fill all fields');
      return;
    }
    const res = await loginAdmin(adminEmail.trim(), adminPw);
    if (!res.success) {
      showToast(res.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoWrap}>
        <LogoSVG size={64} />
        <View style={styles.wordmark}>
          <Text style={styles.wmFlash}>Flash</Text>
          <Text style={styles.wmQ}>Q</Text>
        </View>
        <Text style={styles.tagline}>Check · Book · Collect</Text>
        <Text style={styles.subText}>Stationery desk console</Text>
      </View>

      <Input
        label="Email"
        placeholder="admin@college.edu"
        value={adminEmail}
        onChangeText={setAdminEmail}
        keyboardType="email-address"
      />

      <Input
        label="Password"
        placeholder="••••••••"
        value={adminPw}
        onChangeText={setAdminPw}
        isPassword
      />

      <Button title="Log In" onPress={handleLogin} variant="primary" />

      <Text style={styles.demoHint}>Demo account prefilled — just tap Log In.</Text>

      <View style={styles.switchRoleWrap}>
        <Text style={styles.switchRoleText}>
          Student?{' '}
          <Text style={styles.linkText} onPress={onSwitchRole}>
            Student Login
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingVertical: 30,
    backgroundColor: COLORS.bg,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 22,
  },
  wordmark: {
    flexDirection: 'row',
    marginTop: 12,
  },
  wmFlash: {
    fontWeight: '800',
    fontSize: 26,
    color: COLORS.text,
  },
  wmQ: {
    fontWeight: '800',
    fontSize: 26,
    color: COLORS.accent,
  },
  tagline: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: COLORS.muted,
    marginTop: 4,
  },
  subText: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 4,
  },
  demoHint: {
    fontSize: 11,
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 16,
  },
  switchRoleWrap: {
    alignItems: 'center',
    marginTop: 18,
  },
  switchRoleText: {
    fontSize: 12,
    color: COLORS.muted,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 12.5,
    fontWeight: '600',
  }
});
