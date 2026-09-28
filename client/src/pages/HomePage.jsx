import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Terminal,
  Trophy,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  Zap,
  BookOpen,
  Cpu,
  Globe,
  Layers,
  ChevronRight,
  Flame,
  Award,
  Clock,
  MapPin,
  ShieldCheck,
  X,
  ExternalLink,
} from 'lucide-react';
import { api } from '../api/client';
import { EventCard } from '../components/EventCard';
import { CountdownTimer } from '../components/CountdownTimer';
import { CodeTerminal } from '../components/CodeTerminal';
import { StatCard } from '../components/StatCard';
import { EventCardSkeleton } from '../components/SkeletonLoader';

export const HomePage = () => {
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [clubStats, setClubStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featRes, eventsRes, statsRes] = await Promise.all([
          api.getFeaturedEvent().catch((err) => {
            console.warn('Could not fetch featured event:', err.message);
            return { data: null };
          }),
          api.getEvents({ limit: 6, sort: 'date-asc' }).catch((err) => {
            console.warn('Could not fetch upcoming events:', err.message);
            return { data: [] };
          }),
          api.getClubOverviewStats().catch(() => null),
        ]);

        if (featRes?.data) {
          setFeaturedEvent(featRes.data);
        }
        if (eventsRes?.data) {
          setUpcomingEvents(eventsRes.data);
        }
        if (statsRes?.data) {
          setClubStats(statsRes.data);
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const domains = [
    {
      title: 'Competitive Programming',
      desc: 'Master DSA, algorithmic paradigms, time-space complexities, and represent the college in ACM-ICPC and CodeChef global contests.',
      icon: Trophy,
      code: 'DOM-01',
      badge: 'CP & Algorithms',
    },
    {
      title: 'Data Structures & Algorithms',
      desc: 'Deep dive into Trees, Graphs, Dynamic Programming, Segment Trees, and Disjoint Set Unions with hands-on practice sets.',
      icon: Layers,
      code: 'DOM-02',
      badge: 'Core DSA',
    },
    {
      title: 'Full-Stack Web Engineering',
      desc: 'Build scalable, production-grade applications using modern web technologies, resilient backend architectures, and clean APIs.',
      icon: Globe,
      code: 'DOM-03',
      badge: 'Web Systems',
    },
    {
      title: 'Hackathons & Sprint Contests',
      desc: 'Form high-performing teams, build functional prototypes in 24-48 hours, and compete for industry awards and venture incubation.',
      icon: Zap,
      code: 'DOM-04',
      badge: 'Rapid Prototyping',
    },
    {
      title: 'AI Systems & Agents',
      desc: 'Explore agentic workflows, LLM orchestration, vector databases, and real-time machine intelligence integration.',
      icon: Cpu,
      code: 'DOM-05',
      badge: 'Applied AI',
    },
    {
      title: 'Open Source & Peer Learning',
      desc: 'Collaborate on open repositories, participate in Hacktoberfest, conduct code reviews, and learn through senior mentorship.',
      icon: Users,
      code: 'DOM-06',
      badge: 'Community',
    },
  ];

  const roadmapSteps = [
    { step: '01', title: 'Learn', desc: 'Master foundational algorithms, languages, and modern tools through curated workshops.' },
    { step: '02', title: 'Practice', desc: 'Solve weekly problem sets on CodeChef, analyze editorial solutions, and optimize.' },
    { step: '03', title: 'Compete', desc: 'Participate in ranked campus contests, debugging duels, and external hackathons.' },
    { step: '04', title: 'Build', desc: 'Translate algorithmic intuition into real-world software and open-source packages.' },
    { step: '05', title: 'Lead', desc: 'Mentor juniors, host chapter contests, conduct technical talks, and lead project tracks.' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-radial-glow pointer-events-none" />
      <div className="absolute inset-0 bg-subtle-grid pointer-events-none opacity-40" />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-mono font-medium">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                <span>OFFICIAL COLLEGE CODECHEF CHAPTER</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
                  Code. <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-orange-400 to-crimson-500">Compete.</span> Create.
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 font-medium">
                  Where curious minds turn problems into solutions.
                </p>
              </div>

              <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-xl">
                CodeChef Campus Club is the premier collegiate developer community dedicated to competitive programming, system design, algorithm mastery, and building production-grade software. We bridge theoretical computer science with real-world engineering.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/events"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 via-brand-500 to-crimson-600 hover:from-brand-500 hover:to-crimson-500 shadow-glow-md hover:shadow-glow-lg transition-all duration-200 active:scale-95 group"
                >
                  <span>Explore Events</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsCommunityModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-gray-300 hover:text-white bg-dark-card hover:bg-dark-cardHover border border-dark-border hover:border-brand-500/40 transition-all duration-200 group active:scale-95"
                >
                  <span>Join the Community</span>
                  <Users className="w-4 h-4 text-brand-400 group-hover:scale-110 transition-transform" />
                </button>
              </div>

              {/* Quick Perks / Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-gray-400 font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>500+ Active Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-400" />
                  <span>Weekly CodeChef Contests</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-sky-400" />
                  <span>Verified Certificates</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Element: Live Terminal / Judge */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/30 to-crimson-500/30 rounded-3xl blur-xl opacity-60 pointer-events-none" />
              <CodeTerminal />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: CLUB STATS */}
      <section className="py-12 border-y border-dark-border/80 bg-dark-surface/40 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard
              icon={Users}
              value={clubStats ? `${clubStats.activeMembers}+` : '500+'}
              label="Active Members"
              subtext="Collegiate programmers across all academic years"
              accentColor="brand"
            />
            <StatCard
              icon={Calendar}
              value={clubStats ? `${clubStats.totalEvents}+` : '25+'}
              label="Chapter Contests"
              subtext="Hackathons, algorithmic sprints, and bootcamps"
              accentColor="emerald"
            />
            <StatCard
              icon={Trophy}
              value={clubStats ? `${clubStats.hackathonsWon}` : '12'}
              label="Hackathons Won"
              subtext="National and inter-college championship trophies"
              accentColor="amber"
            />
            <StatCard
              icon={Code2}
              value={clubStats ? `${clubStats.problemsSolved}` : '40k+'}
              label="Problems Solved"
              subtext="Combined algorithmic submissions on CodeChef judge"
              accentColor="purple"
            />
          </div>
          <p className="text-[11px] font-mono text-gray-500 text-center mt-5">
            * Chapter milestones and metrics dynamically synchronized with active contest records.
          </p>
        </div>
      </section>

      {/* SECTION 9: FEATURED EVENT BANNER */}
      {featuredEvent && (
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  FLAGSHIP HIGHLIGHT
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Featured Club Event
                </h2>
              </div>
              <Link
                to="/events"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors"
              >
                <span>View all events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Featured Event Card */}
            <div className="relative rounded-3xl bg-gradient-to-br from-dark-card via-dark-card to-dark-surface border border-brand-500/40 p-6 sm:p-10 shadow-2xl overflow-hidden group">
              {/* Background ambient gradient glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-brand-500/15 text-brand-400 border border-brand-500/30">
                      {featuredEvent.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-gray-400 bg-dark-surface px-2.5 py-1 rounded border border-dark-border">
                      {featuredEvent.code || 'CP-01'}
                    </span>
                    {featuredEvent.prizePool && (
                      <span className="px-3 py-1 text-xs font-mono font-semibold rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Prize: {featuredEvent.prizePool}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {featuredEvent.title}
                  </h3>

                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {featuredEvent.description}
                  </p>

                  {/* Metadata Chips */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-300 bg-dark-surface/60 p-4 rounded-2xl border border-dark-border/80">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-brand-400 shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-mono">Date</p>
                        <p className="font-semibold text-white">
                          {new Date(featuredEvent.date).toLocaleDateString('en-US', {
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
                        <p className="text-[10px] text-gray-400 uppercase font-mono">Time</p>
                        <p className="font-semibold text-white truncate">{featuredEvent.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-mono">Venue</p>
                        <p className="font-semibold text-white truncate">{featuredEvent.venue}</p>
                      </div>
                    </div>
                  </div>

                  {/* Live Countdown & Register CTA */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
                    <Link
                      to={`/events/${featuredEvent.slug || featuredEvent._id}`}
                      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-crimson-600 hover:from-brand-500 hover:to-crimson-500 shadow-glow-md hover:shadow-glow-lg transition-all duration-200 active:scale-95 text-center"
                    >
                      <span>Register for Event</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>{featuredEvent.seatsLeft} of {featuredEvent.maxParticipants} seats remaining</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Countdown HUD */}
                <div className="lg:col-span-5 bg-dark-bg/80 border border-dark-border rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-inner flex flex-col justify-center">
                  <CountdownTimer
                    targetDate={featuredEvent.date}
                    title="Contest Kickoff Countdown"
                  />

                  <div className="mt-6 pt-6 border-t border-dark-border/80 space-y-2 text-xs text-gray-400 font-mono">
                    <div className="flex justify-between">
                      <span>Eligibility:</span>
                      <span className="text-gray-200">{featuredEvent.eligibility?.slice(0, 28)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Registration Closes:</span>
                      <span className="text-brand-400 font-semibold">
                        {new Date(featuredEvent.registrationDeadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 8: CLUB INTRODUCTION & DOMAINS */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono font-bold text-brand-400 uppercase tracking-widest bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
              Domains & Curriculum
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for Aspiring Problem Solvers
            </h2>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              We empower students with the mathematical rigor of competitive programming and the architectural experience of modern software engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map((domain, idx) => {
              const Icon = domain.icon;
              return (
                <div
                  key={idx}
                  className="group relative p-6 rounded-2xl bg-dark-card/70 border border-dark-border hover:border-brand-500/40 transition-all duration-300 hover:shadow-glow-sm hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-gray-400 bg-dark-surface px-2 py-0.5 rounded border border-dark-border">
                      {domain.code}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">
                    {domain.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    {domain.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ROADMAP: Learn -> Practice -> Compete -> Build -> Lead */}
          <div className="mt-20 p-8 sm:p-10 rounded-3xl bg-dark-surface/50 border border-dark-border/80">
            <div className="text-center mb-10">
              <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">
                The Member Journey
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Learn → Practice → Compete → Build → Lead
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {roadmapSteps.map((step, index) => (
                <div
                  key={index}
                  className="relative p-5 rounded-2xl bg-dark-card border border-dark-border/80 space-y-2 group hover:border-brand-500/40 transition-all"
                >
                  <span className="text-2xl font-black font-mono text-brand-500/30 group-hover:text-brand-500 transition-colors">
                    {step.step}
                  </span>
                  <h4 className="text-base font-bold text-white">{step.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: UPCOMING EVENTS GRID */}
      <section className="py-20 relative bg-dark-surface/30 border-t border-dark-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-brand-400 uppercase tracking-widest bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
                Calendar & Contests
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Upcoming Chapter Events
              </h2>
              <p className="text-sm text-gray-400">
                Register early. All contests are tracked on the campus rating leaderboard.
              </p>
            </div>

            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-gray-300 hover:text-white bg-dark-card hover:bg-dark-cardHover border border-dark-border hover:border-brand-500/40 transition-all self-start sm:self-auto"
            >
              <span>View All Events</span>
              <ArrowRight className="w-4 h-4 text-brand-400" />
            </Link>
          </div>

          {/* Event Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-16 bg-dark-card/40 rounded-2xl border border-dark-border/60">
              <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">Nothing on the calendar yet.</h3>
              <p className="text-sm text-gray-400 mt-1">Check back soon for upcoming contest announcements.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((evt) => (
                <EventCard key={evt._id} event={evt} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 29: TERMINAL & CODING ACTIVITY SHOWCASE */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-dark-card via-[#121622] to-dark-card border border-dark-border relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-mono font-bold text-brand-400 tracking-widest uppercase">
                  Competitive Ecosystem
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Ready to test your algorithms against the best?
                </h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Join 500+ active campus coders. Gain access to private CodeChef practice problem sets, weekly editorial walkthroughs, mock technical interviews, and team hackathon rosters.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    to="/events"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-brand-600 to-crimson-600 hover:from-brand-500 hover:to-crimson-500 shadow-glow-sm"
                  >
                    <span>Register for Next Contest</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/about"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm text-gray-300 hover:text-white bg-dark-surface border border-dark-border"
                  >
                    <span>Learn About the Club</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 bg-dark-bg/90 border border-dark-border/80 p-5 rounded-2xl font-mono text-xs text-gray-300 space-y-3">
                <div className="flex items-center justify-between border-b border-dark-border pb-2 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-brand-400" />
                    bash - codechef-cli
                  </span>
                  <span className="text-emerald-400 font-semibold">ONLINE</span>
                </div>
                <div className="space-y-1.5 text-gray-300">
                  <p className="text-gray-500">$ codechef-club --status</p>
                  <p className="text-brand-400">✔ Chapter: ABES Engineering College Campus Chapter #412</p>
                  <p className="text-gray-300">✔ Weekly Solves: 418 Problems</p>
                  <p className="text-gray-300">✔ Next Contest: CodeSprint 2026</p>
                  <p className="text-emerald-400">✔ Registration: Open to all undergraduate coders</p>
                  <p className="text-gray-500 pt-1">$ codechef-club join --now</p>
                  <p className="text-white bg-brand-500/20 p-2 rounded border border-brand-500/30">
                    &gt; Welcome to the community. Happy coding!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY MODAL */}
      {isCommunityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6">
            <button
              onClick={() => setIsCommunityModalOpen(false)}
              className="absolute right-6 top-6 p-1.5 rounded-lg text-gray-400 hover:text-white"
              aria-label="Close community modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-brand-400 uppercase tracking-widest">
                Developer Society
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Join CodeChef Campus Club
              </h3>
              <p className="text-xs text-gray-400">
                Connect with 500+ student programmers, solve weekly contest problems, and build hackathon winning teams.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl bg-dark-surface hover:bg-dark-cardHover border border-dark-border hover:border-brand-500/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors">
                      Discord War-Room
                    </h4>
                    <p className="text-xs text-gray-400">Live contest discussions, editorial rooms, and voice channels</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-brand-400 transition-colors" />
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl bg-dark-surface hover:bg-dark-cardHover border border-dark-border hover:border-brand-500/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors">
                      GitHub Campus Organization
                    </h4>
                    <p className="text-xs text-gray-400">Contribute to open repositories, tools, and contest problem archives</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-brand-400 transition-colors" />
              </a>

              <Link
                to="/events"
                onClick={() => setIsCommunityModalOpen(false)}
                className="flex items-center justify-between p-4 rounded-2xl bg-dark-surface hover:bg-dark-cardHover border border-dark-border hover:border-brand-500/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors">
                      Register for Next Contest
                    </h4>
                    <p className="text-xs text-gray-400">Participate in CodeSprint 2026 or upcoming hackathon</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-brand-400 transition-colors" />
              </Link>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setIsCommunityModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-dark-surface hover:bg-dark-cardHover text-xs font-semibold text-gray-400 hover:text-white border border-dark-border transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
