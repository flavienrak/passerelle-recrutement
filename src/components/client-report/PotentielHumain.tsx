import React from 'react';

import { MatriceValueInterface } from '../../interfaces/client-report/MatriceValue.interface';
import { getGlobalValueForScore, percentage } from '../../lib/function';

export default function PotentielHumain({
  values,
  onClick,
}: {
  values: MatriceValueInterface;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="w-full h-full bg-gradient-to-br from-[#1A1E2E] to-[#122A1E] rounded-lg p-6 hover:bg-gradient-to-br hover:from-[#1F2437] hover:to-[#153123] transition-all duration-300 hover:scale-[1.02] relative group flex flex-col"
    >
      <div className="absolute inset-0 bg-gradient-radial from-[#FF6B00]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="w-48 h-48 mx-auto relative mb-4">
        <div
          className="absolute inset-0 flex items-center justify-center animate-pulse"
          style={{ animationDuration: '3s' }}
        >
          <div
            className="absolute w-40 h-40 rounded-full border border-[#FF6B00]/10 animate-ripple"
            style={{ animationDuration: '3s' }}
          />
          <div
            className="absolute w-40 h-40 rounded-full border border-[#FF6B00]/10 animate-ripple"
            style={{
              animationDuration: '3s',
              animationDelay: '1.5s',
            }}
          />
          <div className="w-32 h-32 rounded-full border-4 border-[#FF6B00]/20 flex items-center justify-center relative">
            <div
              className="absolute inset-0 rounded-full animate-glow"
              style={{ animationDuration: '2s' }}
            />
            <div className="w-24 h-24 rounded-full border-4 border-[#FF6B00]/40 flex items-center justify-center relative">
              <div
                className="absolute inset-0 rounded-full animate-glow"
                style={{
                  animationDuration: '2s',
                  animationDelay: '0.5s',
                }}
              />
              <div className="w-16 h-16 rounded-full border-4 border-[#FF6B00]/60 flex items-center justify-center relative">
                <div
                  className="absolute inset-0 rounded-full animate-glow"
                  style={{
                    animationDuration: '2s',
                    animationDelay: '1s',
                  }}
                />
                <p
                  className="text-xl font-bold animate-pulse"
                  style={{
                    animationDuration: '2s',
                  }}
                >
                  {percentage((values.m3 + values.m4 + values.m5) / 3)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xl text-center font-bold">
          Lecture du Potentiel Humain
        </h3>
        <p className="text-center text-gray-300">
          {getGlobalValueForScore(3, (values.m3 + values.m4 + values.m5) / 3)}
        </p>
        <div className="pt-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Vision des problématiques</span>
            <span className="font-semibold text-[#FF6B00]">
              {percentage(values.m3)}%
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>Force créative</span>
            <span className="font-semibold text-[#3B82F6]">
              {percentage(values.m4)}%
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>Indépendance relationnelle</span>
            <span className="font-semibold text-[#10B981]">
              {percentage(values.m5)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
