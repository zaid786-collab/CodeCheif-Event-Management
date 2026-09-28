import React, { useState } from 'react';
import {
  Mail,
  MapPin,
  Clock,
  Terminal,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Github,
  Linkedin,
  Instagram,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ContactPage = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Your message has been received! A club lead will get back to you within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 800);
  };

  const faqs = [
    {
      q: 'Do I need prior competitive programming experience to join?',
      a: 'Not at all! We host dedicated beginner cohorts specifically tailored for 1st-year students and freshers. We start from basic syntax, loop optimizations, and arrays before moving to advanced algorithms.',
    },
    {
      q: 'Are inter-college students eligible to participate in hackathons?',
      a: 'Yes! Most of our flagship hackathons (such as WebForge) and algorithmic championships (CodeSprint) are open to students across all accredited technical universities and colleges.',
    },
    {
      q: 'How are contest registrations verified at the venue?',
      a: 'Upon registering through this portal, you receive a unique Ticket ID (e.g., CC-CP-01-XXXXXX). You simply present this ID or your registered college roll number at the venue check-in desk.',
    },
    {
      q: 'How can I become part of the organizing committee or problem-setting team?',
      a: 'We conduct annual core team recruitments at the beginning of each academic semester. Active participation in contests and contributing to workshops is the quickest path to joining the executive board.',
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 relative">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-radial-glow pointer-events-none opacity-50" />
      <div className="absolute inset-0 bg-subtle-grid pointer-events-none opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-mono font-medium">
            <span>GET IN TOUCH</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Connect With the Chapter Leads
          </h1>
          <p className="text-base text-gray-300 leading-relaxed">
            Have questions about upcoming contests, sponsorship collaborations, or joining our executive technical teams? Reach out directly.
          </p>
        </div>

        {/* Contact Grid: Form & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
          {/* Left: Interactive Message Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-dark-card border border-dark-border/90 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-2">Send an Official Inquiry</h2>
            <p className="text-xs text-gray-400 mb-6">
              Our executive communications desk reviews inquiries daily.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-surface border border-dark-border text-sm text-white focus:outline-none focus:border-brand-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. alex@university.edu"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-surface border border-dark-border text-sm text-white focus:outline-none focus:border-brand-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Partnership / Contest Query / Membership"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-surface border border-dark-border text-sm text-white focus:outline-none focus:border-brand-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us what you'd like to collaborate on..."
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-surface border border-dark-border text-sm text-white focus:outline-none focus:border-brand-500 font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-crimson-600 hover:from-brand-500 hover:to-crimson-500 shadow-glow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Transmitting...' : 'Send Message'}</span>
              </button>
            </form>
          </div>

          {/* Right: Contact Chips & Chapter Office */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-dark-card border border-dark-border/90 space-y-6">
              <h3 className="text-lg font-bold text-white tracking-tight">Campus Headquarters</h3>

              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Physical Location</p>
                    <p className="text-xs text-gray-400 leading-relaxed mt-0.5">
                      Student Activity Centre, Room 304<br />
                      Tech Block, Main Engineering Campus<br />
                      ABES Engineering College
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Email Communications</p>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">
                      contact@codechefclub.com<br />
                      events@codechefclub.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Open Lab & Office Hours</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Mon – Fri: 04:00 PM – 08:00 PM IST<br />
                      Sat (Contest Sprints): 10:00 AM – 06:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-dark-border/80">
                <p className="text-xs font-mono uppercase text-gray-400 mb-3">Community Hubs</p>
                <div className="flex items-center gap-3">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-dark-surface border border-dark-border text-gray-400 hover:text-white hover:border-brand-500/40 transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-dark-surface border border-dark-border text-gray-400 hover:text-white hover:border-brand-500/40 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-dark-surface border border-dark-border text-gray-400 hover:text-white hover:border-brand-500/40 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://discord.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-dark-surface border border-dark-border text-gray-400 hover:text-white hover:border-brand-500/40 transition-colors"
                    aria-label="Discord"
                  >
                    <Terminal className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-8">
            <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">
              Common Inquiries
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl bg-dark-card border border-dark-border/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-white text-sm sm:text-base hover:text-brand-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${
                      openFaq === index ? 'rotate-180 text-brand-400' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-gray-400 leading-relaxed border-t border-dark-border/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
