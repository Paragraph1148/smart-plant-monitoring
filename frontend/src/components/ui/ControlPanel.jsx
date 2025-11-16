// src/components/ui/ControlPanel.jsx
export default function ControlPanel({
  plantData,
  togglePump,
  setAutoMode,
  toggleAI,
  loading,
}) {
  const handleModeChange = (isAuto) => {
    setAutoMode(isAuto);
  };

  return (
    <div className="control-panel">
      <h2>Controls</h2>

      <div className="control-group">
        <button
          className={`control-btn ${plantData.pumpStatus ? "active" : ""}`}
          onClick={togglePump}
          disabled={
            loading || (plantData.isAutoMode && plantData.moisture >= 85)
          }
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

        <button
          className={`control-btn ${plantData.aiEnabled ? "ai-on" : "ai-off"}`}
          onClick={toggleAI}
        >
          {plantData.aiEnabled ? "🤖 AI Enabled" : "❌ AI Disabled"}
        </button>

        {plantData.aiDecision && (
          <div className="ai-info">
            <h4>AI Decision</h4>
            <p>
              <strong>Action:</strong>{" "}
              {plantData.aiDecision.shouldWater ? "WATER" : "HOLD"}
            </p>
            <p>
              <strong>Confidence:</strong> {plantData.aiDecision.confidence}%
            </p>
            <p>
              <strong>Reason:</strong> {plantData.aiDecision.reason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
