import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MoodAnalytics = ({ moodData }) => {
  if (!moodData || Object.keys(moodData).length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl text-center">
        <h3 className="text-2xl font-bold mb-4 text-white">Mood Analytics</h3>
        <p className="text-gray-300">No mood data available yet.</p>
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

  const data = {
    labels: Object.keys(moodData),
    datasets: [
      {
        label: "Mood Frequency",
        data: Object.values(moodData),
        backgroundColor: Object.keys(moodData).map((mood) => moodColors[mood] || "#ffffff"),
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#facc15",
        bodyColor: "#f9fafb",
        bodyFont: { weight: "500" },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: "#fff" }, grid: { color: "#ffffff20" } },
      x: { ticks: { color: "#fff" }, grid: { color: "#ffffff10" } },
    },
    animation: { duration: 1200, easing: "easeOutQuart" },
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition transform hover:scale-[1.03]">
      <h3 className="text-2xl font-bold mb-4 text-white">Mood Analytics</h3>
      <div className="w-full max-w-3xl h-80 mx-auto">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default MoodAnalytics;
