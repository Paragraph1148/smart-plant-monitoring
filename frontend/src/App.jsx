// src/App.jsx
import "./App.css";
import Scene from "./components/three/Scene";
import DataPanel from "./components/ui/DataPanel";
import ControlPanel from "./components/ui/ControlPanel";
import MoistureChart from "./components/charts/MoistureChart";
import { usePlantData } from "./hooks/usePlantData";

function App() {
  const { plantData, togglePump, setAutoMode, toggleAI, loading } =
    usePlantData();

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>🌱 Smart Plant Monitoring System</h1>
        <div className="status-indicators">
          <span
            className={`status ${plantData.pumpStatus ? "watering" : "idle"}`}
          >
            {plantData.pumpStatus ? "WATERING" : "IDLE"}
          </span>
          <span
            className={`status ${plantData.isAutoMode ? "auto" : "manual"}`}
          >
            {plantData.isAutoMode ? "AUTO" : "MANUAL"}
          </span>
          <span
            className={`status ${plantData.aiEnabled ? "ai-on" : "ai-off"}`}
          >
            AI: {plantData.aiEnabled ? "ON" : "OFF"}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* 3D Visualization Section */}
        <div className="visualization-panel">
          <Scene plantData={plantData} />
        </div>

        {/* Data & Controls Section - Now Scrollable */}
        <div className="data-panel">
          {/* Data Panel with proper spacing */}
          <div className="data-panel-component">
            <DataPanel plantData={plantData} />
          </div>

          {/* Moisture Chart with fixed height */}
          <MoistureChart data={plantData.historicalData} />

          {/* Control Panel with proper spacing */}
          <div className="control-panel">
            <ControlPanel
              plantData={plantData}
              togglePump={togglePump}
              setAutoMode={setAutoMode}
              toggleAI={toggleAI}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
