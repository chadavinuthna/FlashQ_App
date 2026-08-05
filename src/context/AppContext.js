import React, { createContext, useState, useContext } from 'react';
import { nowStr } from '../utils/slotHelper';

const AppContext = createContext();

const INITIAL_PRODUCTS = [
  { id: "p1", name: "A4 Notebook (200pg)", category: "Notebooks", price: 45, stock: 34, icon: "📓", waitlist: [] },
  { id: "p2", name: "Blue Gel Pen (Pack of 5)", category: "Pens", price: 60, stock: 5, icon: "🖊️", waitlist: [] },
  { id: "p3", name: "Graph Paper Pad", category: "Notebooks", price: 70, stock: 0, icon: "📐", waitlist: [] },
  { id: "p4", name: "Whitener/Correction Pen", category: "Stationery", price: 35, stock: 22, icon: "⚪", waitlist: [] },
  { id: "p5", name: "Stapler (Small)", category: "Tools", price: 90, stock: 12, icon: "📎", waitlist: [] },
  { id: "p6", name: "Highlighter Set (4 colors)", category: "Pens", price: 110, stock: 8, icon: "🖍️", waitlist: [] },
  { id: "p7", name: "Drawing Sheets (10pk)", category: "Stationery", price: 55, stock: 3, icon: "📄", waitlist: [] },
  { id: "p8", name: "Sketch Pen Set", category: "Pens", price: 80, stock: 17, icon: "🎨", waitlist: [] }
];

const INITIAL_STUDENTS = {
  "23B81A0501": { name: "Rahul Sharma", email: "rahul.sharma@college.edu", password: "pass123" }
};

export function AppProvider({ children }) {
  const [storeOpen, setStoreOpen] = useState(true);
  const [slotCapacity, setSlotCapacity] = useState(6);
  const [printPricing, setPrintPricing] = useState({ bw: 2, color: 8 });
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState([]);
  const [printOrders, setPrintOrders] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 'N-1000', text: 'Welcome to FlashQ! Browse products or upload a document to print.', icon: '👋', time: nowStr() }
  ]);
  const [seq, setSeq] = useState(1000);
  const [toast, setToast] = useState(null);

  // Student specific active state
  const [cart, setCart] = useState([]);
  const [productFilter, setProductFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [viewProductId, setViewProductId] = useState(null);
  const [viewOrderId, setViewOrderId] = useState(null);

  // Print form active state
  const [printFiles, setPrintFiles] = useState([]);
  const [printCopies, setPrintCopies] = useState(1);
  const [printColor, setPrintColor] = useState('bw');
  const [printSize, setPrintSize] = useState('A4');
  const [printSide, setPrintSide] = useState('single');
  const [printSlot, setPrintSlot] = useState(null);
  const [printEmergency, setPrintEmergency] = useState(false);

  // Preferred Slot
  const [preferredSlot, setPreferredSlot] = useState(null);
  const [preferredSlotEmergency, setPreferredSlotEmergency] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => {
      setToast(prev => (prev === msg ? null : prev));
    }, 1800);
  };

  const nextId = (prefix) => {
    const newSeq = seq + 1;
    setSeq(newSeq);
    return `${prefix}-${newSeq}`;
  };

  const pushNotification = (text, icon = '🔔') => {
    setNotifications(prev => [
      { id: nextId('N'), text, icon, time: nowStr() },
      ...prev
    ]);
  };

  const addToCart = (id) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { id, qty: 1 }];
    });
    showToast('Added to cart');
  };

  const changeCartQty = (id, delta) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const toggleWaitlist = (id, studentRoll) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const waitlist = p.waitlist || [];
        const idx = waitlist.indexOf(studentRoll);
        let updatedList;
        if (idx === -1) {
          updatedList = [...waitlist, studentRoll];
          showToast('We will notify you when it is back in stock');
        } else {
          updatedList = waitlist.filter(r => r !== studentRoll);
          showToast('Reminder removed');
        }
        return { ...p, waitlist: updatedList };
      }
      return p;
    }));
  };

  return (
    <AppContext.Provider
      value={{
        storeOpen,
        setStoreOpen,
        slotCapacity,
        setSlotCapacity,
        printPricing,
        setPrintPricing,
        students,
        setStudents,
        products,
        setProducts,
        orders,
        setOrders,
        printOrders,
        setPrintOrders,
        notifications,
        pushNotification,
        toast,
        showToast,
        nextId,

        cart,
        setCart,
        addToCart,
        changeCartQty,
        productFilter,
        setProductFilter,
        search,
        setSearch,
        viewProductId,
        setViewProductId,
        viewOrderId,
        setViewOrderId,

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
        setPreferredSlot,
        preferredSlotEmergency,
        setPreferredSlotEmergency,

        toggleWaitlist
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
