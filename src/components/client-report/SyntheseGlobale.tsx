import React from 'react';
import Button from '../Button';
import SkillsLegend from './SkillsLegend';

import { Radar } from 'react-chartjs-2';
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
  Plugin,
} from 'chart.js';
import { MatriceValueInterface } from '../../interfaces/client-report/MatriceValue.interface';
import { extractJson, percentage } from '../../lib/function';
import { useParams } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { syntheseGlobal } from '../../lib/prompts';
import { db } from '../../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { updateUserReducer } from '../../redux/slices/user.slice';
import { colors } from '../../lib/colors';
import { gpt3 } from '../../lib/openai';

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

const labelColors = [
  colors.blue,
  colors.blue,
  colors.purple,
  colors.purple,
  colors.pink,
  colors.pink,
  colors.pink,
];

const coloredLabelsPlugin: Plugin<'radar'> = {
  id: 'coloredLabelsPlugin',
  afterDraw(chart: ChartJS<'radar'>) {
    const scale = chart.scales.r as RadialLinearScale;

    const ctx = chart.ctx;
    const labels = chart.data.labels as (string | string[])[];

    const radius = scale.getDistanceFromCenterForValue(scale.max ?? 100) + 60;
    const centerX = scale.xCenter;
    const centerY = scale.yCenter;

    labels.forEach((label, i) => {
      const angle = scale.getIndexAngle(i) - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx.save();
      ctx.fillStyle = labelColors[i % labelColors.length]; // 🎯 couleur selon index
      ctx.font = '600 14px Arial'; // 👈 poids 600 pour "gras"
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const lines = Array.isArray(label) ? label : [label];
      lines.forEach((line, j) => {
        ctx.fillText(line, x, y + j * 16); // 👈 16 pour plus d’espace
      });

      ctx.restore();
    });
  },
};
const spiderOptions: ChartOptions<'radar'> = {
  responsive: true,
  layout: {
    padding: 100, // 👈 Ajoute de l'espace autour du canvas
  },
  scales: {
    r: {
      min: 0,
      max: 100,
      ticks: {
        stepSize: 20,
        callback: (value: string | number) => `${value}%`,
        color: 'rgba(255, 255, 255, 0.4)',
        backdropColor: 'transparent',
      },
      angleLines: {
        color: 'rgba(255, 255, 255, 0.1)',
        lineWidth: 1,
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
        circular: true,
      },
      pointLabels: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: {
        size: 14,
        weight: 'bold',
      },
      bodyFont: {
        size: 13,
      },
      padding: 12,
      cornerRadius: 8,
    },
  },
};

