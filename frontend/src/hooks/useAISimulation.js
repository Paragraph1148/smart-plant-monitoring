// src/hooks/useAISimulation.js
import { useEffect } from "react";

export const useAISimulation = (plantData, togglePump, setAutoMode) => {
  useEffect(() => {
    if (!plantData.isAutoMode) return;

    const aiDecisionInterval = setInterval(() => {
      // AI Decision Making Logic
      const { moisture, temperature, pumpStatus } = plantData;

      // Rule-based AI (this would be replaced with real ML model)
      const shouldWater =
        moisture < 35 && // Low moisture
        !pumpStatus && // Pump isn't already running
        temperature < 35; // Not too hot (evaporation concern)

      const shouldStopWatering =
        moisture >= 80 || // Target moisture reached
        (moisture >= 60 && temperature > 30); // Adjust for evaporation

      if (shouldWater && !pumpStatus) {
        console.log("🤖 AI: Starting pump - plant needs water");
        togglePump();
      } else if (shouldStopWatering && pumpStatus) {
        console.log("🤖 AI: Stopping pump - optimal moisture reached");
        togglePump();
      }
    }, 5000); // AI checks every 5 seconds

    return () => clearInterval(aiDecisionInterval);
  }, [plantData, togglePump, setAutoMode]);
};
