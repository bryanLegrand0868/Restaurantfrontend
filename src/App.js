import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// User Components
import HomePage from './pages/user/HomePage';
import UserLayout from './components/layouts/UserLayout';
import MenuPage from './pages/user/MenuPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/user/ProfilePage';
import OrderHistoryPage from './pages/user/OrderHistoryPage';

// Admin Components
import AdminLayout from './components/layouts/AdminLayout';

// Admin placeholder components
const AdminLogin = () => <div>Admin Login Page (Coming Soon)</div>;
const Dashboard = () => <div>Admin Dashboard (Coming Soon)</div>;
const OrderManagement = () => <div>Order Management (Coming Soon)</div>;
const MenuManagement = () => <div>Menu Management (Coming Soon)</div>;
const AdminProfile = () => <div>Admin Profile (Coming Soon)</div>;

// Protected Routes Components
const UserProtectedRoute = ({ children }) => {
  // Add your authentication logic here
  return children;
};

const AdminProtectedRoute = ({ children }) => {
  // Add your admin authentication logic here
  return children;
};

function App() {
  return (
    <Routes>
      {/* User Routes */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<HomePage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="order-history" element={<OrderHistoryPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        {/*<Route path="cart" element={<CartPage />} />*/}
        {/*<Route path="orders" element={<OrderTrackingPage />} />*/}
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
  );
}

export default App;
