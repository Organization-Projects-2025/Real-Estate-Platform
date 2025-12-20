import { Routes, Route } from 'react-router-dom';
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AdminLayout from './components/admin/Layout';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Properties from './pages/admin/Properties';
import Settings from './pages/admin/Settings';
import Home from './pages/Home';
import Register from './components/Register';
import Login from './components/Login';
import ForgetPassword from './components/ForgetPassword';
import ResetPassword from './components/ResetPassword';
import Rent from './pages/Rent';
import Buy from './pages/Buy';
import Sell from './pages/Sell';
import PropertyDetail from './pages/PropertyDetail';
import Agent from './pages/Agent';
import BecomeAgent from './pages/BecomeAgent';
import CreateAgent from './pages/CreateAgent';
import ManageAgents from './pages/ManageAgents';
import Profile from './pages/Profile';
import Reviews from './pages/Reviews';
import Notifications from './pages/Notifications';
import AdminReviews from './pages/admin/Reviews';
import ReviewForm from './components/ReviewForm';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import NotFound from './pages/NotFound';
import DeveloperProperties from './pages/DeveloperProperties';
import DeveloperPropertiesDetail from './pages/DeveloperPropertiesDetail';
import ManageDeveloperProperties from './pages/ManageDeveloperProperties';

const App = () => {
  return (
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/agent" element={<Agent />} />
        <Route path="/become-agent" element={<BecomeAgent />} />
        <Route path="/create-agent" element={<CreateAgent />} />
        <Route path="/manage-agents" element={<ManageAgents />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/write-review" element={<ReviewForm />} />
        <Route path="/developer-properties" element={<DeveloperProperties />} />
        <Route path="/developer-properties/:developerId" element={<DeveloperPropertiesDetail />} />
        <Route path="/manage-developer-properties" element={<ManageDeveloperProperties />} />

        {/* Protected admin routes */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="properties" element={<Properties />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
};

export default App;
