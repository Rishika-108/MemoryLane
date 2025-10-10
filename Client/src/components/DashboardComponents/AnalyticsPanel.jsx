import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AnalyticsPanel = ({ analyticsData }) => {
  // Pie Chart for Content Types
  const pieData = {
    labels: Object.keys(analyticsData.contentTypePie),
    datasets: [
      {
        label: "Content Type",
        data: Object.values(analyticsData.contentTypePie),
        backgroundColor: ["#6366f1", "#f472b6", "#34d399", "#facc15", "#f97316"],
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 25,
      },
    ],
  };

  // Bar Chart for Mood Analytics
  const barData = {
    labels: Object.keys(analyticsData.moodBar || {}),
    datasets: [
      {
        label: "Mood Score",
        data: Object.values(analyticsData.moodBar || {}),
        backgroundColor: Object.keys(analyticsData.moodBar || {}).map((mood) =>
          mood === "happy"
            ? "#facc15"
            : mood === "sad"
            ? "#6366f1"
            : mood === "neutral"
            ? "#34d399"
            : "#f472b6"
        ),
        borderRadius: 8,
        barPercentage: 0.6,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#fff", font: { size: 14, weight: "500" } },
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#facc15",
        bodyColor: "#f9fafb",
        bodyFont: { weight: "500" },
      },
    },
  };

  const barOptions = {
    responsive: true,
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
      y: {
        ticks: { color: "#fff", beginAtZero: true },
        grid: { color: "#ffffff20" },
      },
      x: {
        ticks: { color: "#fff" },
        grid: { color: "#ffffff10" },
      },
    },
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Content Analytics */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition transform hover:scale-[1.03]">
        <h3 className="text-2xl font-bold mb-6 text-white">Content Type Overview</h3>
        <Pie data={pieData} options={pieOptions} />

        {analyticsData.topTags && (
          <div className="mt-8">
            <h4 className="font-semibold text-white mb-3 text-lg">Top Tags</h4>
            <div className="flex flex-wrap gap-3">
              {analyticsData.topTags.map((tag) => (
                <span
                  key={tag.tag}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md hover:scale-105 hover:brightness-110 transition transform cursor-pointer"
                >
                  {tag.tag} ({tag.count})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mood Analytics */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition transform hover:scale-[1.03]">
        <h3 className="text-2xl font-bold mb-6 text-white">Mood Analytics</h3>
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  );
};

export default AnalyticsPanel;
