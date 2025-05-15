import React from 'react';

import { MatriceValueInterface } from '../../interfaces/client-report/MatriceValue.interface';
import { getGlobalValueForScore, percentage } from '../../lib/function';

export default function PilotageStrategique({
  values,
  onClick,
}: {
  values: MatriceValueInterface;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="w-full flex flex-col justify-center bg-gradient-to-br from-[#1A1E2E] to-[#2A1E12] rounded-lg p-6 hover:bg-gradient-to-br hover:from-[#1F2437] hover:to-[#2F2315] transition-all duration-300 hover:scale-[1.02] relative group h-[420px] cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-radial from-[#FF6B00]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex items-center justify-center gap-3 mb-4 relative">
        <div className="h-48 w-3 bg-gray-800/50 rounded-full relative overflow-hidden animate-pulse">
          <div
            className="absolute bottom-0 w-full bg-gradient-to-t from-[#FF6B00] via-[#FF8124] to-[#3B82F6] animate-pulse"
            style={{
              height: `${percentage((values.m1 + values.m2) / 2)}%`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20">
              <div
                className="absolute inset-0 animate-glow"
                style={{ animationDuration: '2s' }}
              />
            </div>
          </div>
          <div
            className="absolute -left-3 top-0 w-9 h-full pointer-events-none animate-pulse"
            style={{ animationDuration: '3s' }}
          >
            <div className="w-full h-full bg-gradient-to-r from-transparent via-[#FF6B00]/10 to-transparent" />
          </div>
        </div>
        <p className="text-2xl font-bold text-white animate-pulse">
          {percentage((values.m1 + values.m2) / 2)}%
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl text-center font-bold">Pilotage Stratégique</h3>
        <p className="text-center text-gray-300">
          {getGlobalValueForScore(1, (values.m1 + values.m2) / 2)}
        </p>
        <div className="pt-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Sens de l'efficacité</span>
            <span className="font-semibold text-[#FF6B00]">
              {percentage(values.m1)}%
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>Analyse des situations</span>
            <span className="font-semibold text-[#3B82F6]">
              {percentage(values.m2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
