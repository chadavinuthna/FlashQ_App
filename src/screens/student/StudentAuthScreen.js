import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import LogoSVG from '../../components/LogoSVG';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Icon from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { isValidPassword } from '../../utils/slotHelper';
import { COLORS } from '../../theme/theme';

export default function StudentAuthScreen({ onSwitchRole }) {
  const { loginStudent, signupStudent } = useAuth();
  const { students, setStudents, showToast } = useApp();

  const [authTab, setAuthTab] = useState('login'); // 'login' | 'signup'
  const [forgotStep, setForgotStep] = useState(false);

  // Form states
  const [loginRoll, setLoginRoll] = useState('23B81A0501');
  const [loginPw, setLoginPw] = useState('pass123');

  const [suEmail, setSuEmail] = useState('');
  const [suRoll, setSuRoll] = useState('');
  const [suPw, setSuPw] = useState('');

  const [fpEmail, setFpEmail] = useState('');

  const handleLogin = async () => {
    if (!loginRoll || !loginPw) {
      showToast('Fill all fields');
      return;
    }
    const res = await loginStudent(loginRoll.trim(), loginPw, students);
    if (!res.success) {
      showToast(res.message);
    }
  };

  const handleSignup = async () => {
    if (!suEmail || !suRoll || !suPw) {
      showToast('Fill all fields');
      return;
    }
    if (!isValidPassword(suPw)) {
      showToast('Password needs 8+ chars, letters, numbers & a symbol');
      return;
    }
    await signupStudent(suEmail.trim(), suRoll.trim(), suPw, setStudents);
    showToast('Account created — verify email, then log in');
    setAuthTab('login');
  };

  const handleForgotSubmit = () => {
    if (!fpEmail) {
      showToast('Enter your college email');
      return;
    }
    showToast('Reset link sent to your email');
    setForgotStep(false);
    setAuthTab('login');
  };

  if (forgotStep) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setForgotStep(false)}>
          <Icon name="back" size={14} color={COLORS.primary} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.logoWrap}>
          <LogoSVG size={56} />
          <View style={styles.wordmark}>
            <Text style={styles.wmFlash}>Flash</Text>
            <Text style={styles.wmQ}>Q</Text>
          </View>
          <Text style={styles.subText}>Enter your registered college email</Text>
        </View>

        <Input
          label="Registered Email"
          placeholder="you@college.edu"
          value={fpEmail}
          onChangeText={setFpEmail}
          keyboardType="email-address"
        />

        <Button title="Send Reset Link" onPress={handleForgotSubmit} variant="primary" />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoWrap}>
        <LogoSVG size={64} />
        <View style={styles.wordmark}>
          <Text style={styles.wmFlash}>Flash</Text>
          <Text style={styles.wmQ}>Q</Text>
        </View>
        <Text style={styles.tagline}>Check · Book · Collect</Text>
      </View>

      <View style={styles.authTabs}>
        <TouchableOpacity
          style={[styles.tabBtn, authTab === 'login' && styles.activeTab]}
          onPress={() => setAuthTab('login')}
        >
          <Text style={[styles.tabText, authTab === 'login' && styles.activeTabText]}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, authTab === 'signup' && styles.activeTab]}
          onPress={() => setAuthTab('signup')}
        >
          <Text style={[styles.tabText, authTab === 'signup' && styles.activeTabText]}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {authTab === 'login' ? (
        <View>
          <Input
            label="Roll Number"
            placeholder="23B81A0501"
            value={loginRoll}
            onChangeText={setLoginRoll}
          />
          <Input
            label="Password"
            placeholder="••••••••"
            value={loginPw}
            onChangeText={setLoginPw}
            isPassword
          />
          <Button title="Log In" onPress={handleLogin} variant="primary" />
          <TouchableOpacity style={styles.forgotWrap} onPress={() => setForgotStep(true)}>
            <Text style={styles.linkText}>Forgot password?</Text>
          </TouchableOpacity>
          <Text style={styles.demoHint}>Demo account prefilled — just tap Log In.</Text>
        </View>
      ) : (
        <View>
          <Input
            label="College Email"
            placeholder="you@college.edu"
            value={suEmail}
            onChangeText={setSuEmail}
            keyboardType="email-address"
          />
          <Input
            label="Roll Number"
            placeholder="23B81A0502"
            value={suRoll}
            onChangeText={setSuRoll}
          />
          <Input
            label="Create Password"
            placeholder="••••••••"
            value={suPw}
            onChangeText={setSuPw}
            isPassword
            hint="Minimum 8 characters, with letters, numbers & a special character."
          />
          <Button title="Create Account" onPress={handleSignup} variant="primary" />
        </View>
      )}

      <View style={styles.switchRoleWrap}>
        <Text style={styles.switchRoleText}>
          Stationery admin?{' '}
          <Text style={styles.linkText} onPress={onSwitchRole}>
            Admin Login
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
  authTabs: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 18,
    backgroundColor: COLORS.bg,
    padding: 4,
    borderRadius: 10,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.card,
  },
  tabText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: COLORS.muted,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  forgotWrap: {
    alignItems: 'center',
    marginTop: 12,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 12.5,
    fontWeight: '600',
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
  }
});
