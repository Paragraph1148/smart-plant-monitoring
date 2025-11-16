// backend/server.js

import express from "express";
import cors from "cors";
import { PlantAIModel } from "./trainModel.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize AI Model
const aiModel = new PlantAIModel();

// Simulation state
let simulationState = {
  moisture: 65,
  temperature: 22,
  pumpStatus: false,
  lastWatered: new Date(),
  isAutoMode: true,
  aiEnabled: true,
  historicalData: [],
};

// Generate initial historical data
function generateInitialData() {
  const data = [];
  const now = new Date();

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(now.getHours() - i);
    data.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      moisture: Math.max(25, 65 - i * 1.2 + (Math.random() * 8 - 4)),
      temperature: 20 + Math.random() * 10,
      pumpActive: false,
    });
  }

  simulationState.historicalData = data;
}

generateInitialData();

// Natural environment simulation
function simulateEnvironment() {
  // Natural moisture decrease (faster when hot)
  const tempEffect = simulationState.temperature > 26 ? 1.5 : 1.0;
  const moistureLoss = 0.3 * tempEffect + Math.random() * 0.4;

  if (!simulationState.pumpStatus && simulationState.moisture > 20) {
    simulationState.moisture = Math.max(
      20,
      simulationState.moisture - moistureLoss
    );
  }

  // Temperature fluctuation (more realistic)
  simulationState.temperature = 20 + Math.random() * 12; // 20-32°C

  // AI Decision Making in Auto Mode
  if (
    simulationState.isAutoMode &&
    simulationState.aiEnabled &&
    !simulationState.pumpStatus
  ) {
    const timeSinceWatering =
      (new Date() - simulationState.lastWatered) / (1000 * 60 * 60); // hours

    const aiDecision = aiModel.shouldWater(
      simulationState.moisture,
      simulationState.temperature,
      timeSinceWatering
    );

    if (aiDecision.shouldWater && simulationState.moisture < 75) {
      simulationState.pumpStatus = true;
      simulationState.lastWatered = new Date();
      console.log(`🤖 AI decided to water plant. Reason: ${aiDecision.reason}`);
    }
  }

  // Pump effect - increase moisture when active
  if (simulationState.pumpStatus) {
    simulationState.moisture = Math.min(85, simulationState.moisture + 6);

    if (simulationState.moisture >= 75) {
      simulationState.pumpStatus = false;
      // Provide feedback to AI model
      const timeSinceWatering =
        (new Date() - simulationState.lastWatered) / (1000 * 60 * 60);
      aiModel.updateModel(
        simulationState.moisture,
        simulationState.temperature,
        timeSinceWatering,
        true
      );
    }
  }

  // Update historical data
  const newDataPoint = {
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    moisture: Math.round(simulationState.moisture * 10) / 10,
    temperature: Math.round(simulationState.temperature * 10) / 10,
    pumpActive: simulationState.pumpStatus,
  };

  simulationState.historicalData.push(newDataPoint);
  if (simulationState.historicalData.length > 50) {
    simulationState.historicalData.shift();
  }
}

// APIs
app.get("/api/status", (req, res) => {
  const timeSinceWatering =
    Math.round(
      (new Date() - simulationState.lastWatered) / (1000 * 60 * 60 * 10)
    ) / 10; // hours

  const aiDecision = aiModel.shouldWater(
    simulationState.moisture,
    simulationState.temperature,
    timeSinceWatering
  );

  res.json({
    ...simulationState,
    moisture: Math.round(simulationState.moisture * 10) / 10,
    temperature: Math.round(simulationState.temperature * 10) / 10,
    lastWatered: simulationState.lastWatered.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    aiDecision,
    timeSinceWatering: `${timeSinceWatering}h`,
  });
});

app.post("/api/pump/toggle", (req, res) => {
  simulationState.pumpStatus = !simulationState.pumpStatus;

  if (simulationState.pumpStatus) {
    simulationState.lastWatered = new Date();
    // If manually activated, provide feedback to AI
    const timeSinceWatering =
      (new Date() - simulationState.lastWatered) / (1000 * 60 * 60);
    aiModel.updateModel(
      simulationState.moisture,
      simulationState.temperature,
      timeSinceWatering,
      true
    );
  }

  res.json({
    success: true,
    pumpStatus: simulationState.pumpStatus,
    lastWatered: simulationState.lastWatered.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });
});

app.post("/api/mode", (req, res) => {
  const { mode } = req.body;
  simulationState.isAutoMode = mode === "auto";
  res.json({ success: true, isAutoMode: simulationState.isAutoMode });
});

app.post("/api/ai/toggle", (req, res) => {
  simulationState.aiEnabled = !simulationState.aiEnabled;
  res.json({ success: true, aiEnabled: simulationState.aiEnabled });
});

app.get("/api/ai/stats", (req, res) => {
  res.json(aiModel.getModelStats());
});

app.get("/api/history", (req, res) => {
  res.json(simulationState.historicalData.slice(-24)); // Last 24 points
});

// Start simulation loop
setInterval(simulateEnvironment, 3000); // Update every 3 seconds

app.listen(PORT, () => {
  console.log(`🌱 Smart Plant Backend running on port ${PORT}`);
  console.log(
    `🤖 AI Model initialized with threshold: ${aiModel.moistureThreshold}%`
  );
});
