import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Sparkles, X, AlertCircle } from 'lucide-react';
import { api } from '../api/client';
import { EventCard } from '../components/EventCard';
import { EventCardSkeleton } from '../components/SkeletonLoader';

const categories = [
  'All',
  'Competitive Programming',
  'Hackathon',
  'Workshop',
  'Web Development',
  'AI/ML',
  'Open Source',
  'Gaming',
  'Technical Talk',
];

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('date-asc');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const params = {
          sort: sortOption,
        };
        if (selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        if (dateFilter !== 'all') {
          params.dateFilter = dateFilter;
        }
        if (search.trim()) {
          params.search = search.trim();
        }

        const res = await api.getEvents(params);
        setEvents(res?.data || []);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchEvents, 250);
    return () => clearTimeout(debounce);
  }, [search, selectedCategory, sortOption, dateFilter]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSortOption('date-asc');
    setDateFilter('all');
  };

  return (
    <div className="min-h-screen pt-32 pb-24 relative">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-radial-glow pointer-events-none opacity-60" />
      <div className="absolute inset-0 bg-subtle-grid pointer-events-none opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-mono font-medium">
            <span>OFFICIAL CALENDAR</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Club Events & Contests
          </h1>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Discover upcoming hackathons, algorithmic contests, system design workshops, and community events organized by CodeChef Campus Club.
          </p>
        </div>

        {/* Filter and Search Bar Container */}
        <div className="p-6 rounded-2xl bg-dark-card/90 border border-dark-border/90 shadow-xl mb-10 space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events by title, topic, or venue..."
                className="w-full pl-11 pr-10 py-2.5 rounded-xl bg-dark-surface border border-dark-border text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors font-sans"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Date Filter & Sort Dropdown */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-400 uppercase">When:</span>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-dark-surface border border-dark-border text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-brand-500 font-sans cursor-pointer"
                >
                  <option value="all">All Dates</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                  <option value="past">Past Events</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-400 uppercase">Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-dark-surface border border-dark-border text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-brand-500 font-sans cursor-pointer"
                >
                  <option value="date-asc">Upcoming First</option>
                  <option value="date-desc">Latest Date First</option>
                  <option value="title-asc">Alphabetical (A-Z)</option>
                  <option value="newest">Recently Created</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                    isSelected
                      ? 'bg-gradient-to-r from-brand-600 to-crimson-600 text-white shadow-glow-sm'
                      : 'bg-dark-surface hover:bg-dark-cardHover text-gray-400 hover:text-gray-200 border border-dark-border'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Metadata */}
        <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-6">
          <span>
            SHOWING <strong className="text-white">{events.length}</strong> EVENTS
            {selectedCategory !== 'All' && ` IN ${selectedCategory.toUpperCase()}`}
          </span>
          {(search || selectedCategory !== 'All' || dateFilter !== 'all') && (
            <button
              onClick={handleClearFilters}
              className="text-brand-400 hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Reset filters
            </button>
          )}
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-dark-card/50 border border-dark-border/80 rounded-3xl p-8 max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center mx-auto text-brand-400">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">No events match your criteria</h3>
            <p className="text-sm text-gray-400">
              Try adjusting your search keywords or switching category filters to view all scheduled events.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-5 py-2.5 rounded-xl bg-dark-surface hover:bg-brand-500 text-sm font-semibold text-white border border-dark-border hover:border-brand-500 transition-colors inline-block"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
