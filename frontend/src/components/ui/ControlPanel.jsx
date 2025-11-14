export default function ControlPanel({ plantData, setPlantData }) {
  const togglePump = () => {
    setPlantData((prev) => ({
      ...prev,
      pumpStatus: !prev.pumpStatus,
    }));
  };

  return (
    <div className="control-panel">
      <h2>Controls</h2>

      <div className="control-group">
        <button
          className={`control-btn ${plantData.pumpStatus ? "active" : ""}`}
          onClick={togglePump}
        >
          {plantData.pumpStatus ? "🛑 Stop Pump" : "💧 Start Pump"}
        </button>

        <div className="mode-selector">
          <label>
            <input type="radio" name="mode" defaultChecked />
            Auto Mode (AI)
          </label>
          <label>
            <input type="radio" name="mode" />
            Manual Mode
          </label>
        </div>
      </div>
    </div>
  );
}
