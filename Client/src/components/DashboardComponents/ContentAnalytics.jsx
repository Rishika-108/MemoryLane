import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ContentAnalytics = ({ contentData }) => {
  if (!contentData || !contentData.contentTypePie || Object.keys(contentData.contentTypePie).length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl text-center">
        <h3 className="text-2xl font-bold mb-4 text-white">Content Analytics</h3>
        <p className="text-gray-300">No content data available yet.</p>
      </div>
    );
  }

  const data = {
    labels: Object.keys(contentData.contentTypePie),
    datasets: [
      {
        label: "Content Type",
        data: Object.values(contentData.contentTypePie),
        backgroundColor: ["#6366f1", "#f472b6", "#34d399", "#facc15", "#f97316"],
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 20,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { color: "#fff", font: { size: 14, weight: "500" } } },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#facc15",
        bodyColor: "#f9fafb",
        bodyFont: { weight: "500" },
      },
    },
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition transform hover:scale-[1.03]">
      <h3 className="text-2xl font-bold mb-4 text-white">Content Analytics</h3>
      <div className="w-full max-w-3xl h-80 mx-auto">
        <Pie data={data} options={options} />
      </div>

      {contentData.topTags && contentData.topTags.length > 0 && (
        <div className="mt-8">
          <h4 className="font-semibold text-white mb-3 text-lg">Top Tags</h4>
          <div className="flex flex-wrap gap-3">
            {contentData.topTags.map((tag) => (
              <span
                key={tag.tag}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md hover:scale-105 transition transform cursor-pointer"
              >
                {tag.tag} ({tag.count})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentAnalytics;
