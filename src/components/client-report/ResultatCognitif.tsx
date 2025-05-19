import React from 'react';
import PilotageStrategique from './PilotageStrategique';
import ResilienceDecisionnelle from './ResilienceDecisionnelle';
import PotentielHumain from './PotentielHumain';

import { Doughnut } from 'react-chartjs-2';
import { Shield, Target, Users, X } from 'lucide-react';
import { MatriceValueInterface } from '../../interfaces/client-report/MatriceValue.interface';
import {
  getGlobalValueForScore,
  getValueForScore,
  percentage,
} from '../../lib/function';

export default function ResultatCognitif({
  values,
  selectedFamily,
  setSelectedFamily,
}: {
  values: MatriceValueInterface;
  selectedFamily: string | null;
  setSelectedFamily: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  return (
    <section className="bg-[#1A1E2E]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">
        Automatismes d'action en situation terrain
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PilotageStrategique
          values={values}
          onClick={() => setSelectedFamily('pilotageStrategique')}
        />

        <ResilienceDecisionnelle
          values={values}
          onClick={() => setSelectedFamily('resilienceDecisionnelle')}
        />

        <PotentielHumain
          values={values}
          onClick={() => setSelectedFamily('lecturePotentiel')}
        />

        {/* Modal for time series charts */}
        {selectedFamily && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col gap-6 bg-[#0A0E17] border border-gray-700/50 rounded-xl w-full max-w-4xl p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-[#FFF5E6]">
                    {selectedFamily === 'pilotageStrategique' &&
                      'Pilotage Stratégique'}
                    {selectedFamily === 'resilienceDecisionnelle' &&
                      'Résilience Décisionnelle'}
                    {selectedFamily === 'lecturePotentiel' &&
                      'Lecture du Potentiel Humain'}
                  </h3>
                  {selectedFamily === 'pilotageStrategique' && (
                    <p className="text-base font-medium text-[#FFF5E6] max-w-2xl">
                      {getGlobalValueForScore(1, (values.m1 + values.m2) / 2)}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedFamily(null)}
                  className="p-2 hover:bg-gray-800/50 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col gap-6">
                {selectedFamily === 'pilotageStrategique' && (
                  <>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">
                          Sens de l'efficacité
                        </span>
                        <span className="font-bold text-[#FF6B00]">
                          {percentage(values.m1)}%
                        </span>
                      </div>
                      <div className="h-4 bg-gray-700/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF8124] bg-[length:200%_200%] animate-shimmer relative"
                          style={{ width: `${percentage(values.m1)}%` }}
                        >
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"
                            style={{
                              animationDuration: '2s',
                            }}
                          />
                        </div>
                      </div>
                      <p className="mt-2 font-bold text-[#FF6B00]">
                        {getValueForScore(1, values.m1)}
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">
                          Analyse des situations
                        </span>
                        <span className="font-bold text-[#3B82F6]">
                          {percentage(values.m2)}%
                        </span>
                      </div>
                      <div className="h-4 bg-gray-700/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] bg-[length:200%_200%] animate-shimmer relative"
                          style={{ width: `${percentage(values.m2)}%` }}
                        >
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10  to-transparent animate-pulse"
                            style={{
                              animationDuration: '2s',
                            }}
                          />
                        </div>
                      </div>
                      <p className="mt-2 font-bold text-[#3B82F6]">
                        {getValueForScore(2, values.m2)}
                      </p>
                    </div>
                  </>
                )}
                {selectedFamily === 'resilienceDecisionnelle' && (
                  <div className="flex gap-8">
                    <div className="bg-[#1A1E2E]/80 rounded-xl p-6 relative overflow-hidden group">
                      <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/20 via-[#F87171]/20 to-[#60A5FA]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-20" />
                      </div>
                      <div className="w-48 h-48 mx-auto relative mb-4">
                        <div
                          className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/30 via-[#F87171]/20 to-[#60A5FA]/30 rounded-full backdrop-blur-[2px] animate-pulse"
                          style={{
                            animationDuration: '3s',
                          }}
                        />
                        <div className="absolute inset-2 bg-gradient-to-br from-[#1A1E2E]/60 via-[#8B5CF6]/20 to-[#1A1E2E]/60 rounded-full backdrop-blur-sm border border-white/10">
                          <div
                            className="absolute inset-0 rounded-full animate-glow"
                            style={{
                              animationDuration: '3s',
                            }}
                          />
                          <div
                            className="absolute inset-0 rounded-full border border-[#8B5CF6]/30 animate-ripple"
                            style={{
                              animationDuration: '4s',
                            }}
                          />
                          <div
                            className="absolute inset-0 rounded-full border border-[#F87171]/20 animate-ripple"
                            style={{
                              animationDuration: '4s',
                              animationDelay: '2s',
                            }}
                          />
                          <div
                            className="absolute inset-0 rounded-full border border-[#60A5FA]/20 animate-ripple"
                            style={{
                              animationDuration: '4s',
                              animationDelay: '3s',
                            }}
                          />
                        </div>
                        <Doughnut
                          data={{
                            datasets: [
                              {
                                data: [
                                  percentage(values.m6),
                                  percentage(values.m7),
                                ],
                                backgroundColor: [
                                  (context) => {
                                    const ctx = context.chart.ctx;
                                    const gradient = ctx.createLinearGradient(
                                      0,
                                      0,
                                      0,
                                      200
                                    );
                                    gradient.addColorStop(
                                      0,
                                      'rgba(139, 92, 246, 0.95)'
                                    );
                                    gradient.addColorStop(
                                      0.3,
                                      'rgba(248, 113, 113, 0.9)'
                                    );
                                    gradient.addColorStop(
                                      0.7,
                                      'rgba(96, 165, 250, 0.9)'
                                    );
                                    gradient.addColorStop(
                                      1,
                                      'rgba(139, 92, 246, 0.95)'
                                    );
                                    return gradient;
                                  },
                                  'rgba(139, 92, 246, 0.1)',
                                ],
                                borderColor: [
                                  'rgba(139, 92, 246, 1)',
                                  'transparent',
                                ],
                                borderWidth: 1,
                                circumference: 360,
                                rotation: -90,
                              },
                            ],
                          }}
                          options={{
                            cutout: `${percentage(values.m6)}%`,
                            responsive: true,
                            plugins: {
                              legend: {
                                display: false,
                              },
                              tooltip: {
                                enabled: false,
                              },
                            },
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <span
                              className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(124,58,237,0.3)] animate-pulse"
                              style={{
                                animationDuration: '2s',
                              }}
                            >
                              {percentage(values.m6)}%
                            </span>
                          </div>
                        </div>
                        <div className="absolute inset-[-1px] rounded-full border border-[#7C3AED]/20 shadow-[0_0_15px_rgba(124,58,237,0.2)] animate-glow" />
                      </div>
                      <h4 className="text-xl font-bold mb-3 text-center">
                        Remise en question constructive
                      </h4>
                      <p className="text-gray-300 text-center">
                        {getValueForScore(6, values.m6)}
                      </p>
                    </div>

                    <div className="bg-[#1A1E2E]/80 rounded-xl p-6 relative overflow-hidden group">
                      <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/20 via-[#60A5FA]/20 to-[#F59E0B]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-20" />
                      </div>
                      <div className="w-48 h-48 mx-auto relative mb-4">
                        <div
                          className="absolute inset-0 bg-gradient-to-br from-[#10B981]/30 via-[#60A5FA]/20 to-[#F59E0B]/30 rounded-full backdrop-blur-[2px] animate-pulse"
                          style={{
                            animationDuration: '3s',
                          }}
                        />
                        <div className="absolute inset-2 bg-gradient-to-br from-[#1A1E2E]/60 via-[#10B981]/20 to-[#1A1E2E]/60 rounded-full backdrop-blur-sm border border-white/10">
                          <div
                            className="absolute inset-0 rounded-full animate-glow"
                            style={{
                              animationDuration: '3s',
                            }}
                          />
                          <div
                            className="absolute inset-0 rounded-full border border-[#10B981]/30 animate-ripple"
                            style={{
                              animationDuration: '4s',
                            }}
                          />
                          <div
                            className="absolute inset-0 rounded-full border border-[#60A5FA]/20 animate-ripple"
                            style={{
                              animationDuration: '4s',
                              animationDelay: '2s',
                            }}
                          />
                          <div
                            className="absolute inset-0 rounded-full border border-[#F59E0B]/20 animate-ripple"
                            style={{
                              animationDuration: '4s',
                              animationDelay: '3s',
                            }}
                          />
                        </div>
                        <Doughnut
                          data={{
                            datasets: [
                              {
                                data: [
                                  percentage(values.m6),
                                  percentage(values.m7),
                                ],
                                backgroundColor: [
                                  (context) => {
                                    const ctx = context.chart.ctx;
                                    const gradient = ctx.createLinearGradient(
                                      0,
                                      0,
                                      0,
                                      200
                                    );
                                    gradient.addColorStop(
                                      0,
                                      'rgba(16, 185, 129, 0.95)'
                                    );
                                    gradient.addColorStop(
                                      0.3,
                                      'rgba(96, 165, 250, 0.9)'
                                    );
                                    gradient.addColorStop(
                                      0.7,
                                      'rgba(245, 158, 11, 0.9)'
                                    );
                                    gradient.addColorStop(
                                      1,
                                      'rgba(16, 185, 129, 0.95)'
                                    );
                                    return gradient;
                                  },
                                  'rgba(16, 185, 129, 0.1)',
                                ],
                                borderColor: [
                                  'rgba(16, 185, 129, 1)',
                                  'transparent',
                                ],
                                borderWidth: 1,
                                circumference: 360,
                                rotation: -90,
                              },
                            ],
                          }}
                          options={{
                            cutout: `${percentage(values.m7)}%`,
                            responsive: true,
                            plugins: {
                              legend: {
                                display: false,
                              },
                              tooltip: {
                                enabled: false,
                              },
                            },
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <span
                              className="text-4xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(5,150,105,0.3)] animate-pulse"
                              style={{
                                animationDuration: '2s',
                              }}
                            >
                              {percentage(values.m7)}%
                            </span>
                          </div>
                        </div>
                        <div className="absolute inset-[-1px] rounded-full border border-[#059669]/20 shadow-[0_0_15px_rgba(5,150,105,0.2)] animate-glow" />
                      </div>
                      <h4 className="text-xl font-bold mb-3 text-center">
                        Agilité à piloter en s'adaptant
                      </h4>
                      <p className="text-gray-300 text-center">
                        {getValueForScore(7, values.m7)}
                      </p>
                    </div>
                  </div>
                )}
                {selectedFamily === 'lecturePotentiel' && (
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-[#1A1E2E]/80 rounded-xl p-6 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#DC2626]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-48 h-48 relative">
                          <div
                            className="absolute inset-0 flex items-center justify-center animate-pulse"
                            style={{
                              animationDuration: '3s',
                            }}
                          >
                            <div
                              className="absolute w-40 h-40 rounded-full border border-[#DC2626]/10 animate-ripple"
                              style={{
                                animationDuration: '3s',
                              }}
                            />
                            <div
                              className="absolute w-40 h-40 rounded-full border border-[#DC2626]/10 animate-ripple"
                              style={{
                                animationDuration: '3s',
                                animationDelay: '1.5s',
                              }}
                            />
                            <div className="w-32 h-32 rounded-full border-4 border-[#DC2626]/20 flex items-center justify-center relative">
                              <div
                                className="absolute inset-0 rounded-full animate-glow"
                                style={{
                                  animationDuration: '2s',
                                }}
                              />
                              <div className="w-24 h-24 rounded-full border-4 border-[#DC2626]/40 flex items-center justify-center relative">
                                <div
                                  className="absolute inset-0 rounded-full animate-glow"
                                  style={{
                                    animationDuration: '2s',
                                    animationDelay: '0.5s',
                                  }}
                                />
                                <div className="w-16 h-16 rounded-full border-4 border-[#DC2626]/60 flex items-center justify-center relative">
                                  <div
                                    className="absolute inset-0 rounded-full animate-glow"
                                    style={{
                                      animationDuration: '2s',
                                      animationDelay: '1s',
                                    }}
                                  />
                                  <Target
                                    className="w-8 h-8 text-[#DC2626] animate-pulse"
                                    style={{
                                      animationDuration: '2s',
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className="text-5xl font-bold bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(220,38,38,0.3)] animate-pulse"
                            style={{
                              animationDuration: '2s',
                            }}
                          >
                            {percentage(values.m3)}%
                          </span>
                        </div>
                      </div>
                      <h4 className="text-xl font-bold mb-3 text-center">
                        Vision des problématiques
                      </h4>
                      <p className="text-gray-300 text-center">
                        {getValueForScore(3, values.m3)}
                      </p>
                    </div>

                    <div className="bg-[#1A1E2E]/80 rounded-xl p-6 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-48 h-48 relative">
                          <div
                            className="absolute inset-0 flex items-center justify-center animate-pulse"
                            style={{
                              animationDuration: '3s',
                            }}
                          >
                            <div
                              className="absolute w-40 h-40 rounded-full border border-[#4F46E5]/10 animate-ripple"
                              style={{
                                animationDuration: '3s',
                              }}
                            />
                            <div
                              className="absolute w-40 h-40 rounded-full border border-[#4F46E5]/10 animate-ripple"
                              style={{
                                animationDuration: '3s',
                                animationDelay: '1.5s',
                              }}
                            />
                            <div className="w-32 h-32 rounded-full border-4 border-[#4F46E5]/20 flex items-center justify-center relative">
                              <div
                                className="absolute inset-0 rounded-full animate-glow"
                                style={{
                                  animationDuration: '2s',
                                }}
                              />
                              <div className="w-24 h-24 rounded-full border-4 border-[#4F46E5]/40 flex items-center justify-center relative">
                                <div
                                  className="absolute inset-0 rounded-full animate-glow"
                                  style={{
                                    animationDuration: '2s',
                                    animationDelay: '0.5s',
                                  }}
                                />
                                <div className="w-16 h-16 rounded-full border-4 border-[#4F46E5]/60 flex items-center justify-center relative">
                                  <div
                                    className="absolute inset-0 rounded-full animate-glow"
                                    style={{
                                      animationDuration: '2s',
                                      animationDelay: '1s',
                                    }}
                                  />
                                  <Shield
                                    className="w-8 h-8 text-[#4F46E5] animate-pulse"
                                    style={{
                                      animationDuration: '2s',
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className="text-5xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(79,70,229,0.3)] animate-pulse"
                            style={{
                              animationDuration: '2s',
                            }}
                          >
                            {percentage(values.m4)}%
                          </span>
                        </div>
                      </div>
                      <h4 className="text-xl font-bold mb-3 text-center">
                        Force créative
                      </h4>
                      <p className="text-gray-300 text-center">
                        {getValueForScore(4, values.m4)}
                      </p>
                    </div>

                    <div className="bg-[#1A1E2E]/80 rounded-xl p-6 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#059669]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-48 h-48 relative">
                          <div
                            className="absolute inset-0 flex items-center justify-center animate-pulse"
                            style={{
                              animationDuration: '3s',
                            }}
                          >
                            <div
                              className="absolute w-40 h-40 rounded-full border border-[#059669]/10 animate-ripple"
                              style={{
                                animationDuration: '3s',
                              }}
                            />
                            <div
                              className="absolute w-40 h-40 rounded-full border border-[#059669]/10 animate-ripple"
                              style={{
                                animationDuration: '3s',
                                animationDelay: '1.5s',
                              }}
                            />
                            <div className="w-32 h-32 rounded-full border-4 border-[#059669]/20 flex items-center justify-center relative">
                              <div
                                className="absolute inset-0 rounded-full animate-glow"
                                style={{
                                  animationDuration: '2s',
                                }}
                              />
                              <div className="w-24 h-24 rounded-full border-4 border-[#059669]/40 flex items-center justify-center relative">
                                <div
                                  className="absolute inset-0 rounded-full animate-glow"
                                  style={{
                                    animationDuration: '2s',
                                    animationDelay: '0.5s',
                                  }}
                                />
                                <div className="w-16 h-16 rounded-full border-4 border-[#059669]/60 flex items-center justify-center relative">
                                  <div
                                    className="absolute inset-0 rounded-full animate-glow"
                                    style={{
                                      animationDuration: '2s',
                                      animationDelay: '1s',
                                    }}
                                  />
                                  <Users
                                    className="w-8 h-8 text-[#059669] animate-pulse"
                                    style={{
                                      animationDuration: '2s',
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className="text-5xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(5,150,105,0.3)] animate-pulse"
                            style={{
                              animationDuration: '2s',
                            }}
                          >
                            {percentage(values.m5)}%
                          </span>
                        </div>
                      </div>
                      <h4 className="text-xl font-bold mb-3 text-center">
                        Indépendance relationnelle
                      </h4>
                      <p className="text-gray-300 text-center">
                        {getValueForScore(5, values.m5)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
