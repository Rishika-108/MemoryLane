import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MoodAnalytics = ({ moodData }) => {
  // Empty state
  if (!moodData || Object.keys(moodData).length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-center animate-fadeIn">
        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Mood Analytics</h3>
        <p className="text-gray-300 text-lg">No mood data available yet.</p>
      </div>
    );
  }

  const moodColors = {
    happy: "#facc15",
    sad: "#6366f1",
    neutral: "#34d399",
    angry: "#f472b6",
    excited: "#f97316",
  };

  const labels = useMemo(() => Object.keys(moodData), [moodData]);
  const dataValues = useMemo(() => Object.values(moodData), [moodData]);
  const total = useMemo(() => dataValues.reduce((sum, val) => sum + val, 0), [dataValues]);

  const data = useMemo(() => ({
    labels,
    datasets: [
      {
        label: "Mood Frequency",
        data: dataValues,
        backgroundColor: labels.map((mood) => moodColors[mood] || "#ffffff"),
        borderRadius: 8,
        barThickness: 36,
        hoverBackgroundColor: labels.map((mood) => moodColors[mood] + "cc"),
      },
    ],
  }), [labels, dataValues]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#facc15",
        bodyColor: "#f9fafb",
        bodyFont: { weight: "500", size: 14 },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const count = context.parsed.y;
            const percent = total ? ((count / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${count} (${percent}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#fff",
          font: { size: 14, weight: "600" },
          stepSize: 1,
        },
        grid: { color: "#ffffff30", borderDash: [4, 4] },
      },
      x: {
        ticks: { color: "#fff", font: { size: 14, weight: "600" } },
        grid: { color: "#ffffff10" },
      },
    },
    animation: {
      duration: 300,
      easing: "easeOutQuart",
    },
    hover: {
      mode: "nearest",
      intersect: true,
      animationDuration: 100,
    },
  }), [total]);

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-transform transform hover:scale-[1.04] animate-fadeIn">
      <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white text-center">
        Mood Analytics
      </h3>
      <div className="w-full max-w-4xl h-80 md:h-96 mx-auto">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default MoodAnalytics;
