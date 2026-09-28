import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Sparkles,
  ExternalLink,
  Users,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
} from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { TableRowSkeleton } from '../components/SkeletonLoader';
import { categoryColors } from '../components/EventCard';

const categories = [
  'Competitive Programming',
  'Hackathon',
  'Workshop',
  'Web Development',
  'AI/ML',
  'Open Source',
  'Gaming',
  'Technical Talk',
];

const initialForm = {
  title: '',
  category: 'Competitive Programming',
  code: '',
  date: '',
  time: '',
  venue: '',
  description: '',
  rules: '',
  eligibility: 'Open to all college students & engineering enthusiasts',
  registrationDeadline: '',
  maxParticipants: 100,
  prizePool: '',
  status: 'Upcoming',
  featured: false,
  image: '',
};

export const AdminEventsPage = () => {
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.getEvents({
        category: categoryFilter !== 'All' ? categoryFilter : undefined,
        search: search.trim() ? search.trim() : undefined,
        sort: 'date-asc',
      });
      setEvents(res?.data || []);
    } catch (err) {
      console.error('Failed to load events:', err);
      toast.error('Failed to fetch events list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchEvents, 200);
    return () => clearTimeout(timer);
  }, [search, categoryFilter]);

  const handleOpenAddModal = () => {
    setEditingEventId(null);
    setFormData(initialForm);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (evt) => {
    setEditingEventId(evt._id);
    setFormData({
      title: evt.title || '',
      category: evt.category || 'Competitive Programming',
      code: evt.code || '',
      date: evt.date ? new Date(evt.date).toISOString().slice(0, 10) : '',
      time: evt.time || '',
      venue: evt.venue || '',
      description: evt.description || '',
      rules: Array.isArray(evt.rules) ? evt.rules.join('\n') : evt.rules || '',
      eligibility: evt.eligibility || '',
      registrationDeadline: evt.registrationDeadline
        ? new Date(evt.registrationDeadline).toISOString().slice(0, 10)
        : '',
      maxParticipants: evt.maxParticipants || 100,
      prizePool: evt.prizePool || '',
      status: evt.status || 'Upcoming',
      featured: Boolean(evt.featured),
      image: evt.image || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Event title is required';
    if (!formData.category) errs.category = 'Category is required';
    if (!formData.date) errs.date = 'Event date is required';
    if (!formData.time.trim()) errs.time = 'Event time window is required';
    if (!formData.venue.trim()) errs.venue = 'Venue location is required';
    if (!formData.description.trim()) errs.description = 'Event description is required';
    if (!formData.registrationDeadline) errs.registrationDeadline = 'Deadline is required';
    if (Number(formData.maxParticipants) < 1) errs.maxParticipants = 'Capacity must be at least 1';

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      const payload = {
        ...formData,
        maxParticipants: Number(formData.maxParticipants),
        rules: formData.rules
          .split('\n')
          .map((r) => r.trim())
          .filter(Boolean),
      };

      if (editingEventId) {
        await api.updateEvent(editingEventId, payload);
        toast.success(`Event "${formData.title}" updated successfully.`);
      } else {
        await api.createEvent(payload);
        toast.success(`New event "${formData.title}" created successfully.`);
      }

      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error('Save event failed:', err);
      toast.error(err.message || 'Failed to save event.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFeatured = async (evt) => {
    try {
      await api.toggleFeaturedEvent(evt._id);
      toast.success(
        evt.featured
          ? `Removed "${evt.title}" from featured.`
          : `Marked "${evt.title}" as featured!`
      );
      fetchEvents();
    } catch (err) {
      console.error('Toggle featured failed:', err);
      toast.error('Failed to update featured status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      await api.deleteEvent(deleteTarget._id);
      toast.success(`Deleted event "${deleteTarget.title}".`);
      setDeleteTarget(null);
      fetchEvents();
    } catch (err) {
      console.error('Delete event failed:', err);
      toast.error(err.message || 'Failed to delete event.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
            EVENTS MANAGEMENT
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Create, modify, and schedule hackathons, algorithmic contests, and technical workshops.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-brand-600 to-crimson-600 hover:from-brand-500 hover:to-crimson-500 shadow-glow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Event</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0F131C] border border-[#1E2638] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title or code..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#141A26] border border-[#232B3E] text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 font-sans"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-mono text-gray-400 uppercase">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#141A26] border border-[#232B3E] text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-brand-500 font-sans cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="rounded-2xl bg-[#0F131C] border border-[#1E2638] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1E2638] text-gray-400 font-mono uppercase text-[11px] bg-[#0A0D14]">
                <th className="py-3.5 px-4">Event Code & Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Schedule</th>
                <th className="py-3.5 px-4">Registered / Max</th>
                <th className="py-3.5 px-4">Featured</th>
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
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-500 font-mono">
                    No events match current filter.
                  </td>
                </tr>
              ) : (
                events.map((evt) => {
                  const style = categoryColors[evt.category] || {
                    badge: 'bg-brand-500/10 text-brand-400 border-brand-500/30',
                  };
                  return (
                    <tr key={evt._id} className="hover:bg-[#141A26]/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-mono font-bold text-gray-400 bg-[#141A26] px-2 py-0.5 rounded border border-[#232B3E]">
                            {evt.code || 'EVT'}
                          </span>
                          <div>
                            <Link
                              to={`/events/${evt.slug || evt._id}`}
                              target="_blank"
                              className="font-bold text-white hover:text-brand-400 transition-colors text-sm"
                            >
                              {evt.title}
                            </Link>
                            <p className="text-[11px] text-gray-500 truncate max-w-sm">
                              {evt.venue}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border ${style.badge}`}
                        >
                          {evt.category}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-mono text-[11px] text-gray-300">
                        <p>{new Date(evt.date).toLocaleDateString()}</p>
                        <p className="text-gray-500 text-[10px]">{evt.time}</p>
                      </td>

                      <td className="py-4 px-4 font-mono">
                        <span className="font-semibold text-white">
                          {evt.currentRegistrations || 0}
                        </span>{' '}
                        <span className="text-gray-500">/ {evt.maxParticipants || 100}</span>
                      </td>

                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleFeatured(evt)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            evt.featured
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                              : 'bg-[#141A26] text-gray-500 hover:text-gray-300 border border-[#232B3E]'
                          }`}
                          title="Toggle featured banner"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{evt.featured ? 'Featured' : 'Mark'}</span>
                        </button>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/events/${evt.slug || evt._id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            title="Preview event"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleOpenEditModal(evt)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-brand-400 hover:bg-brand-500/10 transition-colors"
                            title="Edit event"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(evt)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT EVENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#0F131C] border border-[#1E2638] rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 p-1.5 rounded-lg text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 space-y-1">
              <span className="text-xs font-mono text-brand-400 font-bold uppercase tracking-wider">
                {editingEventId ? 'Edit Event' : 'Create New Event'}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {editingEventId ? formData.title : 'Schedule Club Event or Contest'}
              </h3>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Title & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Event Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. CodeSprint 2026: Algorithmic Championship"
                    className={`w-full px-4 py-2.5 rounded-xl bg-[#141A26] border ${
                      formErrors.title ? 'border-rose-500' : 'border-[#232B3E]'
                    } text-sm text-white focus:outline-none focus:border-brand-500`}
                  />
                  {formErrors.title && (
                    <p className="text-xs text-rose-400 mt-1 font-mono">{formErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Code Badge
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. CP-01"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3E] text-sm text-white focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3E] text-sm text-white focus:outline-none focus:border-brand-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3E] text-sm text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Date, Time, Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Event Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl bg-[#141A26] border ${
                      formErrors.date ? 'border-rose-500' : 'border-[#232B3E]'
                    } text-sm text-white focus:outline-none focus:border-brand-500`}
                  />
                  {formErrors.date && (
                    <p className="text-xs text-rose-400 mt-1 font-mono">{formErrors.date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Time Window <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g. 10:00 AM - 02:00 PM"
                    className={`w-full px-4 py-2.5 rounded-xl bg-[#141A26] border ${
                      formErrors.time ? 'border-rose-500' : 'border-[#232B3E]'
                    } text-sm text-white focus:outline-none focus:border-brand-500`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Venue <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="e.g. Auditorium Hall B"
                    className={`w-full px-4 py-2.5 rounded-xl bg-[#141A26] border ${
                      formErrors.venue ? 'border-rose-500' : 'border-[#232B3E]'
                    } text-sm text-white focus:outline-none focus:border-brand-500`}
                  />
                </div>
              </div>

              {/* Deadline & Max Participants & Prize Pool */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Reg. Deadline <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.registrationDeadline}
                    onChange={(e) =>
                      setFormData({ ...formData, registrationDeadline: e.target.value })
                    }
                    className={`w-full px-4 py-2.5 rounded-xl bg-[#141A26] border ${
                      formErrors.registrationDeadline ? 'border-rose-500' : 'border-[#232B3E]'
                    } text-sm text-white focus:outline-none focus:border-brand-500`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Max Participants <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxParticipants}
                    onChange={(e) =>
                      setFormData({ ...formData, maxParticipants: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3E] text-sm text-white focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Prize Pool
                  </label>
                  <input
                    type="text"
                    value={formData.prizePool}
                    onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                    placeholder="e.g. ₹35,000 + Goodies"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3E] text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive event details..."
                  className={`w-full px-4 py-2.5 rounded-xl bg-[#141A26] border ${
                    formErrors.description ? 'border-rose-500' : 'border-[#232B3E]'
                  } text-sm text-white focus:outline-none focus:border-brand-500`}
                />
              </div>

              {/* Rules (Multiline) */}
              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                  Rules (One per line)
                </label>
                <textarea
                  rows="3"
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                  placeholder="Individual participation only.&#10;Supported languages: C++, Python, Java.&#10;Standard ICPC penalties apply."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3E] text-sm text-white focus:outline-none focus:border-brand-500 font-mono text-xs"
                />
              </div>

              {/* Eligibility */}
              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                  Eligibility Criteria
                </label>
                <input
                  type="text"
                  value={formData.eligibility}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  placeholder="Open to all engineering undergrads..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3E] text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Event Image URL */}
              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                  Banner Image URL <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3E] text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500 bg-[#141A26] border-[#232B3E]"
                />
                <label htmlFor="featured" className="text-sm font-semibold text-white cursor-pointer flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Mark as Flagship Featured Event
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E2638]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-crimson-600 hover:from-brand-500 hover:to-crimson-500 shadow-glow-sm transition-all disabled:opacity-50 active:scale-95"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingEventId ? 'Update Event' : 'Create Event'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? All associated student registrations will also be removed. This cannot be undone.`}
        confirmText="Yes, Delete Event"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
