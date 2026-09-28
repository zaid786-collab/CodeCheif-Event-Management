import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Users,
  Trophy,
  Sparkles,
  ArrowRight,
  PlusCircle,
  ExternalLink,
  Clock,
  Layers,
  GraduationCap,
  Loader2,
} from 'lucide-react';
import { api } from '../api/client';
import { StatCard } from '../components/StatCard';
import { categoryColors } from '../components/EventCard';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.getAdminStats();
        if (res?.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          <p className="text-sm font-mono text-gray-400">Loading executive analytics...</p>
        </div>
      </div>
    );
  }

  const metrics = stats?.metrics || {
    totalEvents: 0,
    upcomingEvents: 0,
    totalRegistrations: 0,
    featuredEventTitle: 'None',
  };

  const featured = stats?.featuredEvent;
  const recentRegs = stats?.recentRegistrations || [];
  const categoryBreakdown = stats?.categoryBreakdown || [];
  const yearBreakdown = stats?.yearBreakdown || [];

  return (
    <div className="p-6 sm:p-10 space-y-10 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
            EXECUTIVE DASHBOARD
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Real-time analytics for contests, hackathons, and participant registrations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/events"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-brand-600 to-crimson-600 hover:from-brand-500 hover:to-crimson-500 shadow-glow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Manage Events</span>
          </Link>
          <Link
            to="/admin/registrations"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-gray-300 hover:text-white bg-[#141A26] border border-[#232B3E] hover:border-brand-500/40 transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Registrations</span>
          </Link>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={CalendarDays}
          value={metrics.totalEvents}
          label="Total Events"
          subtext="Contests & workshops created"
          accentColor="brand"
        />
        <StatCard
          icon={Clock}
          value={metrics.upcomingEvents}
          label="Upcoming Events"
          subtext="Scheduled for this semester"
          accentColor="emerald"
        />
        <StatCard
          icon={Users}
          value={metrics.totalRegistrations}
          label="Total Registrations"
          subtext="Confirmed collegiate coders"
          accentColor="purple"
        />
        <StatCard
          icon={Trophy}
          value={featured ? '1 Active' : 'None'}
          label="Featured Event"
          subtext={featured ? featured.title.slice(0, 30) + '...' : 'No featured event active'}
          accentColor="amber"
        />
      </div>

      {/* TWO COLUMNS: CATEGORY BREAKDOWN & FEATURED EVENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Breakdown */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0F131C] border border-[#1E2638] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2638] pb-3">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-400" />
              Events by Category
            </h3>
            <span className="text-xs text-gray-400 font-mono">
              {categoryBreakdown.length} Domains
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {categoryBreakdown.length === 0 ? (
              <p className="text-xs text-gray-500">No events data available.</p>
            ) : (
              categoryBreakdown.map((item, idx) => {
                const percentage = Math.round((item.count / (metrics.totalEvents || 1)) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-gray-300">{item._id}</span>
                      <span className="text-brand-400 font-semibold">
                        {item.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#141A26] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Year Distribution */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0F131C] border border-[#1E2638] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2638] pb-3">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              Registrations by Academic Year
            </h3>
            <span className="text-xs text-gray-400 font-mono">
              {metrics.totalRegistrations} Total
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {yearBreakdown.length === 0 ? (
              <p className="text-xs text-gray-500">No registrations yet.</p>
            ) : (
              yearBreakdown.map((item, idx) => {
                const percentage = Math.round(
                  (item.count / (metrics.totalRegistrations || 1)) * 100
                );
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-gray-300">{item._id}</span>
                      <span className="text-emerald-400 font-semibold">
                        {item.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#141A26] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* RECENT REGISTRATIONS TABLE */}
      <div className="p-6 rounded-2xl bg-[#0F131C] border border-[#1E2638] space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E2638] pb-4">
          <div>
            <h3 className="text-base font-bold text-white font-mono">
              RECENT REGISTRATIONS
            </h3>
            <p className="text-xs text-gray-400">Latest students securing contest seats</p>
          </div>
          <Link
            to="/admin/registrations"
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 inline-flex items-center gap-1 font-mono"
          >
            <span>View All Registrations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1E2638] text-gray-400 font-mono uppercase text-[11px]">
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Event</th>
                <th className="py-3 px-3">Ticket ID</th>
                <th className="py-3 px-3">Registered At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2638]/60 text-gray-300 font-sans">
              {recentRegs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-500">
                    No registrations found.
                  </td>
                </tr>
              ) : (
                recentRegs.map((reg) => (
                  <tr key={reg._id} className="hover:bg-[#141A26]/50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">{reg.name}</td>
                    <td className="py-3 px-3 text-gray-400 font-mono">{reg.email}</td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-gray-200 truncate max-w-xs block">
                        {reg.eventId?.title || 'Event Removed'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-brand-400 font-bold">
                      {reg.ticketId}
                    </td>
                    <td className="py-3 px-3 text-gray-400 font-mono">
                      {new Date(reg.registeredAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
