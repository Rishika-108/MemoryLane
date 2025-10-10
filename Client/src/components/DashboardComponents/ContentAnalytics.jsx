import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ContentAnalytics = ({ contentData }) => {
  if (!contentData || !contentData.contentTypePie || Object.keys(contentData.contentTypePie).length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-center animate-fadeIn">
        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Content Analytics</h3>
        <p className="text-gray-300 text-lg">No content data available yet.</p>
      </div>
    );
  }

  const total = useMemo(
    () => Object.values(contentData.contentTypePie).reduce((sum, val) => sum + val, 0),
    [contentData]
  );

  const colorPalette = ["#6366f1", "#f472b6", "#34d399", "#facc15", "#f97316", "#10b981", "#f59e0b"];
  const data = useMemo(() => ({
    labels: Object.keys(contentData.contentTypePie),
    datasets: [
      {
        label: "Content Type",
        data: Object.values(contentData.contentTypePie),
        backgroundColor: Object.keys(contentData.contentTypePie).map((_, idx) => colorPalette[idx % colorPalette.length]),
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 35,
        weight: 2,
      },
    ],
  }), [contentData]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#fff", font: { size: 14, weight: "600" }, padding: 16 },
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#facc15",
        bodyColor: "#f9fafb",
        bodyFont: { weight: "500", size: 14 },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function (context) {
            const count = context.parsed || 0;
            const percent = total ? ((count / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${count} (${percent}%)`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 300,
      easing: "easeOutCubic",
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
        Content Analytics
      </h3>

      <div className="w-full max-w-4xl h-80 md:h-96 mx-auto">
        <Pie data={data} options={options} />
      </div>

      {contentData.topTags && contentData.topTags.length > 0 && (
        <div className="mt-8">
          <h4 className="font-semibold text-white mb-4 text-lg">Top Tags</h4>
          <div className="flex flex-wrap gap-3">
            {contentData.topTags.map((tag) => (
              <span
                key={tag.tag}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md hover:scale-110 hover:shadow-lg transition-transform transform cursor-pointer"
                title={`${tag.tag} (${tag.count})`}
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
