import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

export const CountdownTimer = ({ targetDate, title = 'Next Contest Kickoff' }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isExpired) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        EVENT IS LIVE NOW
      </div>
    );
  }

  const units = [
    { label: 'DAYS', value: String(timeLeft.days).padStart(2, '0') },
    { label: 'HOURS', value: String(timeLeft.hours).padStart(2, '0') },
    { label: 'MINUTES', value: String(timeLeft.minutes).padStart(2, '0') },
    { label: 'SECONDS', value: String(timeLeft.seconds).padStart(2, '0') },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider text-brand-400 uppercase">
        <Timer className="w-3.5 h-3.5" />
        <span>{title}</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {units.map((unit, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-dark-surface/90 border border-dark-border/80 shadow-inner group hover:border-brand-500/30 transition-colors"
          >
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-white tracking-wider text-glow">
              {unit.value}
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-gray-400 font-semibold uppercase mt-0.5">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
