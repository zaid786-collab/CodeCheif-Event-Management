import React from 'react';

export const StatCard = ({ icon: Icon, value, label, subtext, accentColor = 'brand' }) => {
  const colorMap = {
    brand: 'text-brand-400 group-hover:text-brand-300 border-brand-500/20 bg-brand-500/10',
    emerald: 'text-emerald-400 group-hover:text-emerald-300 border-emerald-500/20 bg-emerald-500/10',
    amber: 'text-amber-400 group-hover:text-amber-300 border-amber-500/20 bg-amber-500/10',
    purple: 'text-purple-400 group-hover:text-purple-300 border-purple-500/20 bg-purple-500/10',
    rose: 'text-rose-400 group-hover:text-rose-300 border-rose-500/20 bg-rose-500/10',
  };

  const style = colorMap[accentColor] || colorMap.brand;

  return (
    <div className="group relative p-6 rounded-2xl bg-dark-card/80 border border-dark-border hover:border-brand-500/40 transition-all duration-300 hover:shadow-glow-sm hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        {Icon && (
          <div className={`p-3 rounded-xl border ${style} transition-transform group-hover:scale-110 duration-200`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
        <div className="w-2 h-2 rounded-full bg-brand-500/40 group-hover:bg-brand-500 transition-colors" />
      </div>

      <div className="space-y-1">
        <h4 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
          {value}
        </h4>
        <p className="text-base font-semibold text-gray-200">{label}</p>
        {subtext && <p className="text-xs text-gray-400 leading-relaxed pt-1">{subtext}</p>}
      </div>
    </div>
  );
};
