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

const MoistureChart = ({ data = [] }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [timeRange, setTimeRange] = useState("24h");

  // Function to generate time-based mock data when we don't have enough real data
  const generateTimeBasedData = (hours) => {
    const points = hours === "24h" ? 24 : 72;
    const mockData = [];
    const now = new Date();

    for (let i = points - 1; i >= 0; i--) {
      const time = new Date(now);

      if (hours === "24h") {
        time.setHours(now.getHours() - i);
      } else {
        time.setHours(now.getHours() - i * 3); // For 72h, spread over 3 days
      }

      const timeString =
        hours === "24h"
          ? time.toLocaleTimeString("en-US", { hour: "2-digit", hour12: false })
          : time.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
            });

      // Generate realistic moisture data that decreases over time with some variation
      let moisture;
      if (i === 0) {
        // Current time - use actual data if available, otherwise simulate
        moisture =
          data && data.length > 0 ? data[data.length - 1].moisture : 65;
      } else {
        // Historical data - simulate natural pattern
        const baseMoisture = 65 - (i * (65 - 25)) / points;
        moisture = Math.max(25, baseMoisture + (Math.random() * 10 - 5));

        // Simulate watering events
        if (moisture < 30 && Math.random() > 0.8) {
          moisture += 30 + Math.random() * 20;
        }
      }

      mockData.push({
        time: timeString,
        moisture: Number(moisture.toFixed(1)),
        temperature: 20 + Math.random() * 10,
        pumpActive: false,
      });
    }

    return mockData;
  };

  // Transform data based on selected time range
  const transformData = (rawData, range) => {
    let displayData;

    if (rawData && rawData.length > 0) {
      // If we have real data, use it but limit based on time range
      const maxPoints = range === "24h" ? 24 : 72;
      displayData = rawData.slice(-maxPoints);

      // If we don't have enough data points, supplement with mock data
      if (displayData.length < maxPoints) {
        const mockData = generateTimeBasedData(range);
        // Replace the most recent points with actual data
        const startIndex = mockData.length - displayData.length;
        for (let i = 0; i < displayData.length; i++) {
          if (startIndex + i < mockData.length) {
            mockData[startIndex + i] = displayData[i];
          }
        }
        displayData = mockData;
      }
    } else {
      // No real data, generate mock data
      displayData = generateTimeBasedData(range);
    }

    return {
      labels: displayData.map((item) => item.time),
      datasets: [
        {
          label: "Soil Moisture %",
          data: displayData.map((item) => item.moisture),
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
    };
  };

  const chartData = transformData(data, timeRange);

  const chartConfig = {
    type: "line",
    data: chartData,
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
          text: `Soil Moisture Levels - ${
            timeRange === "24h" ? "Last 24 Hours" : "Last 3 Days"
          }`,
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
            maxTicksLimit: timeRange === "24h" ? 8 : 12,
            callback: function (value, index, values) {
              // Show fewer labels for better readability
              if (timeRange === "24h") {
                return index % 3 === 0 ? this.getLabelForValue(value) : "";
              } else {
                return index % 6 === 0 ? this.getLabelForValue(value) : "";
              }
            },
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
