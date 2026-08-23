import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, StatusBar } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AppProvider, useApp } from './src/context/AppContext';
import { HeaderRoleBar, BottomTabBar } from './src/components/NavigationBar';
import Toast from './src/components/Toast';

import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';

import StudentAuthScreen from './src/screens/student/StudentAuthScreen';
import HomeScreen from './src/screens/student/HomeScreen';
import ProductsScreen from './src/screens/student/ProductsScreen';
import ProductDetailScreen from './src/screens/student/ProductDetailScreen';
import WishlistScreen from './src/screens/student/WishlistScreen';
import CartScreen from './src/screens/student/CartScreen';
import CheckoutScreen from './src/screens/student/CheckoutScreen';
import PrintScreen from './src/screens/student/PrintScreen';
import OrdersScreen from './src/screens/student/OrdersScreen';
import OrderDetailScreen from './src/screens/student/OrderDetailScreen';
import SlotsScreen from './src/screens/student/SlotsScreen';
import NotificationsScreen from './src/screens/student/NotificationsScreen';
import ProfileScreen from './src/screens/student/ProfileScreen';

import AdminAuthScreen from './src/screens/admin/AdminAuthScreen';
import AdminDashboardScreen from './src/screens/admin/AdminDashboardScreen';
import InventoryScreen from './src/screens/admin/InventoryScreen';
import AdminOrdersScreen from './src/screens/admin/AdminOrdersScreen';
import AdminOrderDetailScreen from './src/screens/admin/AdminOrderDetailScreen';
import PrintQueueScreen from './src/screens/admin/PrintQueueScreen';
import PrintDetailScreen from './src/screens/admin/PrintDetailScreen';
import PickupScreen from './src/screens/admin/PickupScreen';
import AnalyticsScreen from './src/screens/admin/AnalyticsScreen';
import SettingsScreen from './src/screens/admin/SettingsScreen';

import { COLORS } from './src/theme/theme';