export default function SyntheseGlobale({
  average,
  values,
}: {
  average: number;
  values: MatriceValueInterface;
}) {
  const { tests } = useSelector((state: RootState) => state.user);
  const { userId } = useParams();

  const dispatch = useDispatch();

  const chartRef = React.useRef<ChartJS<'radar'>>(null);

  const [showModal, setShowModal] = React.useState(false);
  const [chartData, setChartData] = React.useState<ChartData<'radar'>>({
    labels: [
      ['Sens de', "l'efficacité"],
      ['Analyse', 'des situations'],
      ['Remise en', 'question', 'constructive'],
      ['Agilité à piloter', "en s'adaptant"],
      ['Vision', 'des', 'problématiques'],
      ['Force', 'créative'],
      ['Indépendance ', 'relationnelle'],
    ],
    datasets: [
      {
        label: 'Compétences',
        data: [0, 0, 0, 0, 0, 0, 0],
        fill: true,
        backgroundColor: (context: ScriptableContext<'radar'>) => {
          const { chart } = context;
          const { ctx, chartArea } = chart;

          if (!chartArea) return 'rgba(255, 107, 0, 0.2)';

          // Use radial gradient instead of conic (not supported)
          const radius = Math.min(chartArea.width, chartArea.height) / 2;
          const centerX = (chartArea.left + chartArea.right) / 2;
          const centerY = (chartArea.top + chartArea.bottom) / 2;

          const gradient = ctx.createRadialGradient(
            centerX,
            centerY,
            0,
            centerX,
            centerY,
            radius
          );
          gradient.addColorStop(0, 'rgba(255, 107, 0, 0.8)');
          gradient.addColorStop(0.5, 'rgba(255, 129, 36, 0.5)');
          gradient.addColorStop(1, 'rgba(255, 107, 0, 0.2)');

          return gradient;
        },
        borderColor: 'rgba(255, 107, 0, 1)',
        pointBackgroundColor: (context: ScriptableContext<'radar'>) => {
          const value = context.raw as number;
          return value >= 85
            ? '#FF6B00'
            : value >= 75
            ? '#FF8124'
            : 'rgba(255, 107, 0, 0.6)';
        },
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 107, 0, 1)',
        borderWidth: 3,
      },
    ],
  });

  const globalAverage = parseFloat(
    (
      Object.values(values).reduce((sum, val) => sum + val, 0) /
      Object.values(values).length
    ).toFixed(2)
  );

  // Générer un ajustement aléatoire entre +0 et +0.07 ou entre -0 et -0.05
  const random = Math.random(); // [0, 1)
  const adjustment =
    random < 0.5
      ? parseFloat((random * 0.07).toFixed(2)) // entre 0 et 0.07
      : -parseFloat((random * 0.05).toFixed(2)); // entre -0 et -0.05

  const adjustedAverage = parseFloat((globalAverage + adjustment).toFixed(2));

  const messageContent = `
    Sens de l'efficacité : ${percentage(values.m1)}%\n
    Analyse des situations : ${percentage(values.m2)}%\n
    Vision des problématiques : ${percentage(values.m3)}%\n
    Force créative : ${percentage(values.m4)}%\n
    Indépendance relationnelle : ${percentage(values.m5)}%\n
    Remise en question constructive : ${percentage(values.m6)}%\n
    Agilité à piloter en s'adaptant : ${percentage(values.m7)}%
  `;

  React.useEffect(() => {
    if (userId) {
      (async () => {
        if (!tests.synthese) {
          const openaiResponse = await gpt3([
            { role: 'system', content: syntheseGlobal.trim() },
            { role: 'user', content: messageContent.trim() },
          ]);

          if (openaiResponse.content) {
            const jsonData: { content: string } = extractJson(
              openaiResponse.content
            );

            await setDoc(
              doc(db, 'tests', userId),
              { synthese: jsonData.content },
              { merge: true }
            );

            const testsDocSnap = await getDoc(doc(db, 'tests', userId));

            if (testsDocSnap.exists()) {
              const data = testsDocSnap.data();
              dispatch(updateUserReducer({ tests: data }));
            }
          }
        }
      })();
    }
  }, [userId, tests]);

  React.useEffect(() => {
    if (values) {
      const chart = chartRef.current;
      if (!chart) return;

      setChartData((prev) => ({
        ...prev,
        datasets: [
          {
            ...prev.datasets[0],
            data: [
              percentage(values.m1),
              percentage(values.m2),
              percentage(values.m3),
              percentage(values.m4),
              percentage(values.m5),
              percentage(values.m6),
              percentage(values.m7),
            ],
          },
        ],
      }));
    }
  }, [values]);

  return (
    <div className="bg-gradient-to-br from-[#1A1E2E]/90 via-[#1F2437]/80 to-[#141824]/90 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 relative overflow-hidden">
      <h2 className="text-2xl font-bold mb-6">Synthèse Globale</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative w-full group" style={{ height: '500px' }}>
          <div className="absolute inset-0 bg-gradient-radial from-[#FF6B00]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute inset-[-1px] rounded-xl border border-[#FF6B00]/10 shadow-[0_0_30px_rgba(255,107,0,0.1)] animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <Radar
            ref={chartRef}
            data={chartData}
            options={spiderOptions}
            plugins={[coloredLabelsPlugin]}
          />
        </div>
        <div className="space-y-6">
          <div className="bg-[#0A0E17]/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Score Global</h3>
              <div className="text-4xl font-bold text-[#FF6B00]">
                {percentage(adjustedAverage)}%
              </div>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full w-[84%] bg-gradient-to-r from-[#FF6B00] to-[#FF8124]"
                style={{ width: `${percentage(adjustedAverage)}%` }}
              />
            </div>
          </div>
          <div className="bg-[#0A0E17]/50 rounded-lg p-6">
            <h3 className="font-semibold mb-3 text-[#FF6B00]">Synthèse</h3>
            <p className="text-gray-300">{tests.synthese}</p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="hover:opacity-90 cursor-pointer"
          >
            En savoir plus sur le test
          </Button>
        </div>
      </div>
      {showModal && (
        <div className="fixed top-0 left-0 h-full w-full flex justify-center items-center p-4 bg-black/70 backdrop-blur-sm">
          <SkillsLegend
            values={values}
            average={average}
            onClose={setShowModal}
          />
        </div>
      )}
    </div>
  );
}
