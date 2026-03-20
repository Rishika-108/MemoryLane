import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

const Timeline = ({ memories }) => {
  const chartData = useMemo(() => {
    if (!memories || memories.length === 0) return null;

    // Group memories by date
    const dateCounts = {};
    memories.forEach(m => {
      const date = new Date(m.createdAt || m.timestamp).toLocaleDateString();
      dateCounts[date] = (dateCounts[date] || 0) + 1;
    });

    const sortedDates = Object.keys(dateCounts).sort((a, b) => new Date(a) - new Date(b));
    const counts = sortedDates.map(date => dateCounts[date]);

    return {
      labels: sortedDates,
      datasets: [
        {
          label: "Memories Captured",
          data: counts,
          borderColor: "#8b5cf6", // Violet 500
          backgroundColor: "rgba(139, 92, 246, 0.2)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#ec4899", // Pink 500
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        }
      ]
    };
  }, [memories]);

  if (!chartData) return null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b", // slate-800
        titleColor: "#f8fafc",
        bodyColor: "#cbd5e1",
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(255, 255, 255, 0.05)" },
        ticks: { color: "#94a3b8", stepSize: 1 }
      },
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8" }
      }
    }
  };

  return (
    <div className="w-full h-64 bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 mb-8 mt-4 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">Capture Timeline</h3>
      <div className="w-full h-48">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Timeline;
