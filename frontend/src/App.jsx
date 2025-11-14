// src/App.jsx
import "./App.css";
import Scene from "./components/three/Scene";
import DataPanel from "./components/ui/DataPanel";
import ControlPanel from "./components/ui/ControlPanel";
import MoistureChart from "./components/charts/MoistureChart";
import { usePlantData } from "./hooks/usePlantData";

function App() {
  const { plantData, togglePump, setAutoMode } = usePlantData();

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
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* 3D Visualization Section */}
        <div className="visualization-panel">
          <Scene plantData={plantData} />
        </div>

        {/* Data & Controls Section */}
        <div className="data-panel">
          <DataPanel plantData={plantData} />
          {/* <MoistureChart data={plantData.historicalData} /> */}
          <MoistureChart />
          <ControlPanel
            plantData={plantData}
            togglePump={togglePump}
            setAutoMode={setAutoMode}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
