export function roundUpTo10(date) {
  const ms = date.getTime();
  const step = 10 * 60000;
  return new Date(Math.ceil(ms / step) * step);
}

export function slotBookingCount(label, orders = [], printOrders = []) {
  const ordCount = orders.filter(o => o.slot === label).length;
  const prtCount = printOrders.filter(o => o.slot === label).length;
  return ordCount + prtCount;
}

export function generateSlots(count = 9, capacity = 6, orders = [], printOrders = []) {
  const start = roundUpTo10(new Date(Date.now() + 10 * 60000));
  const slots = [];
  for (let i = 0; i < count; i++) {
    const t = new Date(start.getTime() + i * 10 * 60000);
    const label = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const c = slotBookingCount(label, orders, printOrders);
    slots.push({
      label,
      count: c,
      capacity,
      full: c >= capacity
    });
  }
  return slots;
}

export function suggestSlot(capacity = 6, orders = [], printOrders = []) {
  const slots = generateSlots(9, capacity, orders, printOrders);
  const avail = slots.find(s => !s.full);
  return avail ? avail.label : (slots[slots.length - 1]?.label || "10:00 AM");
}

export function timeStringToDateToday(hhmm) {
  if (!hhmm) return new Date();
  const trimmed = String(hhmm).trim().toUpperCase();
  const isPM = trimmed.includes('PM');
  const isAM = trimmed.includes('AM');
  const cleanStr = trimmed.replace('AM', '').replace('PM', '').trim();
  const parts = cleanStr.split(':');
  
  let hours = parseInt(parts[0], 10);
  let minutes = parts[1] ? parseInt(parts[1], 10) : 0;
  if (isNaN(hours)) hours = new Date().getHours();
  if (isNaN(minutes)) minutes = 0;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

export function generateSlotsAround(centerDate, count = 7, capacity = 6, orders = [], printOrders = []) {
  const minStart = roundUpTo10(new Date(Date.now() + 10 * 60000));
  let startBoundary = roundUpTo10(new Date(centerDate.getTime() - Math.floor(count / 2) * 10 * 60000));
  if (startBoundary.getTime() < minStart.getTime()) {
    startBoundary = minStart;
  }
  const slots = [];
  for (let i = 0; i < count; i++) {
    const t = new Date(startBoundary.getTime() + i * 10 * 60000);
    const label = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const c = slotBookingCount(label, orders, printOrders);
    slots.push({
      label,
      count: c,
      capacity,
      full: c >= capacity
    });
  }
  return slots;
}

export function isValidPassword(pw) {
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(pw);
}

export function money(n) {
  return "₹" + Number(n).toFixed(0);
}

export function nowStr() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
