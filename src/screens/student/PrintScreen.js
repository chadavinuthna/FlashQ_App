import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import SlotPicker from '../../components/SlotPicker';
import Icon from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  suggestSlot,
  generateSlots,
  generateSlotsAround,
  timeStringToDateToday,
  money
} from '../../utils/slotHelper';
import { COLORS } from '../../theme/theme';

export default function PrintScreen({ onPrintSubmitted }) {
  const { studentRoll } = useAuth();
  const {
    storeOpen,
    slotCapacity,
    printPricing,
    orders,
    printOrders,
    setPrintOrders,
    printFiles,
    setPrintFiles,
    printCopies,
    setPrintCopies,
    printColor,
    setPrintColor,
    printSize,
    setPrintSize,
    printSide,
    setPrintSide,
    printSlot,
    setPrintSlot,
    printEmergency,
    setPrintEmergency,
    preferredSlot,
    preferredSlotEmergency,
    pushNotification,
    showToast,
    nextId
  } = useApp();

  const [slotPickerOpen, setSlotPickerOpen] = useState(false);
  const [customSlots, setCustomSlots] = useState(null);
  const [prefTime, setPrefTime] = useState('');

  const activeSlot = printSlot || preferredSlot || suggestSlot(slotCapacity, orders, printOrders);
  const activeEmergency = printSlot ? printEmergency : (preferredSlot ? !!preferredSlotEmergency : false);

  const handlePickDocument = () => {
    // Add document file entry
    const docId = nextId('F');
    const mockFileNames = [
      'Lab_Report_Assignment.pdf',
      'Lecture_Notes_Unit3.pdf',
      'Project_Presentation_Final.pdf',
      'Seminar_Abstract.pdf'
    ];
    const fileName = mockFileNames[printFiles.length % mockFileNames.length];
    const sizeBytes = Math.floor(Math.random() * 2000000) + 200000;
    const pages = Math.floor(Math.random() * 12) + 2;

    const newFile = {
      id: docId,
      name: fileName,
      sizeBytes,
      pages,
      status: 'ready'
    };

    setPrintFiles(prev => [...prev, newFile]);
    showToast(`Added ${fileName}`);
  };

  const removeFile = (id) => {
    setPrintFiles(prev => prev.filter(f => f.id !== id));
  };

  const totalPages = printFiles.reduce((sum, f) => sum + (f.pages || 0), 0);
  const perPage = printColor === 'color' ? printPricing.color : printPricing.bw;
  const sideMultiplier = printSide === 'double' ? 0.6 : 1;
  const baseCost = Math.round(perPage * totalPages * printCopies * sideMultiplier);
  const emergencyFee = activeEmergency ? Math.round(baseCost * 0.25) : 0;
  const totalCost = baseCost + emergencyFee;

  const slotsToShow = customSlots || generateSlots(9, slotCapacity, orders, printOrders);

  const handleSelectSlot = (label, wasFull) => {
    setPrintSlot(label);
    setPrintEmergency(!!wasFull);
    if (wasFull) {
      showToast('Emergency pickup selected — 25% surcharge applies');
    }
  };

  const handleFindNearby = () => {
    if (!prefTime) {
      showToast('Pick a preferred time first (HH:MM)');
      return;
    }
    const center = timeStringToDateToday(prefTime);
    const slots = generateSlotsAround(center, 7, slotCapacity, orders, printOrders);
    if (center.getTime() < Date.now()) {
      showToast('That time has passed — showing nearest upcoming slots');
    }
    setCustomSlots(slots);
  };

  const handleSubmitPrint = () => {
    if (!printFiles.length) {
      showToast('Please upload at least one PDF file');
      return;
    }

    const newOrder = {
      id: nextId('PRT'),
      roll: studentRoll,
      files: printFiles.map(f => ({ name: f.name, pages: f.pages })),
      fileCount: printFiles.length,
      totalPages,
      copies: printCopies,
      color: printColor,
      size: printSize,
      side: printSide,
      baseCost,
      emergencyFee,
      emergency: activeEmergency,
      cost: totalCost,
      slot: activeSlot,
      status: 'Placed',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setPrintOrders(prev => [newOrder, ...prev]);
    pushNotification(`Print job ${newOrder.id} submitted — pickup ${newOrder.slot}`, '🖨️');

    // Reset print state
    setPrintFiles([]);
    setPrintCopies(1);
    setPrintColor('bw');
    setPrintSide('single');
    setPrintSlot(null);
    setPrintEmergency(false);

    onPrintSubmitted(newOrder.id);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topline}>
        <Text style={styles.eyebrow}>Print</Text>
        <Text style={styles.h1}>Print Documents</Text>
      </View>

      <View style={styles.screenpad}>
        {!storeOpen && (
          <View style={styles.closedNotice}>
            <Text style={styles.closedText}>
              🔒 Store is currently closed — you can review options, but print submissions are paused until the admin reopens the store.
            </Text>
          </View>
        )}

        <Card>
          <Text style={styles.fieldLabel}>Upload PDFs</Text>
          <Button
            title="📎 Choose PDF Files"
            variant="outline"
            onPress={handlePickDocument}
          />
          <Text style={styles.hint}>Up to 150MB per file · select multiple PDFs to include in one print order.</Text>

          {printFiles.map(f => (
            <View key={f.id} style={styles.fileRow}>
              <View style={styles.fileLeft}>
                <View style={styles.pdfIcon}>
                  <Text style={{ fontSize: 15 }}>📄</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fileName} numberOfLines={1}>{f.name}</Text>
                  <Text style={styles.fileSub}>{(f.sizeBytes / 1024).toFixed(0)} KB · {f.pages} pages</Text>
                </View>
              </View>
              <Button title="✕" variant="outline" small onPress={() => removeFile(f.id)} />
            </View>
          ))}
        </Card>

        {printFiles.length > 0 ? (
          <View>
            <Card>
              <View style={styles.fieldgroup}>
                <Text style={styles.fieldLabel}>Copies</Text>
                <View style={styles.copiesRow}>
                  <Button
                    title="−"
                    variant="outline"
                    small
                    onPress={() => setPrintCopies(Math.max(1, printCopies - 1))}
                  />
                  <Text style={styles.copiesNum}>{printCopies}</Text>
                  <Button
                    title="+"
                    variant="outline"
                    small
                    onPress={() => setPrintCopies(printCopies + 1)}
                  />
                </View>
              </View>

              <View style={styles.fieldgroup}>
                <Text style={styles.fieldLabel}>Color</Text>
                <View style={styles.catbar}>
                  <TouchableOpacity
                    style={[styles.catBtn, printColor === 'bw' && styles.catActive]}
                    onPress={() => setPrintColor('bw')}
                  >
                    <Text style={[styles.catText, printColor === 'bw' && styles.catTextActive]}>Black & White</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.catBtn, printColor === 'color' && styles.catActive]}
                    onPress={() => setPrintColor('color')}
                  >
                    <Text style={[styles.catText, printColor === 'color' && styles.catTextActive]}>Color</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.fieldgroup}>
                <Text style={styles.fieldLabel}>Paper Size</Text>
                <View style={styles.catbar}>
                  {['A4', 'A3', 'Letter'].map(sz => (
                    <TouchableOpacity
                      key={sz}
                      style={[styles.catBtn, printSize === sz && styles.catActive]}
                      onPress={() => setPrintSize(sz)}
                    >
                      <Text style={[styles.catText, printSize === sz && styles.catTextActive]}>{sz}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.fieldgroup}>
                <Text style={styles.fieldLabel}>Side</Text>
                <View style={styles.catbar}>
                  <TouchableOpacity
                    style={[styles.catBtn, printSide === 'single' && styles.catActive]}
                    onPress={() => setPrintSide('single')}
                  >
                    <Text style={[styles.catText, printSide === 'single' && styles.catTextActive]}>Single Side</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.catBtn, printSide === 'double' && styles.catActive]}
                    onPress={() => setPrintSide('double')}
                  >
                    <Text style={[styles.catText, printSide === 'double' && styles.catTextActive]}>Double Side</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.rline}>
                <Text style={styles.k}>Cost per Page</Text>
                <Text style={styles.v}>{money(perPage)}</Text>
              </View>
              <View style={styles.rline}>
                <Text style={styles.k}>Total Pages</Text>
                <Text style={styles.v}>{totalPages}</Text>
              </View>
              <View style={styles.rline}>
                <Text style={styles.k}>Print Cost</Text>
                <Text style={styles.v}>{money(baseCost)}</Text>
              </View>

              {emergencyFee > 0 && (
                <View style={styles.rlineEmergency}>
                  <Text style={styles.kEmergency}>⚡ Emergency Pickup Fee (25%)</Text>
                  <Text style={styles.vEmergency}>{money(emergencyFee)}</Text>
                </View>
              )}

              <Card tint style={{ marginTop: 6, marginBottom: 0 }}>
                <View style={styles.rline}>
                  <Text style={{ fontSize: 13, color: COLORS.text, fontWeight: '600' }}>Total Cost</Text>
                  <Text style={{ fontSize: 16, color: COLORS.primaryDark, fontWeight: '800' }}>{money(totalCost)}</Text>
                </View>
              </Card>
            </Card>

            <Card tint>
              <Text style={styles.eyebrow}>⭐ Pickup Slot</Text>
              <Text style={styles.slotTitle}>{activeSlot}</Text>
              {activeEmergency && (
                <View style={styles.emergencyBanner}>
                  <Text style={styles.bannerText}>⚡ Emergency pickup selected — 25% surcharge applied</Text>
                </View>
              )}

              <TouchableOpacity onPress={() => setSlotPickerOpen(!slotPickerOpen)} style={{ marginTop: 10 }}>
                <Text style={styles.linkText}>
                  {slotPickerOpen ? 'Hide slot options' : "Don't like this slot? Choose another"}
                </Text>
              </TouchableOpacity>

              {slotPickerOpen && (
                <View style={{ marginTop: 10 }}>
                  <View style={styles.prefRow}>
                    <View style={{ flex: 1 }}>
                      <Input
                        placeholder="e.g. 14:30"
                        value={prefTime}
                        onChangeText={setPrefTime}
                        style={{ marginBottom: 0 }}
                      />
                    </View>
                    <Button
                      title="Find Nearby"
                      variant="outline"
                      small
                      onPress={handleFindNearby}
                      style={{ marginLeft: 8 }}
                    />
                  </View>

                  {customSlots && (
                    <TouchableOpacity onPress={() => setCustomSlots(null)} style={{ alignSelf: 'flex-end', marginTop: 4 }}>
                      <Text style={styles.linkText}>Reset to suggested</Text>
                    </TouchableOpacity>
                  )}

                  <SlotPicker
                    slots={slotsToShow}
                    currentSlot={activeSlot}
                    onSelectSlot={handleSelectSlot}
                  />
                </View>
              )}
            </Card>

            {storeOpen ? (
              <Button
                title="Submit Print Request"
                variant="accent"
                onPress={handleSubmitPrint}
              />
            ) : (
              <View style={styles.closedNotice}>
                <Text style={styles.closedText}>🔒 Store is currently closed — print submissions are paused.</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>🖨️</Text>
            <Text style={styles.emptyTitle}>Upload one or more PDFs to see print options</Text>
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
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    color: COLORS.muted,
    marginBottom: 7,
  },
  hint: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 6,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  fileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  pdfIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileName: {
    fontSize: 12.5,
    fontWeight: '600',
    color: COLORS.text,
  },
  fileSub: {
    fontSize: 11,
    color: COLORS.muted,
  },
  fieldgroup: {
    marginBottom: 14,
  },
  copiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  copiesNum: {
    fontSize: 15,
    minWidth: 24,
    textAlign: 'center',
    fontWeight: '600',
  },
  catbar: {
    flexDirection: 'row',
    gap: 8,
  },
  catBtn: {
    fontSize: 11.5,
    fontWeight: '600',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.card,
  },
  catActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  catText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: COLORS.muted,
  },
  catTextActive: {
    color: '#FFF',
  },
  rline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  k: {
    color: COLORS.muted,
    fontSize: 12.5,
  },
  v: {
    color: COLORS.text,
    fontSize: 12.5,
  },
  rlineEmergency: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  kEmergency: {
    color: COLORS.accentDark,
    fontWeight: '600',
    fontSize: 12.5,
  },
  vEmergency: {
    color: COLORS.accentDark,
    fontWeight: '600',
    fontSize: 12.5,
  },
  slotTitle: {
    fontSize: 20,
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  emergencyBanner: {
    backgroundColor: COLORS.pendingBg,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 8,
  },
  bannerText: {
    color: '#8A6415',
    fontSize: 11.5,
    fontWeight: '600',
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 12.5,
    fontWeight: '600',
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closedNotice: {
    backgroundColor: COLORS.errorBg,
    borderWidth: 1,
    borderColor: '#E8B4AE',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
  },
  closedText: {
    color: '#A83231',
    fontSize: 12.5,
    fontWeight: '500',
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 36,
  },
  emptyTitle: {
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  }
});
