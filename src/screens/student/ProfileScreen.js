import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme/theme';

export default function ProfileScreen() {
  const { studentRoll, logout } = useAuth();
  const { students, setStudents, showToast } = useApp();

  const stu = students[studentRoll] || { name: 'Rahul Sharma', email: 'rahul.sharma@college.edu' };

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(stu.name);
  const [email, setEmail] = useState(stu.email);

  const handleSave = () => {
    setStudents(prev => ({
      ...prev,
      [studentRoll]: { ...stu, name: name || stu.name, email: email || stu.email }
    }));
    setEditMode(false);
    showToast('Profile updated');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topline}>
        <Text style={styles.eyebrow}>Account</Text>
        <Text style={styles.h1}>Profile</Text>
      </View>

      <View style={styles.screenpad}>
        <Card>
          {editMode ? (
            <View>
              <Input label="Name" value={name} onChangeText={setName} />
              <Input label="Roll Number" value={studentRoll} disabled />
              <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
              <Button title="Save" variant="primary" onPress={handleSave} />
            </View>
          ) : (
            <View>
              <View style={styles.rline}>
                <Text style={styles.k}>Name</Text>
                <Text style={styles.v}>{stu.name}</Text>
              </View>
              <View style={styles.rline}>
                <Text style={styles.k}>Roll Number</Text>
                <Text style={styles.v}>{studentRoll}</Text>
              </View>
              <View style={styles.rline}>
                <Text style={styles.k}>Email</Text>
                <Text style={styles.v}>{stu.email}</Text>
              </View>
              <Button
                title="Edit Profile"
                variant="outline"
                onPress={() => setEditMode(true)}
                style={{ marginTop: 12 }}
              />
            </View>
          )}
        </Card>

        <Button
          title="Logout"
          variant="danger"
          onPress={logout}
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
  rline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  k: {
    color: COLORS.muted,
    fontSize: 12.5,
  },
  v: {
    color: COLORS.text,
    fontSize: 12.5,
    fontWeight: '600',
  }
});
