// src/components/charts/MoistureChart.jsx
import { useRef, useEffect, useState } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register Chart.js components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MoistureChart = ({ data = null }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [timeRange, setTimeRange] = useState("24h");

  // Generate realistic simulated data if no data is provided
  const generateMockData = () => {
    const labels = [];
    const moistureData = [];

    let baseMoisture = 65;
    const now = new Date();

    // Generate data points based on selected time range
    let points = timeRange === "24h" ? 24 : 72;
    let timeFormat = timeRange === "24h" ? "HH:00" : "MM/DD HH:00";

    for (let i = points - 1; i >= 0; i--) {
      const time = new Date(now);
      if (timeRange === "24h") {
        time.setHours(now.getHours() - i);
        labels.push(
          time.toLocaleTimeString("en-US", { hour: "2-digit", hour12: false })
        );
      } else {
        time.setHours(now.getHours() - i * 8);
        labels.push(
          time.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
          })
        );
      }

      // Simulate natural moisture decline with some randomness
      baseMoisture -= Math.random() * 1.5;

      // Simulate watering events when moisture gets too low
      if (baseMoisture < 30 && Math.random() > 0.7) {
        baseMoisture += 35 + Math.random() * 15;
      }

      // Keep within realistic bounds
      baseMoisture = Math.max(20, Math.min(85, baseMoisture));
      moistureData.push(Number(baseMoisture.toFixed(1)));
    }

    return { labels, datasets: [{ data: moistureData }] };
  };

  const chartData = data || generateMockData();

  const chartConfig = {
    type: "line",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: "Soil Moisture %",
          data: chartData.datasets[0].data,
          borderColor: "rgb(34, 197, 94)",
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "rgb(34, 197, 94)",
          pointBorderColor: "white",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "#e5e5e5",
            font: {
              size: 12,
              weight: "bold",
            },
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#f5f5f5",
          bodyColor: "#f5f5f5",
          borderColor: "rgb(34, 197, 94)",
          borderWidth: 1,
          callbacks: {
            label: function (context) {
              return `Moisture: ${context.parsed.y}%`;
            },
          },
        },
        title: {
          display: true,
          text: "Soil Moisture Levels",
          color: "#f5f5f5",
          font: {
            size: 16,
            weight: "bold",
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          ticks: {
            color: "#a3a3a3",
            maxTicksLimit: 8,
          },
        },
        y: {
          min: 0,
          max: 100,
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          ticks: {
            color: "#a3a3a3",
            callback: function (value) {
              return value + "%";
            },
          },
          title: {
            display: true,
            text: "Moisture Percentage",
            color: "#a3a3a3",
          },
        },
      },
    },
  };

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart instance
    chartInstance.current = new Chart(chartRef.current, chartConfig);

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData, timeRange]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  return (
    <div className="moisture-chart-container">
      <div className="chart-header">
        <h3>Soil Moisture Analytics</h3>
        <div className="time-range-selector">
          <button
            className={`time-btn ${timeRange === "24h" ? "active" : ""}`}
            onClick={() => handleTimeRangeChange("24h")}
          >
            24H
          </button>
          <button
            className={`time-btn ${timeRange === "72h" ? "active" : ""}`}
            onClick={() => handleTimeRangeChange("72h")}
          >
            72H
          </button>
        </div>
      </div>
      <div className="chart-wrapper">
        <canvas ref={chartRef} />
      </div>
      <style jsx>{`
        .moisture-chart-container {
          background: #1a1a1a;
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid #333;
          height: 400px;
          display: flex;
          flex-direction: column;
        }
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .chart-header h3 {
          color: #f5f5f5;
          margin: 0;
          font-size: 1.25rem;
        }
        .time-range-selector {
          display: flex;
          gap: 0.5rem;
          background: #2a2a2a;
          padding: 0.25rem;
          border-radius: 8px;
        }
        .time-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: #a3a3a3;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .time-btn.active {
          background: #22c55e;
          color: white;
        }
        .time-btn:hover:not(.active) {
          background: #374151;
          color: #e5e5e5;
        }
        .chart-wrapper {
          flex: 1;
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default MoistureChart;
