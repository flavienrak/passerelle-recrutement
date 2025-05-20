import React from 'react';
import { Bar } from 'react-chartjs-2';

import {
  ArcElement,
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  ScriptableContext,
  Tooltip,
} from 'chart.js';
import { getSyntheseValue, getValueForScore } from '../../lib/function';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const barOptions: ChartOptions<'bar'> = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: {
        color: 'rgba(255, 255, 255, 0.6)',
        font: { size: 12 },
      },
    },
    x: {
      grid: { display: false },
      ticks: {
        color: 'rgba(255, 255, 255, 0.6)',
        font: { size: 12 },
      },
    },
  },
};

// Couleurs de base pour chaque barre
const baseColors = [
  {
    from: 'rgba(59, 130, 246, 0.2)',
    to: 'rgba(59, 130, 246, 0.8)',
    border: 'rgba(59, 130, 246, 1)',
  }, // Bleu
  {
    from: 'rgba(79, 70, 229, 0.2)',
    to: 'rgba(79, 70, 229, 0.8)',
    border: 'rgba(79, 70, 229, 1)',
  }, // Indigo
  {
    from: 'rgba(16, 185, 129, 0.2)',
    to: 'rgba(16, 185, 129, 0.8)',
    border: 'rgba(16, 185, 129, 1)',
  }, // Vert
];

export default function EmotionalLevel({
  average,
  result,
}: {
  average: number;
  result: number[];
}) {
  const chartRef = React.useRef<ChartJS<'bar'>>(null);

  const [chartData, setChartData] = React.useState<ChartData<'bar'>>({
    labels: ['Risque terrain', 'Implication émotionnelle', 'Force de décision'],
    datasets: [
      {
        data: result,
        // on met une fonction scriptable qui retourne UN CanvasGradient à la fois
        backgroundColor: (context: ScriptableContext<'bar'>) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          // si le chart n'est pas encore prêt, on retourne une couleur de secours
          if (!chartArea) {
            return baseColors[context.dataIndex ?? 0].from;
          }
          const idx = context.dataIndex as number;
          const { from, to } = baseColors[idx];
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          );
          gradient.addColorStop(0, from);
          gradient.addColorStop(1, to);
          return gradient;
        },
        borderColor: baseColors.map((c) => c.border),
        borderWidth: 2,
      },
    ],
  });

  // on génère explicitement les gradients une fois le chart monté
  React.useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const { chartArea } = chart;
    if (!chartArea) return;
    chart.update();
  }, [chartRef.current]);

  React.useEffect(() => {
    if (result) {
      setChartData((prev) => ({
        ...prev,
        datasets: [
          {
            ...prev.datasets[0],
            data: result,
          },
        ],
      }));
    }
  }, [result]);

  return (
    <div className="bg-[#1A1E2E]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">Niveau d'imprégnation métier</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="h-[300px]">
          <Bar ref={chartRef} data={chartData} options={barOptions} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0A0E17]/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-[#FF6B00]">
                Risque terrain
              </h3>
              <p className="text-sm text-gray-300">
                {getValueForScore(1, average)}
              </p>
            </div>
            <div className="bg-[#0A0E17]/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-[#FF6B00]">
                Implication émotionnelle
              </h3>
              <p className="text-sm text-gray-300">
                {getValueForScore(2, average)}
              </p>
            </div>
            <div className="bg-[#0A0E17]/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-[#FF6B00]">
                Force de décision
              </h3>
              <p className="text-sm text-gray-300">
                {getValueForScore(3, average)}
              </p>
            </div>
          </div>
          <div className="bg-[#0A0E17]/50 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-[#FF6B00]">Synthèse</h3>
            <p className="text-gray-300">{getSyntheseValue(average)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
