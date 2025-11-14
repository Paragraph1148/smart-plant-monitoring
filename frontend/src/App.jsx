import { useState } from "react";
import "./App.css";
import Scene from "./components/three/Scene";
import DataPanel from "./components/ui/DataPanel";
import ControlPanel from "./components/ui/ControlPanel";
import MoistureChart from "./components/charts/MoistureChart";
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
  const [plantData, setPlantData] = useState({
    moisture: 65,
    temperature: 22,
    pumpStatus: false,
    lastWatered: "2 hours ago",
  });

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
          <MoistureChart />
          <ControlPanel plantData={plantData} setPlantData={setPlantData} />
        </div>
      </div>
    </div>
  );
}

export default App;
