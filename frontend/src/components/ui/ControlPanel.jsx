export default function ControlPanel({ plantData, togglePump, setAutoMode }) {
  const handleModeChange = (isAuto) => {
    setAutoMode(isAuto);
    // If switching to auto mode and moisture is low, auto-start pump
    if (isAuto && plantData.moisture < 30 && !plantData.pumpStatus) {
      togglePump();
    }
  };

  return (
    <div className="control-panel">
      <h2>Controls</h2>

      <div className="control-group">
        <button
          className={`control-btn ${plantData.pumpStatus ? "active" : ""}`}
          onClick={togglePump}
          disabled={plantData.isAutoMode && plantData.moisture >= 85}
        >
          {plantData.pumpStatus ? "🛑 Stop Pump" : "💧 Start Pump"}
          {plantData.isAutoMode && plantData.moisture >= 85 && " (Auto)"}
        </button>

        <div className="mode-selector">
          <label>
            <input
              type="radio"
              name="mode"
              checked={plantData.isAutoMode}
              onChange={() => handleModeChange(true)}
            />
            Auto Mode (AI)
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              checked={!plantData.isAutoMode}
              onChange={() => handleModeChange(false)}
            />
            Manual Mode
          </label>
        </div>
      </div>
    </div>
  );
}
