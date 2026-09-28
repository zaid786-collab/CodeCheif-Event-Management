import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  GraduationCap,
  X,
  Ticket,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { TableRowSkeleton } from '../components/SkeletonLoader';

const years = ['All', '1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate', 'Other'];

export const AdminRegistrationsPage = () => {
  const toast = useToast();
  const [registrations, setRegistrations] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  // View Ticket Details Modal
  const [activeTicket, setActiveTicket] = useState(null);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const params = {
        limit: 100,
      };
      if (selectedEventId !== 'All') params.eventId = selectedEventId;
      if (selectedYear !== 'All') params.year = selectedYear;
      if (search.trim()) params.search = search.trim();

      const [regRes, eventsRes] = await Promise.all([
        api.getRegistrations(params),
        api.getEvents({ limit: 100 }),
      ]);

      setRegistrations(regRes?.data || []);
      setEventsList(eventsRes?.data || []);
    } catch (err) {
      console.error('Failed to load registrations:', err);
      toast.error('Failed to load registration list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchRegistrations, 200);
    return () => clearTimeout(timer);
  }, [search, selectedEventId, selectedYear]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      await api.deleteRegistration(deleteTarget._id);
      toast.success(`Registration for ${deleteTarget.name} removed.`);
      setDeleteTarget(null);
      fetchRegistrations();
    } catch (err) {
      console.error('Delete registration error:', err);
      toast.error(err.message || 'Failed to remove registration.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCSV = () => {
    if (registrations.length === 0) {
      toast.info('No registrations to export.');
      return;
    }

    const headers = [
      'Ticket ID',
      'Student Name',
      'Email',
      'Phone',
      'College',
      'Year',
      'Branch',
      'Roll Number',
      'Event Title',
      'Event Code',
      'Registered Date',
    ];

    const rows = registrations.map((r) => [
      r.ticketId || '',
      `"${r.name || ''}"`,
      r.email || '',
      r.phone || '',
      `"${r.college || ''}"`,
      r.year || '',
      `"${r.branch || ''}"`,
      r.rollNumber || '',
      `"${r.eventId?.title || 'Unknown'}"`,
      r.eventId?.code || '',
      new Date(r.registeredAt).toISOString(),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `codechef_club_registrations_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${registrations.length} registrations to CSV.`);
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
            REGISTRATIONS DESK
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Browse, search, inspect, and export student contest registrations.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-dark-card hover:bg-dark-cardHover border border-dark-border hover:border-brand-500/40 shadow-sm transition-all active:scale-95"
        >
          <Download className="w-4 h-4 text-brand-400" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0F131C] border border-[#1E2638] flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full lg:max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, roll no, ticket..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#141A26] border border-[#232B3E] text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 font-sans"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Event Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-400 uppercase">Event:</span>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#141A26] border border-[#232B3E] text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-brand-500 font-sans cursor-pointer max-w-[200px] truncate"
            >
              <option value="All">All Events</option>
              {eventsList.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.code ? `[${e.code}] ` : ''}
                  {e.title}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-400 uppercase">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#141A26] border border-[#232B3E] text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-brand-500 font-sans cursor-pointer"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="rounded-2xl bg-[#0F131C] border border-[#1E2638] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1E2638] text-gray-400 font-mono uppercase text-[11px] bg-[#0A0D14]">
                <th className="py-3.5 px-4">Student Details</th>
                <th className="py-3.5 px-4">Event</th>
                <th className="py-3.5 px-4">Academic Info</th>
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2638]/70 text-gray-300">
              {loading ? (
                <>
                  <TableRowSkeleton columns={6} />
                  <TableRowSkeleton columns={6} />
                  <TableRowSkeleton columns={6} />
                </>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-500 font-mono">
                    No registrations found.
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr key={reg._id} className="hover:bg-[#141A26]/50 transition-colors">
                    {/* Student Name & Contact */}
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold text-white text-sm">{reg.name}</p>
                        <p className="text-gray-400 font-mono text-[11px]">{reg.email}</p>
                        <p className="text-gray-500 text-[10px]">{reg.phone}</p>
                      </div>
                    </td>

                    {/* Event Title */}
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-200 block truncate max-w-xs">
                        {reg.eventId?.title || 'Unknown Event'}
                      </span>
                      {reg.eventId?.category && (
                        <span className="text-[10px] text-brand-400 font-mono">
                          {reg.eventId.category}
                        </span>
                      )}
                    </td>

                    {/* College & Year */}
                    <td className="py-4 px-4 text-[11px]">
                      <p className="text-gray-300 truncate max-w-[180px]">{reg.college}</p>
                      <p className="text-gray-400 font-mono">
                        {reg.year} {reg.rollNumber ? `• ${reg.rollNumber}` : ''}
                      </p>
                    </td>

                    {/* Ticket ID */}
                    <td className="py-4 px-4 font-mono font-bold text-brand-400">
                      {reg.ticketId}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 font-mono text-gray-400 text-[11px]">
                      {new Date(reg.registeredAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setActiveTicket(reg)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                          title="View Ticket Credentials"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(reg)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Remove Registration"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW TICKET MODAL */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0F131C] border border-[#1E2638] rounded-3xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setActiveTicket(null)}
              className="absolute right-6 top-6 p-1.5 rounded-lg text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-brand-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Ticket className="w-4 h-4" />
              <span>Participant Ticket Record</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#141A26] border border-dashed border-[#232B3E] space-y-2.5 font-mono text-xs">
              <div className="flex justify-between border-b border-[#232B3E] pb-2">
                <span className="text-gray-400 uppercase">Ticket ID:</span>
                <span className="text-brand-400 font-bold text-sm">
                  {activeTicket.ticketId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span className="text-white font-sans font-semibold">{activeTicket.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-gray-200">{activeTicket.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Phone:</span>
                <span className="text-gray-200">{activeTicket.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">College:</span>
                <span className="text-gray-200 truncate max-w-[200px]">{activeTicket.college}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Academic Year:</span>
                <span className="text-gray-200">{activeTicket.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Branch:</span>
                <span className="text-gray-200">{activeTicket.branch || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Roll Number:</span>
                <span className="text-gray-200">{activeTicket.rollNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-t border-[#232B3E] pt-2">
                <span className="text-gray-400">Event:</span>
                <span className="text-white font-sans font-medium truncate max-w-[200px]">
                  {activeTicket.eventId?.title}
                </span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setActiveTicket(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#141A26] hover:bg-dark-cardHover border border-[#232B3E]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Cancel Registration"
        message={`Are you sure you want to cancel the registration for "${deleteTarget?.name}" (${deleteTarget?.email})? This seat will be freed up.`}
        confirmText="Yes, Cancel Registration"
        cancelText="Keep"
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
