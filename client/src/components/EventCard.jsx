import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const categoryColors = {
  'Competitive Programming': {
    badge: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    bar: 'bg-orange-500',
  },
  'Hackathon': {
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    bar: 'bg-emerald-500',
  },
  'Workshop': {
    badge: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    bar: 'bg-sky-500',
  },
  'Web Development': {
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    bar: 'bg-amber-500',
  },
  'AI/ML': {
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    bar: 'bg-purple-500',
  },
  'Open Source': {
    badge: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    bar: 'bg-teal-500',
  },
  'Gaming': {
    badge: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    bar: 'bg-pink-500',
  },
  'Technical Talk': {
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    bar: 'bg-indigo-500',
  },
};

export const EventCard = ({ event }) => {
  const colorStyle = categoryColors[event.category] || {
    badge: 'bg-brand-500/10 text-brand-400 border-brand-500/30',
    bar: 'bg-brand-500',
  };

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isDeadlinePassed = new Date() > new Date(event.registrationDeadline);
  const max = event.maxParticipants || 100;
  const current = event.currentRegistrations || 0;
  const percentage = Math.min(100, Math.round((current / max) * 100));
  const isSoldOut = current >= max;

  return (
    <div className="group relative flex flex-col justify-between bg-dark-card/90 hover:bg-dark-cardHover/90 border border-dark-border hover:border-brand-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-glow-sm hover:-translate-y-1">
      {/* Top Banner with Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${colorStyle.badge}`}
            >
              {event.category}
            </span>
            {event.featured && (
              <span className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            )}
          </div>
          <span className="text-xs font-mono font-bold text-gray-400 bg-dark-surface px-2 py-0.5 rounded border border-dark-border">
            {event.code || 'CC-EVT'}
          </span>
        </div>

        {/* Title */}
        <Link to={`/events/${event.slug || event._id}`} className="block group-hover:text-brand-400 transition-colors">
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight line-clamp-2 leading-snug mb-3">
            {event.title}
          </h3>
        </Link>

        {/* Short description */}
        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-5">
          {event.description}
        </p>

        {/* Metadata info */}
        <div className="space-y-2.5 text-xs text-gray-300 mb-6 bg-dark-surface/50 p-3 rounded-xl border border-dark-border/60">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-brand-400 shrink-0" />
            <span className="font-medium text-gray-200">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-brand-400 shrink-0" />
            <span className="truncate">{event.time}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>
      </div>

      {/* Footer / Seats & CTA */}
      <div>
        {/* Status Indicator & Registration Fill Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] mb-1.5 font-mono">
            {isDeadlinePassed ? (
              <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                Registration Closed
              </span>
            ) : isSoldOut ? (
              <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Event Full
              </span>
            ) : (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Registration Open
              </span>
            )}

            <span className="text-gray-300 font-semibold">
              {current} / {max} ({percentage}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-dark-surface rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isDeadlinePassed
                  ? 'bg-gray-600'
                  : isSoldOut
                  ? 'bg-amber-500'
                  : colorStyle.bar
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Link
            to={`/events/${event.slug || event._id}`}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
              isDeadlinePassed
                ? 'bg-dark-surface hover:bg-dark-cardHover text-gray-400 border border-dark-border'
                : isSoldOut
                ? 'bg-dark-surface hover:bg-dark-cardHover text-amber-300 border border-amber-500/30'
                : 'text-white bg-gradient-to-r from-brand-600 to-crimson-600 hover:from-brand-500 hover:to-crimson-500 shadow-glow-sm'
            }`}
          >
            <span>
              {isDeadlinePassed
                ? 'Registration Closed'
                : isSoldOut
                ? 'Event Full • Details'
                : 'Register Now'}
            </span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};
