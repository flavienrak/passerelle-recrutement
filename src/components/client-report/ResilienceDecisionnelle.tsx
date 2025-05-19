import React from 'react';

import { Doughnut } from 'react-chartjs-2';
import { MatriceValueInterface } from '../../interfaces/client-report/MatriceValue.interface';
import { getGlobalValueForScore, percentage } from '../../lib/function';

export default function ResilienceDecisionnelle({
  values,
  onClick,
}: {
  values: MatriceValueInterface;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="w-full h-full flex flex-col bg-gradient-to-br from-[#1A1E2E] to-[#1E122A] rounded-lg p-6 hover:bg-gradient-to-br hover:from-[#1F2437] hover:to-[#231531] transition-all duration-300 hover:scale-[1.02] relative group overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-50" />
      <div className="w-48 h-48 mx-auto relative mb-4">
        <div
          className="absolute inset-0 bg-black/30 rounded-full backdrop-blur-[2px] animate-pulse"
          style={{ animationDuration: '3s' }}
        />
        <div className="absolute inset-2 bg-gradient-to-br from-[#1A1E2E]/80 to-black/80 rounded-full backdrop-blur-sm border border-white/5">
          <div
            className="absolute inset-0 rounded-full animate-glow"
            style={{ animationDuration: '2s' }}
          />
        </div>
        <Doughnut
          data={{
            datasets: [
              {
                data: [percentage(values.m6), percentage(values.m7)],
                backgroundColor: [
                  'rgba(255, 107, 0, 0.8)',
                  'rgba(255, 107, 0, 0.05)',
                ],
                borderColor: ['rgba(255, 107, 0, 1)', 'transparent'],
                borderWidth: 1,
                circumference: 360,
                rotation: -90,
              },
            ],
          }}
          options={{
            cutout: `${percentage((values.m6 + values.m7) / 2)}%`,
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false },
            },
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <p
            className="text-4xl text-center font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,107,0,0.3)] animate-pulse"
            style={{ animationDuration: '2s' }}
          >
            {percentage((values.m6 + values.m7) / 2)}%
          </p>
        </div>
        <div className="absolute inset-[-1px] rounded-full border border-[#FF6B00]/20 shadow-[0_0_15px_rgba(255,107,0,0.2)] animate-glow" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl text-center font-bold">
          Résilience Décisionnelle
        </h3>
        <p className="text-center text-gray-300">
          {getGlobalValueForScore(2, (values.m6 + values.m7) / 2)}
        </p>
        <div className="pt-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Remise en question constructive</span>
            <span className="font-semibold text-[#FF6B00]">
              {percentage(values.m6)}%
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>Agilité à piloter en s'adaptant</span>
            <span className="font-semibold text-[#10B981]">
              {percentage(values.m7)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
