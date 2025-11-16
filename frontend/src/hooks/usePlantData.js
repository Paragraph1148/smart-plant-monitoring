// src/hooks/usePlantData.js
import { useState, useEffect, useCallback } from "react";

// For now, let's use the local simulation until the backend is ready
export const usePlantData = () => {
  const [plantData, setPlantData] = useState({
    moisture: 65,
    temperature: 22,
    pumpStatus: false,
    lastWatered: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    isAutoMode: true,
    aiEnabled: true,
    aiDecision: {
      shouldWater: false,
      confidence: 75,
      reason: "Monitoring plant health",
    },
    timeSinceWatering: "2h",
    historicalData: [],
  });

  const [loading, setLoading] = useState(false);

  // Initialize historical data
  useEffect(() => {
    const initialData = [];
    const now = new Date();

    for (let i = 23; i >= 0; i--) {
      const time = new Date(now);
      time.setHours(now.getHours() - i);
      initialData.push({
        time: time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        moisture: Math.max(25, 65 - i * 1.2 + (Math.random() * 8 - 4)),
        temperature: 20 + Math.random() * 10,
        pumpActive: false,
      });
    }

    setPlantData((prev) => ({ ...prev, historicalData: initialData }));
  }, []);

  // Natural environment simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPlantData((prev) => {
        // Only decrease moisture if pump is off and moisture is above 20%
        if (!prev.pumpStatus && prev.moisture > 20) {
          const tempEffect = prev.temperature > 26 ? 1.5 : 1.0;
          const moistureLoss = 0.3 * tempEffect + Math.random() * 0.4;
          const newMoisture = prev.moisture - moistureLoss;
          const newTemp = 20 + Math.random() * 12;

          // Add to historical data
          const newHistorical = [...prev.historicalData];
          if (newHistorical.length >= 50) {
            newHistorical.shift();
          }
          newHistorical.push({
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            moisture: Math.round(newMoisture * 10) / 10,
            temperature: Math.round(newTemp * 10) / 10,
            pumpActive: false,
          });

          // Simple AI decision simulation
          const shouldWater = newMoisture < 35;
          const confidence = Math.round(Math.max(30, 100 - newMoisture * 1.5));
          const reason = shouldWater
            ? "Soil moisture below optimal level"
            : "Moisture levels adequate";

          return {
            ...prev,
            moisture: Math.round(Math.max(20, newMoisture) * 10) / 10,
            temperature: Math.round(newTemp * 10) / 10,
            historicalData: newHistorical,
            aiDecision: {
              shouldWater,
              confidence,
              reason,
            },
          };
        }
        return prev;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Pump effect
  useEffect(() => {
    if (!plantData.pumpStatus) return;

    const pumpInterval = setInterval(() => {
      setPlantData((prev) => {
        if (prev.pumpStatus && prev.moisture < 85) {
          const newMoisture = prev.moisture + 8;

          // Update historical data
          const newHistorical = [...prev.historicalData];
          if (newHistorical.length >= 50) {
            newHistorical.shift();
          }
          newHistorical.push({
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            moisture: Math.round(newMoisture * 10) / 10,
            temperature: prev.temperature,
            pumpActive: true,
          });

          return {
            ...prev,
            moisture: Math.round(Math.min(85, newMoisture) * 10) / 10,
            historicalData: newHistorical,
          };
        } else if (prev.moisture >= 85) {
          // Auto turn off pump
          return {
            ...prev,
            pumpStatus: false,
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(pumpInterval);
  }, [plantData.pumpStatus]);

  const togglePump = useCallback(() => {
    setPlantData((prev) => {
      const newPumpStatus = !prev.pumpStatus;

      if (newPumpStatus) {
        // When turning pump ON
        return {
          ...prev,
          pumpStatus: newPumpStatus,
          lastWatered: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      }

      return {
        ...prev,
        pumpStatus: newPumpStatus,
      };
    });
  }, []);

  const setAutoMode = useCallback((isAuto) => {
    setPlantData((prev) => ({
      ...prev,
      isAutoMode: isAuto,
    }));
  }, []);

  const toggleAI = useCallback(() => {
    setPlantData((prev) => ({
      ...prev,
      aiEnabled: !prev.aiEnabled,
    }));
  }, []);

  return {
    plantData,
    togglePump,
    setAutoMode,
    toggleAI,
    loading,
  };
};
