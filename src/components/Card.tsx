import React from 'react';

export default function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#1A1E2E]/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50 p-6 ${className}`}
    >
      {children}
    </div>
  );
}
