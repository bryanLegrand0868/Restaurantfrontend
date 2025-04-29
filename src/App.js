import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import './App.css';

// User Components
import HomePage from './pages/user/HomePage';
import UserLayout from './components/layouts/UserLayout';
import MenuPage from './pages/user/MenuPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DishDetailPage from './pages/user/DishDetailPage';
import CartPage from './pages/user/CartPage';
import CheckoutPage from './pages/user/CheckoutPage';
import OrderTrackingPage from './pages/user/OrderTrackingPage';
import ProfilePage from './pages/user/ProfilePage';
import OrderHistoryPage from './pages/user/OrderHistoryPage';


// Admin Components
import AdminLayout from './components/layouts/AdminLayout';

// Placeholder components - will be implemented later
const Register = () => <div>Register Page (Coming Soon)</div>;
const DishDetail = () => <div>Dish Detail Page (Coming Soon)</div>;
const Cart = () => <div>Cart Page (Coming Soon)</div>;
const Checkout = () => <div>Checkout Page (Coming Soon)</div>;
const OrderTracking = () => <div>Order Tracking Page (Coming Soon)</div>;
const UserProfile = () => <div>User Profile Page (Coming Soon)</div>;
const OrderHistory = () => <div>Order History Page (Coming Soon)</div>;

// Admin placeholder components
const AdminLogin = () => <div>Admin Login Page (Coming Soon)</div>;
const Dashboard = () => <div>Admin Dashboard (Coming Soon)</div>;
const OrderManagement = () => <div>Order Management (Coming Soon)</div>;
const MenuManagement = () => <div>Menu Management (Coming Soon)</div>;
const AdminProfile = () => <div>Admin Profile (Coming Soon)</div>;

// Protected Routes Components
const UserProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AdminProtectedRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const { checkAuthState } = useAuth();
  
  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  return (
    <div className="App">
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="menu/dish/:id" element={<DishDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-tracking" element={<OrderTrackingPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="order-history" element={<OrderHistoryPage />} />
        </Route>
        
        {/* Auth Routes */}
        <Route path="/auth">
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
