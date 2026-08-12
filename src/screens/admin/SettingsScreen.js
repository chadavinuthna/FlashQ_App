import React from 'react';
import { View, Text, ScrollView, Switch, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Chip from '../../components/Chip';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme/theme';

export default function SettingsScreen({ onBackToDashboard }) {
  const {
    storeOpen,
    setStoreOpen,
    slotCapacity,
    setSlotCapacity,
    printPricing,
    setPrintPricing,
    showToast
  } = useApp();

  const [capacityText, setCapacityText] = React.useState(String(slotCapacity));
  const [bwText, setBwText] = React.useState(String(printPricing.bw));
  const [colorText, setColorText] = React.useState(String(printPricing.color));

  const toggleStore = () => {
    setStoreOpen(!storeOpen);
    showToast(!storeOpen ? 'Store marked Open' : 'Store marked Closed');
  };

  const handleSaveSettings = () => {
    const capNum = parseInt(capacityText, 10);
    if (isNaN(capNum) || capNum <= 0) {
      showToast('Please enter a valid capacity (minimum 1)');
      return;
    }

    const bwNum = parseFloat(bwText);
    const colorNum = parseFloat(colorText);

    if (isNaN(bwNum) || bwNum < 0 || isNaN(colorNum) || colorNum < 0) {
      showToast('Please enter valid non-negative pricing values');
      return;
    }

    setSlotCapacity(capNum);
    setPrintPricing({ bw: bwNum, color: colorNum });
    showToast('Settings saved successfully');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topline}>
        <Text style={styles.eyebrow}>Configure</Text>
        <Text style={styles.h1}>Settings</Text>
      </View>

      <View style={styles.screenpad}>
        <Card style={styles.rowBetween}>
          <View>
            <Text style={styles.title}>Store Open / Closed</Text>
            <Chip
              label={storeOpen ? 'Open' : 'Closed'}
              type={storeOpen ? 'success' : 'error'}
              style={{ marginTop: 4 }}
            />
          </View>
          <Switch
            value={storeOpen}
            onValueChange={toggleStore}
            trackColor={{ false: COLORS.line, true: COLORS.success }}
            thumbColor="#FFF"
          />
        </Card>

        <Card>
          <Input
            label="Pickup Slot Capacity (per 10-min slot)"
            value={capacityText}
            onChangeText={setCapacityText}
            keyboardType="numeric"
          />
        </Card>

        <Card>
          <Input
            label="Print Pricing — B/W per page (₹)"
            value={bwText}
            onChangeText={setBwText}
            keyboardType="numeric"
          />
          <Input
            label="Print Pricing — Color per page (₹)"
            value={colorText}
            onChangeText={setColorText}
            keyboardType="numeric"
          />
        </Card>

        <Button
          title="Save Settings"
          variant="primary"
          onPress={handleSaveSettings}
          style={{ marginBottom: 10 }}
        />

        <Button
          title="Back to Dashboard"
          variant="outline"
          onPress={onBackToDashboard}
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
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '600',
    fontSize: 13,
    color: COLORS.text,
  }
});
