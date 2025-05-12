import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-[#1A1E2E]/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50 p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;