export default function DataPanel({ plantData }) {
  return (
    <div className="data-panel">
      <h2>Live Sensor Data</h2>

      <div className="data-grid">
        <div className="data-item">
          <span className="label">Soil Moisture</span>
          <span className="value">{plantData.moisture}%</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${plantData.moisture}%` }}
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
