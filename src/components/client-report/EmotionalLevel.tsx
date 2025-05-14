import React, { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from 'chart.js';
import { TestResponseInterface } from '../../interfaces/TestResponse.interface';
import { responseEvaluations, syntheseEvaluation } from '../../lib/constants';

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

const barOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
        drawBorder: false,
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.6)',
        font: {
          size: 12,
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.6)',
        font: {
          size: 12,
        },
      },
    },
  },
};

export default function EmotionalLevel({
  tests,
}: {
  tests: TestResponseInterface[];
}) {
  const barChartRef = useRef<ChartJS | null>(null);
  const [average, setAverage] = useState<number | null>(null);

  const emotionalData = {
    labels: ['Risque terrain', 'Implication émotionnelle', 'Force de décision'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return;

          const gradients = [
            ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top),
            ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top),
            ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top),
          ];

          gradients[0].addColorStop(0, 'rgba(59, 130, 246, 0.2)');
          gradients[0].addColorStop(1, 'rgba(59, 130, 246, 0.8)');

          gradients[1].addColorStop(0, 'rgba(79, 70, 229, 0.2)');
          gradients[1].addColorStop(1, 'rgba(79, 70, 229, 0.8)');

          gradients[2].addColorStop(0, 'rgba(16, 185, 129, 0.2)');
          gradients[2].addColorStop(1, 'rgba(16, 185, 129, 0.8)');

          return gradients;
        },
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(79, 70, 229, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 2,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 10,
      },
    ],
  };

  useEffect(() => {
    const scores = tests.map((item) => item.score);
    setAverage(
      scores.length > 0
        ? scores.reduce((acc, val) => acc + val, 0) / scores.length
        : 0
    );
  }, [tests]);

  useEffect(() => {
    if (typeof average === 'number') {
      const chart = barChartRef.current;
      if (!chart) return;

      let newAverage = Math.ceil(average * 100);

      // Étape 1 : si divisible par 5, on ajoute ou retire 3 aléatoirement
      if (newAverage % 5 === 0) {
        const variation = Math.random() < 0.5 ? -3 : 3;
        newAverage += variation;
      }

      // Étape 2 : on génère 3 valeurs différentes avec un écart de ±5
      const data = Array.from({ length: 3 }, () => {
        const delta = Math.floor(Math.random() * 11) - 5; // nombre aléatoire entre -5 et 5
        return newAverage + delta;
      });

      chart.data.datasets[0].data = data;
      chart.update();
    }
  }, [average]);

  const getValueForScore = (id: number): string | undefined => {
    if (average) {
      // 1) On cherche l’évaluation correspondant à l’ID
      const evaluation = responseEvaluations.find((item) => item.id === id);
      if (!evaluation) return undefined;

      // 2) On cherche l’option dont le score est dans [min, max]
      const opt = evaluation.options.find(
        (item) => average >= item.min && average <= item.max
      );
      return opt?.value;
    }
    return undefined;
  };

  const getSyntheseValue = (): string | undefined => {
    if (average) {
      const entry = syntheseEvaluation.find(
        (item) => average >= item.min && average <= item.max
      );

      if (!entry) return undefined;

      if (typeof entry.value === 'string') {
        return entry.value;
      }

      if (Array.isArray(entry.value)) {
        const randomIndex = Math.floor(Math.random() * entry.value.length);
        return entry.value[randomIndex];
      }
    }

    return undefined;
  };

  return (
    <div className="bg-[#1A1E2E]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">
        Niveau d'imprégnation émotivo-professionnelle
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="h-[300px]">
          <Bar ref={barChartRef} data={emotionalData} options={barOptions} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0A0E17]/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-[#FF6B00]">
                Risque terrain
              </h3>
              <p className="text-sm text-gray-300">{getValueForScore(1)}</p>
            </div>
            <div className="bg-[#0A0E17]/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-[#FF6B00]">
                Implication émotionnelle
              </h3>
              <p className="text-sm text-gray-300">{getValueForScore(2)}</p>
            </div>
            <div className="bg-[#0A0E17]/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-[#FF6B00]">
                Force de décision
              </h3>
              <p className="text-sm text-gray-300">{getValueForScore(3)}</p>
            </div>
          </div>
          <div className="bg-[#0A0E17]/50 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-[#FF6B00]">Synthèse</h3>
            <p className="text-gray-300">{getSyntheseValue()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
