import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Trophy,
  Users,
  Target,
  Rocket,
  Compass,
  CheckCircle2,
  ArrowRight,
  Terminal,
  Zap,
  BookOpen,
  Cpu,
} from 'lucide-react';

export const AboutPage = () => {
  const pillars = [
    {
      title: 'Think Better',
      desc: 'Break intricate engineering bottlenecks into solvable subproblems. Master algorithm complexity analysis, dynamic programming, and mathematical induction.',
      icon: Target,
      badge: 'Analytical Rigor',
      color: 'from-orange-500/20 to-brand-500/5',
    },
    {
      title: 'Build Better',
      desc: 'Take abstract computer science concepts into the wild. Design high-throughput APIs, clean reactive interfaces, and resilient distributed microservices.',
      icon: Rocket,
      badge: 'Systems Craftsmanship',
      color: 'from-emerald-500/20 to-emerald-500/5',
    },
    {
      title: 'Compete Better',
      desc: 'Thrive under pressure in timed contests. Sharpen quick debugging instincts and tactical problem triage needed for global ICPC and CodeChef ranks.',
      icon: Trophy,
      badge: 'Competitive Edge',
      color: 'from-amber-500/20 to-amber-500/5',
    },
    {
      title: 'Grow Together',
      desc: 'Surround yourself with senior peers who review your PRs, conduct mock interviews, explain contest editorials, and build hackathon winning teams.',
      icon: Users,
      badge: 'Peer Culture',
      color: 'from-purple-500/20 to-purple-500/5',
    },
  ];

  const clubLeads = [
    {
      name: 'Aditya Verma',
      role: 'President & Competitive Lead',
      rating: 'CodeChef 6★ (2350)',
      bio: 'Final year CSE. Specializes in Tree Decomposition & Flow Networks. ACM-ICPC Regionalist.',
      initials: 'AV',
    },
    {
      name: 'Sneha Patel',
      role: 'Technical Vice President',
      rating: 'Full-Stack & Systems',
      bio: 'Pre-final year IT. Builder of distributed event-driven systems and open-source tooling.',
      initials: 'SP',
    },
    {
      name: 'Rohan Mehta',
      role: 'Head of Contests & Judging',
      rating: 'CodeChef 5★ (2140)',
      bio: 'Contest problem setter, graph theory enthusiast, and lead instructor for DSA bootcamps.',
      initials: 'RM',
    },
    {
      name: 'Priya Iyer',
      role: 'Hackathons & Community Lead',
      rating: 'AI / Full-Stack',
      bio: 'Winner of 4 national hackathons. Leads sprint cohorts and industry tech talk series.',
      initials: 'PI',
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 relative">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-radial-glow pointer-events-none opacity-50" />
      <div className="absolute inset-0 bg-subtle-grid pointer-events-none opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-mono font-medium">
            <span>ABOUT OUR CHAPTER</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Cultivating World-Class Collegiate Coders
          </h1>
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            Founded with the philosophy of <em>"Code. Compete. Create."</em>, CodeChef Campus Club is an autonomous student society committed to elevating software craftsmanship and algorithmic mastery across campus.
          </p>
        </div>

        {/* Mission & Vision Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="p-8 rounded-3xl bg-dark-card border border-dark-border/90 relative overflow-hidden space-y-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Our Mission</h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              To dismantle the intimidating barrier to competitive programming and high-performance software engineering. We provide a structured ecosystem where students from day one can transition from writing basic loops to solving Division-1 algorithmic problems and architecting reliable software.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-dark-card border border-dark-border/90 relative overflow-hidden space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Our Vision</h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              To establish our campus as one of the most respected engineering chapters globally in international programming Olympiads (ICPC, Google Hash Code, CodeChef Starters) and produce visionary software engineers who define top tech companies and innovative startups.
            </p>
          </div>
        </div>

        {/* WHY JOIN US: 4 PILLARS */}
        <div className="mb-20 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-brand-400 uppercase tracking-widest bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
              The Club Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Join CodeChef Campus Club?
            </h2>
            <p className="text-sm text-gray-400">
              Four fundamental pillars that define every workshop, contest, and collaborative sprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-dark-card/80 border border-dark-border hover:border-brand-500/40 transition-all duration-300 space-y-3 group hover:-translate-y-1 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">
                      {pillar.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* LEADERSHIP & MENTORSHIP TEAM */}
        <div className="mb-20 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">
              Executive Committee
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Led By Students, Guided By Industry
            </h2>
            <p className="text-sm text-gray-400">
              Meet the executive leads orchestrating contest problems, hackathon tracks, and peer code reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {clubLeads.map((lead, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-dark-card border border-dark-border/80 space-y-4 hover:border-brand-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-crimson-600 text-white font-mono font-bold text-sm flex items-center justify-center shadow-sm">
                    {lead.initials}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{lead.name}</h4>
                    <p className="text-xs text-brand-400 font-medium">{lead.role}</p>
                  </div>
                </div>

                <div className="text-xs font-mono text-emerald-400 bg-dark-surface px-2.5 py-1 rounded border border-dark-border inline-block">
                  {lead.rating}
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">{lead.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-600/15 via-dark-card to-crimson-600/15 border border-brand-500/30 text-center max-w-3xl mx-auto space-y-5">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready to participate in our next contest?
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed max-w-xl mx-auto">
            Explore our curated schedule of upcoming competitive programming matches, hackathons, and technical deep-dives.
          </p>
          <div className="pt-2">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-crimson-600 hover:from-brand-500 hover:to-crimson-500 shadow-glow-sm"
            >
              <span>View Events Calendar</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
