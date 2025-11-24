'use client';

import { ChartData, ChartOptions } from 'chart.js';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import { getChartPalette } from '@/lib/utils';
import { useMemo } from 'react';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

type ChartRendererProps = {
  type: 'line' | 'bar' | 'scatter' | 'pie';
  labels: string[];
  datasets: Array<{ label: string; data: number[] }>;
};

export default function ChartRenderer({ type, labels, datasets }: ChartRendererProps) {
  const palette = useMemo(() => getChartPalette(datasets.length), [datasets]);
  const data: ChartData = {
    labels,
    datasets: datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: palette[index],
      borderColor: palette[index],
      borderWidth: 2,
      pointRadius: 3,
      fill: type === 'line' ? false : true
    }))
  };
  const options: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: '#cbd5f5' }
      }
    },
    scales:
      type === 'pie'
        ? {}
        : {
            x: {
              ticks: { color: '#94a3b8' },
              grid: { color: '#1e293b' }
            },
            y: {
              ticks: { color: '#94a3b8' },
              grid: { color: '#1e293b' }
            }
          }
  };

  const chartClass = 'rounded-2xl border border-slate-800 bg-slate-900/50 p-4';

  switch (type) {
    case 'bar':
      return <Bar data={data} options={options} className={chartClass} />;
    case 'scatter':
      return <Scatter data={data} options={options} className={chartClass} />;
    case 'pie':
      return <Pie data={data} options={options} className={chartClass} />;
    default:
      return <Line data={data} options={options} className={chartClass} />;
  }
}
