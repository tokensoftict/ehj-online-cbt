import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AnalyticsChartProps {
  correct: number;
  wrong: number;
  skipped: number;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ correct, wrong, skipped }) => {
  const data = {
    labels: ['Correct', 'Wrong', 'Skipped'],
    datasets: [
      {
        data: [correct, wrong, skipped],
        backgroundColor: [
          'hsl(142, 76%, 36%)', // Success green
          'hsl(0, 84%, 60%)',   // Destructive red
          'hsl(38, 92%, 50%)',  // Warning orange
        ],
        borderColor: [
          'hsl(142, 76%, 36%)',
          'hsl(0, 84%, 60%)',
          'hsl(38, 92%, 50%)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="h-48 w-full">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default AnalyticsChart;