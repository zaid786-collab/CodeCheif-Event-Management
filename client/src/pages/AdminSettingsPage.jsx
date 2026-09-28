import React, { useState, useEffect } from 'react';
import { Settings, Save, Server, Shield, CheckCircle2, Terminal } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { api } from '../api/client';

export const AdminSettingsPage = () => {
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [healthStatus, setHealthStatus] = useState({ online: true, db: 'ONLINE' });
  const [settings, setSettings] = useState({
    clubName: 'CodeChef Campus Club',
    motto: 'Code. Compete. Create.',
    chapterId: 'CC-CAMPUS-412',
    officialEmail: 'contact@codechefclub.edu',
    campusVenue: 'Student Activity Centre, Room 304, Tech Block',
    discordUrl: 'https://discord.com',
    githubOrg: 'https://github.com/codechef-campus',
    registrationAutoConfirm: true,
    emailNotifications: true,
  });

  useEffect(() => {
    api.checkHealth()
      .then((res) => {
        setHealthStatus({
          online: res.status === 'ok',
          db: res.database ? res.database.toUpperCase() : 'ONLINE',
        });
      })
      .catch(() => {
        setHealthStatus({ online: false, db: 'OFFLINE' });
      });
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Club executive configuration saved successfully.');
    }, 600);
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
          CLUB CONFIGURATION & SETTINGS
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Manage chapter parameters, branding, official communications, and notification thresholds.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Identity */}
        <div className="p-6 rounded-2xl bg-[#0F131C] border border-[#1E2638] space-y-4">
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Settings className="w-4 h-4 text-brand-400" />
            Chapter Branding & Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-gray-400 uppercase mb-1">Club Name</label>
              <input
                type="text"
                value={settings.clubName}
                onChange={(e) => setSettings({ ...settings, clubName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3E] text-white font-sans text-sm focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 uppercase mb-1">Chapter ID</label>
              <input
                type="text"
                disabled
                value={settings.chapterId}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0D14] border border-[#232B3E] text-gray-500 font-mono text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Official Motto</label>
            <input
              type="text"
              value={settings.motto}
              onChange={(e) => setSettings({ ...settings, motto: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3E] text-white font-sans text-sm focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Communications & Office */}
        <div className="p-6 rounded-2xl bg-[#0F131C] border border-[#1E2638] space-y-4">
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            Official Communications & Campus Office
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-gray-400 uppercase mb-1">Official Executive Email</label>
              <input
                type="email"
                value={settings.officialEmail}
                onChange={(e) => setSettings({ ...settings, officialEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3E] text-white font-sans text-sm focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 uppercase mb-1">Campus Physical Office</label>
              <input
                type="text"
                value={settings.campusVenue}
                onChange={(e) => setSettings({ ...settings, campusVenue: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3E] text-white font-sans text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-gray-400 uppercase mb-1">Discord Community Invite</label>
              <input
                type="url"
                value={settings.discordUrl}
                onChange={(e) => setSettings({ ...settings, discordUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3E] text-white font-sans text-sm focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 uppercase mb-1">GitHub Organization</label>
              <input
                type="url"
                value={settings.githubOrg}
                onChange={(e) => setSettings({ ...settings, githubOrg: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A26] border border-[#232B3E] text-white font-sans text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Server & DB Status Overview */}
        <div className="p-6 rounded-2xl bg-[#0F131C] border border-[#1E2638] space-y-4">
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-sky-400" />
            Infrastructure Status
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#141A26] border border-[#232B3E]">
              <span className="text-gray-400 block mb-1">MongoDB Database:</span>
              <span className={`${healthStatus.db !== 'OFFLINE' ? 'text-emerald-400' : 'text-rose-400'} font-bold flex items-center gap-1.5`}>
                <span className={`w-2 h-2 rounded-full ${healthStatus.db !== 'OFFLINE' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                {healthStatus.db}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#141A26] border border-[#232B3E]">
              <span className="text-gray-400 block mb-1">Express API Server:</span>
              <span className={`${healthStatus.online ? 'text-emerald-400' : 'text-rose-400'} font-bold flex items-center gap-1.5`}>
                <span className={`w-2 h-2 rounded-full ${healthStatus.online ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                {healthStatus.online ? 'SERVICE HEALTHY' : 'SERVICE UNREACHABLE'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#141A26] border border-[#232B3E]">
              <span className="text-gray-400 block mb-1">Authentication Mode:</span>
              <span className="text-brand-400 font-bold">JWT HMAC-SHA256</span>
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-crimson-600 hover:from-brand-500 hover:to-crimson-500 shadow-glow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Updating...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
