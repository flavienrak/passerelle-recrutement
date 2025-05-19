import React from 'react';

export default function StepItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex">
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#1a1a1a] border border-[#FF7A30] text-[#FF7A30] flex items-center justify-center">
        {icon}
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm">{text}</p>
      </div>
    </div>
  );
}
