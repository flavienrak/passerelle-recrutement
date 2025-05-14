import React from 'react';
import { Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const NeuroPulseLogo = () => {
  return (
    <Link to="/">
      <div className="flex items-center">
        <img
          src="https://res.cloudinary.com/dsvix5dzy/image/upload/v1745781614/Sans_titre-1_77_jst63e.png"
          alt="Les recruteurs"
          className="h-10 mr-2"
        />
        <div id="fallback-logo" className="hidden">
          <Brain className="h-8 w-8 text-[#FF6B00] mr-2" />
        </div>
      </div>
    </Link>
  );
};

export default NeuroPulseLogo;
