import React from 'react';
import { Brain } from 'lucide-react';

const NeuroPulseLogo = () => {
  return (
    <div className="flex items-center">
      {/* Using the provided logo URL */}
      <img 
        src="https://res.cloudinary.com/dsvix5dzy/image/upload/v1745781614/Sans_titre-1_77_jst63e.png" 
        alt="Les recruteurs" 
        className="h-10 mr-2"
        onError={(e) => {
          // Fallback to Lucide icon if image fails to load
          e.currentTarget.style.display = 'none';
          document.getElementById('fallback-logo')!.style.display = 'block';
        }} 
      />
      <div id="fallback-logo" className="hidden">
        <Brain className="h-8 w-8 text-[#FF6B00] mr-2" />
      </div>
    </div>
  );
};

export default NeuroPulseLogo;