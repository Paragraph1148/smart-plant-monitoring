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

  return (
    <div className="data-panel">
      <h2>Live Sensor Data</h2>

      <div className="data-grid">
        <div className="data-item">
          <span className="label">Soil Moisture</span>
          <span
            className="value"
            style={{ color: getStatusColor(plantData.moisture) }}
          >
            {plantData.moisture}%
          </span>

          {/* fix bottom */}
          {/* <span className="status">{getMoistureStatus(plantData.moisture)}</span> */}

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
        </div>

        <div className="data-item">
          <span className="label">Pump Status</span>
          <span className={`value ${plantData.pumpStatus ? "active" : ""}`}>
            {plantData.pumpStatus ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>

        <div className="data-item">
          <span className="label">Last Watered</span>
          <span className="value">{plantData.lastWatered}</span>
        </div>
      </div>
    </div>
  );
}
