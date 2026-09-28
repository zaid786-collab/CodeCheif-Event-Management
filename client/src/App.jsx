import React from 'react';
import { Routes, Route, Outlet, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdminSidebar } from './components/AdminSidebar';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Admin Pages
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminEventsPage } from './pages/AdminEventsPage';
import { AdminRegistrationsPage } from './pages/AdminRegistrationsPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';

// Public Layout Wrapper
const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-gray-100 selection:bg-brand-500 selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Admin Layout Wrapper
const AdminLayout = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col lg:flex-row bg-[#080A0F] text-gray-100 selection:bg-brand-500 selection:text-white">
        <AdminSidebar />
        <main className="flex-1 min-w-0 overflow-y-auto min-h-screen">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
};

// 404 Fallback
const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-bg text-center">
      <div className="p-8 rounded-3xl bg-dark-card border border-dark-border max-w-md space-y-4">
        <span className="text-4xl font-mono font-bold text-brand-500">404</span>
        <h2 className="text-2xl font-bold text-white">Segment Fault: Page Not Found</h2>
        <p className="text-sm text-gray-400">
          The requested route pointer does not exist in our memory address space.
        </p>
        <Link
          to="/"
          className="inline-block px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-colors"
        >
          Return to Safe Memory (Home)
        </Link>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Admin Authentication */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Protected Dashboard Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="events" element={<AdminEventsPage />} />
        <Route path="registrations" element={<AdminRegistrationsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
