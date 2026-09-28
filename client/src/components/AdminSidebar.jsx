import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
  Code2,
  Sparkles,
  Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AdminSidebar = () => {
  const { admin, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info('Logged out from Admin Executive Console.');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Events Management', path: '/admin/events', icon: CalendarDays },
    { name: 'Registrations', path: '/admin/registrations', icon: Users },
    { name: 'Club Settings', path: '/admin/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-5 bg-[#0D1017] border-r border-[#1B2232] text-gray-300">
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-crimson-600 flex items-center justify-center p-[1px]">
            <div className="w-full h-full bg-dark-bg rounded-[11px] flex items-center justify-center">
              <Shield className="w-4 h-4 text-brand-400" />
            </div>
          </div>
          <div>
            <h2 className="font-mono font-bold text-white text-sm tracking-wide flex items-center gap-1.5">
              CAMPUS ADMIN
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </h2>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              Executive Console
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 font-semibold shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile and Actions */}
      <div className="space-y-4 pt-6 border-t border-[#1B2232]">
        <Link
          to="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-brand-300 hover:bg-brand-500/10 border border-transparent hover:border-brand-500/20 transition-all"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            View Public Site
          </span>
          <span className="text-[10px] font-mono bg-dark-card px-1.5 py-0.5 rounded border border-dark-border">
            LIVE
          </span>
        </Link>

        {/* Current Admin User Card */}
        <div className="p-3 rounded-xl bg-[#141924] border border-[#1F273A]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 font-mono font-bold flex items-center justify-center text-xs border border-brand-500/30">
              {admin?.name ? admin.name[0].toUpperCase() : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {admin?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-gray-400 font-mono truncate">
                {admin?.email || 'admin@codechefclub.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 overflow-y-auto z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Top Header with Toggle */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#0D1017] border-b border-[#1B2232] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-brand-400" />
          <span className="font-mono font-bold text-white text-sm">CAMPUS ADMIN</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-dark-card border border-dark-border text-gray-300 hover:text-white"
          aria-label="Toggle mobile admin menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-full h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
