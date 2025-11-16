// src/components/ui/DataPanel.jsx
export default function DataPanel({ plantData }) {
  const getMoistureStatus = (moisture) => {
    if (moisture > 60) return "Optimal";
    if (moisture > 40) return "Good";
    if (moisture > 25) return "Low";
    return "Critical";
  };

  const getStatusColor = (moisture) => {
    if (moisture > 60) return "#22c55e";
    if (moisture > 40) return "#eab308";
    if (moisture > 25) return "#f97316";
    return "#ef4444";
  };

  const getStatusIcon = (moisture) => {
    if (moisture > 60) return "💧";
    if (moisture > 40) return "💧";
    if (moisture > 25) return "⚠️";
    return "🚨";
  };

  return (
    <div className="data-panel-card">
      {/* Title inside the card */}
      <div className="card-header">
        <h2>Live Sensor Data</h2>
        <div className="last-updated">
          Updated:{" "}
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      <div className="data-grid">
        <div className="data-item">
          <div className="data-header">
            <span className="label">Soil Moisture</span>
            <span className="status-icon">
              {getStatusIcon(plantData.moisture)}
            </span>
          </div>
          <span
            className="value"
            style={{ color: getStatusColor(plantData.moisture) }}
          >
            {plantData.moisture}%
          </span>
          <span className="status">
            {getMoistureStatus(plantData.moisture)}
          </span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${plantData.moisture}%`,
                background: getStatusColor(plantData.moisture),
              }}
            ></div>
          </div>
        </div>

        <div className="data-item">
          <span className="label">Temperature</span>
          <span className="value">{plantData.temperature}°C</span>
          <div className="temp-indicator">
            {plantData.temperature > 28
              ? "🔥 Hot"
              : plantData.temperature < 18
              ? "❄️ Cool"
              : "🌡️ Normal"}
          </div>
        </div>

        <div className="data-item">
          <span className="label">Pump Status</span>
          <span className={`value ${plantData.pumpStatus ? "active" : ""}`}>
            {plantData.pumpStatus ? "🟢 ACTIVE" : "⚪ INACTIVE"}
          </span>
        </div>

        <div className="data-item">
          <span className="label">Last Watered</span>
          <span className="value">{plantData.lastWatered}</span>
        </div>

        {plantData.aiDecision && (
          <div className="data-item full-width">
            <span className="label">AI Decision</span>
            <div className="ai-decision">
              <span
                className={`decision ${
                  plantData.aiDecision.shouldWater ? "water" : "hold"
                }`}
              >
                {plantData.aiDecision.shouldWater ? "💧 WATER" : "⏸️ HOLD"}
              </span>
              <span className="confidence">
                Confidence: {plantData.aiDecision.confidence}%
              </span>
            </div>
            <div className="ai-reason">{plantData.aiDecision.reason}</div>
          </div>
        )}
      </div>
    </div>
  );
}