function MainApp() {
  const { user, role, setRole } = useAuth();
  const { cart, viewProductId, setViewProductId, viewOrderId, setViewOrderId, toast } = useApp();

  const [appPhase, setAppPhase] = useState('splash'); // 'splash' | 'onboarding' | 'app'
  const [studentScreen, setStudentScreen] = useState('home');
  const [adminScreen, setAdminScreen] = useState('dashboard');
  const [navStack, setNavStack] = useState([]);

  if (appPhase === 'splash') {
    return <SplashScreen onFinish={() => setAppPhase('onboarding')} />;
  }

  if (appPhase === 'onboarding') {
    return <OnboardingScreen onFinish={() => setAppPhase('app')} />;
  }

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const navigateStudent = (screen, extra = {}) => {
    setNavStack(prev => [...prev, { screen: studentScreen, viewProductId, viewOrderId }]);
    setStudentScreen(screen);
    if ('viewProductId' in extra) setViewProductId(extra.viewProductId);
    if ('viewOrderId' in extra) setViewOrderId(extra.viewOrderId);
  };

  const goBackStudent = () => {
    if (navStack.length > 0) {
      const prev = navStack[navStack.length - 1];
      setNavStack(stack => stack.slice(0, -1));
      setStudentScreen(prev.screen);
      setViewProductId(prev.viewProductId);
      setViewOrderId(prev.viewOrderId);
    } else {
      setStudentScreen('home');
      setViewProductId(null);
      setViewOrderId(null);
    }
  };

  const navigateAdmin = (screen, extra = {}) => {
    setNavStack(prev => [...prev, { screen: adminScreen, viewOrderId, viewProductId }]);
    setAdminScreen(screen);
    if ('viewOrderId' in extra) setViewOrderId(extra.viewOrderId);
  };

  const goBackAdmin = () => {
    if (navStack.length > 0) {
      const prev = navStack[navStack.length - 1];
      setNavStack(stack => stack.slice(0, -1));
      setAdminScreen(prev.screen);
      setViewOrderId(prev.viewOrderId);
    } else {
      setAdminScreen('dashboard');
      setViewOrderId(null);
    }
  };

  const isLoggedIn = Boolean(user);
  const showBack = role === 'student'
    ? !(studentScreen === 'home' && !viewProductId && !viewOrderId)
    : !(adminScreen === 'dashboard' && !viewOrderId);

  const renderStudentContent = () => {
    if (!isLoggedIn) {
      return (
        <StudentAuthScreen
          onSwitchRole={() => setRole('admin')}
          onLoginSuccess={() => {
            setStudentScreen('home');
            setNavStack([]);
            setViewProductId(null);
            setViewOrderId(null);
          }}
        />
      );
    }

    if (studentScreen === 'products') {
      if (viewProductId) {
        return (
          <ProductDetailScreen
            productId={viewProductId}
            onBack={() => setViewProductId(null)}
          />
        );
      }
      return (
        <ProductsScreen
          onSelectProduct={(id) => setViewProductId(id)}
        />
      );
    }

    if (studentScreen === 'cart') {
      return (
        <CartScreen
          onCheckout={() => navigateStudent('checkout')}
          onBrowse={() => navigateStudent('products')}
        />
      );
    }

    if (studentScreen === 'checkout') {
      return (
        <CheckoutScreen
          onOrderConfirmed={(orderId) => {
            setNavStack([]);
            setStudentScreen('orders');
            setViewOrderId('order:' + orderId);
          }}
          onBackToCart={() => setStudentScreen('cart')}
        />
      );
    }

    if (studentScreen === 'print') {
      return (
        <PrintScreen
          onPrintSubmitted={(printId) => {
            setNavStack([]);
            setStudentScreen('orders');
            setViewOrderId('print:' + printId);
          }}
        />
      );
    }

    if (studentScreen === 'orders') {
      if (viewOrderId) {
        const [kind, id] = viewOrderId.split(':');
        return (
          <OrderDetailScreen
            orderKind={kind}
            orderId={id}
            onBack={() => setViewOrderId(null)}
          />
        );
      }
      return (
        <OrdersScreen
          onSelectOrder={(kind, id) => setViewOrderId(`${kind}:${id}`)}
        />
      );
    }

    if (studentScreen === 'wishlist') {
      return (
        <WishlistScreen
          onSelectProduct={(id) => navigateStudent('products', { viewProductId: id })}
          onBrowseMore={() => navigateStudent('products')}
        />
      );
    }

    if (studentScreen === 'slots') return <SlotsScreen />;
    if (studentScreen === 'notifications') return <NotificationsScreen />;
    if (studentScreen === 'profile') return <ProfileScreen />;

    return <HomeScreen onNavigate={(scr) => navigateStudent(scr)} />;
  };

  const renderAdminContent = () => {
    if (!isLoggedIn) {
      return <AdminAuthScreen onSwitchRole={() => setRole('student')} />;
    }

    if (adminScreen === 'inventory') return <InventoryScreen />;

    if (adminScreen === 'orders') {
      if (viewOrderId) {
        return (
          <AdminOrderDetailScreen
            orderId={viewOrderId}
            onBack={() => setViewOrderId(null)}
          />
        );
      }
      return (
        <AdminOrdersScreen
          onSelectOrder={(id) => setViewOrderId(id)}
        />
      );
    }

    if (adminScreen === 'printqueue') {
      if (viewOrderId) {
        return (
          <PrintDetailScreen
            printId={viewOrderId}
            onBack={() => setViewOrderId(null)}
          />
        );
      }
      return (
        <PrintQueueScreen
          onSelectPrint={(id) => setViewOrderId(id)}
        />
      );
    }

    if (adminScreen === 'pickup') return <PickupScreen />;
    if (adminScreen === 'analytics') return <AnalyticsScreen />;
    if (adminScreen === 'settings') return <SettingsScreen onBackToDashboard={() => setAdminScreen('dashboard')} />;

    return <AdminDashboardScreen onNavigate={(scr) => navigateAdmin(scr)} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.card} />
      <HeaderRoleBar
        role={role}
        isLoggedIn={isLoggedIn}
        cartCount={cartCount}
        onOpenCart={() => navigateStudent('cart')}
        showBack={showBack}
        onGoBack={role === 'student' ? goBackStudent : goBackAdmin}
      />
      <View style={styles.main}>
        {role === 'student' ? renderStudentContent() : renderAdminContent()}
      </View>
      {isLoggedIn && (
        <BottomTabBar
          role={role}
          currentScreen={role === 'student' ? studentScreen : adminScreen}
          onSelectTab={(tab) => {
            setViewProductId(null);
            setViewOrderId(null);
            if (role === 'student') setStudentScreen(tab);
            else setAdminScreen(tab);
          }}
        />
      )}
      <Toast message={toast} />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  main: {
    flex: 1,
    paddingBottom: 76,
  }
});
