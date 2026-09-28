import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  ShieldCheck,
  ArrowLeft,
  Share2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Ticket,
  CalendarPlus,
  Loader2,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api, ApiError } from '../api/client';
import { CountdownTimer } from '../components/CountdownTimer';
import { useToast } from '../context/ToastContext';
import { categoryColors } from '../components/EventCard';

export const EventDetailPage = () => {
  const { id } = useParams();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Registration Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: 'ABES Engineering College',
    year: '2nd Year',
    phone: '',
    branch: 'Computer Science & Engineering',
    rollNumber: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Success Experience State
  const [registrationSuccess, setRegistrationSuccess] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await api.getEventById(id);
        if (res?.data) {
          setEvent(res.data);
        } else {
          setError('Event not found');
        }
      } catch (err) {
        console.error('Fetch event detail failed:', err);
        setError(err.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Please provide a valid email address';
    }
    if (!formData.college.trim()) errors.college = 'College/University name is required';
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (formData.phone.replace(/[^0-9]/g, '').length < 8) {
      errors.phone = 'Please enter a valid phone number (at least 8 digits)';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        eventId: event._id,
      };

      const res = await api.registerForEvent(payload);

      // Trigger Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F97316', '#EF4444', '#10B981', '#38BDF8'],
      });

      setRegistrationSuccess(res.data);
      setIsModalOpen(false);

      // Refresh event registration count
      setEvent((prev) => ({
        ...prev,
        currentRegistrations: (prev.currentRegistrations || 0) + 1,
        seatsLeft: Math.max(0, (prev.seatsLeft || 1) - 1),
      }));

      toast.success('Registration Confirmed! Your seat is secured.');
    } catch (err) {
      console.error('Registration failed:', err);
      if (err.status === 409) {
        toast.error(err.message || 'You are already registered for this event.');
      } else {
        toast.error(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out ${event.title} at CodeChef Campus Club!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info('Event link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          <p className="text-sm font-mono text-gray-400">Loading contest information...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen pt-36 pb-20 max-w-xl mx-auto px-4 text-center">
        <div className="p-8 rounded-3xl bg-dark-card border border-dark-border space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Event Not Found</h2>
          <p className="text-sm text-gray-400">
            {error || 'The event you are looking for does not exist or may have been removed.'}
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-500 text-white font-semibold text-sm hover:bg-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Events
          </Link>
        </div>
      </div>
    );
  }

  const colorStyle = categoryColors[event.category] || {
    badge: 'bg-brand-500/10 text-brand-400 border-brand-500/30',
    bar: 'bg-brand-500',
  };

  const isDeadlinePassed = new Date() > new Date(event.registrationDeadline);
  const isSoldOut = event.seatsLeft <= 0;
  const max = event.maxParticipants || 100;
  const current = event.currentRegistrations || 0;
  const percentage = Math.min(100, Math.round((current / max) * 100));

  return (
    <div className="min-h-screen pt-28 pb-24 relative">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-radial-glow pointer-events-none opacity-50" />
      <div className="absolute inset-0 bg-subtle-grid pointer-events-none opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb / Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events Calendar
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border text-xs text-gray-300 hover:text-white hover:border-brand-500/30 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share Event
          </button>
        </div>

        {/* Event Banner Media */}
        {event.image && (
          <div className="mb-6 rounded-3xl overflow-hidden max-h-72 border border-dark-border/80 relative shadow-2xl">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover max-h-72"
              onError={(e) => {
                e.currentTarget.parentElement.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D13] via-transparent to-transparent opacity-90" />
          </div>
        )}

        {/* Hero Banner Card */}
        <div className="rounded-3xl bg-dark-card border border-dark-border/90 p-6 sm:p-10 shadow-2xl mb-10 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`px-3 py-1 text-xs font-semibold rounded-lg border ${colorStyle.badge}`}>
                  {event.category}
                </span>
                <span className="text-xs font-mono font-bold text-gray-400 bg-dark-surface px-2.5 py-1 rounded border border-dark-border">
                  {event.code || 'CC-EVT'}
                </span>
                {event.featured && (
                  <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    <Sparkles className="w-3 h-3" />
                    Featured Event
                  </span>
                )}
                {event.prizePool && (
                  <span className="px-3 py-1 text-xs font-mono font-semibold rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    🏆 {event.prizePool}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {event.title}
              </h1>

              {/* Event Metadata Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-300 bg-dark-surface/70 p-4 rounded-2xl border border-dark-border/80">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-brand-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-mono">Date</p>
                    <p className="font-semibold text-white">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-brand-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-mono">Time Window</p>
                    <p className="font-semibold text-white truncate">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-mono">Venue</p>
                    <p className="font-semibold text-white truncate">{event.venue}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Live Countdown */}
            <div className="lg:col-span-4 bg-dark-surface/80 border border-dark-border p-6 rounded-2xl flex flex-col justify-center">
              <CountdownTimer targetDate={event.date} title="Contest Commences In" />

              <div className="mt-6 pt-5 border-t border-dark-border/80 space-y-2 text-xs font-mono text-gray-400">
                <div className="flex justify-between">
                  <span>Registration Deadline:</span>
                  <span className={isDeadlinePassed ? 'text-rose-400 font-bold' : 'text-brand-400 font-bold'}>
                    {new Date(event.registrationDeadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Max Capacity:</span>
                  <span className="text-white font-semibold">{max} Coders</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Details Grid: Description, Rules, and Sidebar Registration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Details & Rules */}
          <div className="lg:col-span-8 space-y-8">
            {/* Description */}
            <div className="p-6 sm:p-8 rounded-2xl bg-dark-card border border-dark-border/80 space-y-4">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>About this Event</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Rules & Guidelines */}
            {event.rules && event.rules.length > 0 && (
              <div className="p-6 sm:p-8 rounded-2xl bg-dark-card border border-dark-border/80 space-y-4">
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-brand-400" />
                  <span>Contest Rules & Regulations</span>
                </h2>
                <ul className="space-y-3 text-sm text-gray-300">
                  {event.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-brand-500/10 text-brand-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-brand-500/20">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Eligibility */}
            <div className="p-6 sm:p-8 rounded-2xl bg-dark-card border border-dark-border/80 space-y-3">
              <h2 className="text-xl font-bold text-white tracking-tight">Participant Eligibility</h2>
              <p className="text-sm text-gray-300 leading-relaxed bg-dark-surface/60 p-4 rounded-xl border border-dark-border">
                {event.eligibility}
              </p>
            </div>
          </div>

          {/* Right Sticky Sidebar: Registration Box */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 p-6 sm:p-8 rounded-2xl bg-dark-card border border-dark-border/90 shadow-2xl space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">
                  Live Registration Status
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-white font-mono">
                    {event.seatsLeft}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    of {max} seats remaining
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-dark-surface rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${colorStyle.bar}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-[11px] text-gray-400 font-mono text-right">
                  {percentage}% capacity filled
                </p>
              </div>

              {/* Status and CTA */}
              <div className="pt-2 border-t border-dark-border/70 space-y-3">
                {isDeadlinePassed ? (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-center text-xs font-mono font-semibold">
                    Registration closed. Deadline has passed.
                  </div>
                ) : isSoldOut ? (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-center text-xs font-mono font-semibold">
                    Event is fully booked. Maximum capacity reached.
                  </div>
                ) : (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 via-brand-500 to-crimson-600 hover:from-brand-500 hover:to-crimson-500 shadow-glow-md hover:shadow-glow-lg transition-all duration-200 active:scale-95"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>Register for Event</span>
                  </button>
                )}

                <div className="text-[11px] text-gray-400 text-center font-mono">
                  Free registration • Verified CodeChef Campus Club entry
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REGISTRATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-xl bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-dark-surface"
              aria-label="Close registration modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 space-y-1">
              <span className="text-xs font-mono text-brand-400 font-bold uppercase tracking-wider">
                Event Registration
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {event.title}
              </h3>
              <p className="text-xs text-gray-400">
                Please enter your academic credentials to generate your event ticket.
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className={`w-full px-4 py-2.5 rounded-xl bg-dark-surface border ${
                    formErrors.name ? 'border-rose-500' : 'border-dark-border'
                  } text-sm text-white focus:outline-none focus:border-brand-500`}
                />
                {formErrors.name && (
                  <p className="text-xs text-rose-400 mt-1 font-mono">{formErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. yourname@college.edu"
                  className={`w-full px-4 py-2.5 rounded-xl bg-dark-surface border ${
                    formErrors.email ? 'border-rose-500' : 'border-dark-border'
                  } text-sm text-white focus:outline-none focus:border-brand-500`}
                />
                {formErrors.email && (
                  <p className="text-xs text-rose-400 mt-1 font-mono">{formErrors.email}</p>
                )}
              </div>

              {/* College & Academic Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    College / University <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    placeholder="e.g. ABES Engineering College"
                    className={`w-full px-4 py-2.5 rounded-xl bg-dark-surface border ${
                      formErrors.college ? 'border-rose-500' : 'border-dark-border'
                    } text-sm text-white focus:outline-none focus:border-brand-500`}
                  />
                  {formErrors.college && (
                    <p className="text-xs text-rose-400 mt-1 font-mono">{formErrors.college}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Academic Year <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-surface border border-dark-border text-sm text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="1st Year">1st Year (Freshman)</option>
                    <option value="2nd Year">2nd Year (Sophomore)</option>
                    <option value="3rd Year">3rd Year (Junior)</option>
                    <option value="4th Year">4th Year (Senior)</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Phone & Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 9876543210"
                    className={`w-full px-4 py-2.5 rounded-xl bg-dark-surface border ${
                      formErrors.phone ? 'border-rose-500' : 'border-dark-border'
                    } text-sm text-white focus:outline-none focus:border-brand-500`}
                  />
                  {formErrors.phone && (
                    <p className="text-xs text-rose-400 mt-1 font-mono">{formErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Branch / Major
                  </label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    placeholder="e.g. CSE / IT / ECE"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-surface border border-dark-border text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Roll Number (Optional) */}
              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                  Student Roll / Registration No. <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  placeholder="e.g. CS23B1042"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-surface border border-dark-border text-sm text-white focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-dark-border/80">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white bg-dark-surface hover:bg-dark-cardHover border border-dark-border transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-crimson-600 hover:from-brand-500 hover:to-crimson-500 shadow-glow-sm transition-all disabled:opacity-50 active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirming...</span>
                    </>
                  ) : (
                    <span>Confirm Registration</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REGISTRATION SUCCESS MODAL / EXPERIENCE */}
      {registrationSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-dark-card border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-glow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                Registration Confirmed
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                You're In! Seat Confirmed.
              </h3>
              <p className="text-sm text-gray-300">
                Your entry ticket has been generated for <strong>{registrationSuccess.event?.title}</strong>.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="p-5 rounded-2xl bg-dark-surface/90 border border-dashed border-dark-border text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-dark-border pb-2">
                <span className="text-gray-400 uppercase">Ticket ID</span>
                <span className="text-brand-400 font-bold text-sm tracking-wider">
                  {registrationSuccess.registration?.ticketId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Participant:</span>
                <span className="text-white font-sans font-semibold">
                  {registrationSuccess.registration?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-gray-200">{registrationSuccess.registration?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Venue:</span>
                <span className="text-gray-200">{registrationSuccess.event?.venue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Time:</span>
                <span className="text-gray-200">{registrationSuccess.event?.time}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                  registrationSuccess.event?.title || 'CodeChef Campus Contest'
                )}&details=${encodeURIComponent(
                  `Ticket Confirmed: ${registrationSuccess.registration?.ticketId}\nTime: ${registrationSuccess.event?.time}`
                )}&location=${encodeURIComponent(registrationSuccess.event?.venue || '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 transition-colors"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Add to Google Calendar</span>
              </a>
              <button
                onClick={() => setRegistrationSuccess(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-gray-300 hover:text-white bg-dark-surface hover:bg-dark-cardHover border border-dark-border transition-colors"
              >
                Close
              </button>
              <Link
                to="/events"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-brand-600 to-crimson-600 hover:from-brand-500 hover:to-crimson-500 shadow-glow-sm"
              >
                Back to Events
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
