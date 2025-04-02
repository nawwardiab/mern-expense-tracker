// components/WeeklySpendingChart.jsx
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const WeeklySpendingChart = () => {
  const data = {
    labels: ['Oct 10th', 'Oct 11th', 'Oct 12th', 'Oct 13th', 'Oct 14th', 'Oct 15th', 'Oct 16th'],
    datasets: [
      {
        label: 'Expenses',
        data: [45.34, 75.92, 23.11, 64.75, 105.09, 95.32, 50.12],
        backgroundColor: 'rgba(128, 128, 128, 0.7)',
        borderRadius: 5,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: context => `$${context.parsed.y.toFixed(2)}`
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        display: false,
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div style={{ backgroundColor: '#ccc', padding: '1rem', borderRadius: '12px' }}>
      <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Weekly Spending Overview</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default WeeklySpendingChart;
