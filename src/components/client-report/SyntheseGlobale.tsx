import React from 'react';

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
} from 'chart.js';
import { MatriceValueInterface } from '../../interfaces/client-report/MatriceValue.interface';
import { extractJson, percentage } from '../../lib/function';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useParams } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { chat } from '../../lib/openai';
import { syntheseGlobal } from '../../lib/prompts';
import { updateUserReducer } from '../../redux/slices/user.slice';

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

const spiderOptions: ChartOptions<'radar'> = {
  responsive: true,
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
        color: 'rgba(255, 255, 255, 0.6)',
        font: {
          size: 14,
          weight: '500',
        },
        padding: 20,
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
  values,
}: {
  values: MatriceValueInterface;
}) {
  const { tests } = useSelector((state: RootState) => state.user);
  const { candidateEmail } = useParams();

  const dispatch = useDispatch();
  const chartRef = React.useRef<ChartJS<'radar'>>(null);

  const [chartData, setChartData] = React.useState<ChartData<'radar'>>({
    labels: [
      "Sens de l'efficacité",
      'Analyse des situations',
      'Remise en question constructive',
      "Agilité à piloter en s'adaptant",
      'Vision des problématiques',
      'Force créative',
      'Indépendance relationnelle',
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

  const average = parseFloat(
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

  const adjustedAverage = parseFloat((average + adjustment).toFixed(2));

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
    if (candidateEmail) {
      (async () => {
        const openaiResponse = await chat([
          { role: 'system', content: syntheseGlobal.trim() },
          { role: 'user', content: messageContent.trim() },
        ]);

        if (openaiResponse.content) {
          const jsonData: { content: string } = extractJson(
            openaiResponse.content
          );

          await setDoc(
            doc(db, 'tests', candidateEmail),
            {
              email: candidateEmail,
              synthese: jsonData.content,
            },
            { merge: true }
          );

          const testsDocRef = doc(db, 'tests', candidateEmail);
          const testsDocSnap = await getDoc(testsDocRef);

          if (testsDocSnap.exists()) {
            const data = testsDocSnap.data();
            dispatch(updateUserReducer({ tests: data }));
          }
        }
      })();
    }
  }, [candidateEmail]);

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
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-20" />
      <h2 className="text-2xl font-bold mb-6">Synthèse Globale</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative w-full group" style={{ height: '400px' }}>
          <div className="absolute inset-0 bg-gradient-radial from-[#FF6B00]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute inset-[-1px] rounded-xl border border-[#FF6B00]/10 shadow-[0_0_30px_rgba(255,107,0,0.1)] animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <Radar ref={chartRef} data={chartData} options={spiderOptions} />
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
        </div>
      </div>
    </div>
  );
}
