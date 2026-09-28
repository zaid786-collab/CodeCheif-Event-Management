import React from 'react';

export const EventCardSkeleton = () => {
  return (
    <div className="flex flex-col justify-between bg-dark-card/60 border border-dark-border/60 rounded-2xl p-6 animate-pulse">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-24 bg-dark-surface rounded-md" />
          <div className="h-5 w-16 bg-dark-surface rounded" />
        </div>
        <div className="h-6 w-3/4 bg-dark-surface rounded mb-3" />
        <div className="h-4 w-full bg-dark-surface rounded mb-2" />
        <div className="h-4 w-2/3 bg-dark-surface rounded mb-6" />

        <div className="space-y-2 p-3 bg-dark-surface/40 rounded-xl mb-6">
          <div className="h-3 w-1/2 bg-dark-card rounded" />
          <div className="h-3 w-2/5 bg-dark-card rounded" />
          <div className="h-3 w-3/5 bg-dark-card rounded" />
        </div>
      </div>

      <div>
        <div className="h-2 w-full bg-dark-surface rounded-full mb-4" />
        <div className="h-10 w-full bg-dark-surface rounded-xl" />
      </div>
    </div>
  );
};

export const TableRowSkeleton = ({ columns = 6 }) => {
  return (
    <tr className="border-b border-dark-border/60 animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-dark-surface rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
};
