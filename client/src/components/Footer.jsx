import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Github, Linkedin, Instagram, Terminal, Heart, ArrowUpRight, Shield } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-dark-surface/90 border-t border-dark-border/80 pt-16 pb-12 mt-24 relative overflow-hidden">
      {/* Decorative top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-24 bg-brand-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-crimson-600 flex items-center justify-center p-[1px]">
                <div className="w-full h-full bg-dark-bg rounded-[11px] flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-brand-500" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-tight text-white font-mono text-sm">
                  CODECHEF CAMPUS
                </span>
                <span className="text-[10px] text-brand-400 font-mono tracking-widest uppercase">
                  Code. Compete. Create.
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              The premier collegiate developer society dedicated to competitive programming, system design, algorithm mastery, and building production-grade software.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-500/40 hover:bg-brand-500/10 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-500/40 hover:bg-brand-500/10 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-500/40 hover:bg-brand-500/10 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-500/40 hover:bg-brand-500/10 transition-all"
                aria-label="Discord"
              >
                <Terminal className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-widest mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all">
                  Club Events & Hackathons
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all">
                  About the Chapter
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all">
                  Contact & Campus Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-widest mb-4">
              Domains & Focus
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                Competitive Programming (DSA)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                Production Web Engineering
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Hackathons & Sprint Contests
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                AI Systems & Agents
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Open Source Collaborations
              </li>
            </ul>
          </div>

          {/* Campus Office / Admin */}
          <div>
            <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-widest mb-4">
              Campus Chapter
            </h4>
            <div className="space-y-3 text-sm text-gray-400">
              <p>
                Student Activity Centre, Level 3<br />
                Department of Computer Science<br />
                University Tech Campus
              </p>
              <div className="pt-2">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border text-xs font-mono text-gray-300 hover:text-brand-400 hover:border-brand-500/40 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-brand-400" />
                  Admin Executive Portal
                  <ArrowUpRight className="w-3 h-3 text-gray-500" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-dark-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} CodeChef Campus Club. All rights reserved.</p>
          <p className="flex items-center gap-1.5 font-mono">
            <span>Built by students, for students with</span>
            <Heart className="w-3.5 h-3.5 text-crimson-500 fill-crimson-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
