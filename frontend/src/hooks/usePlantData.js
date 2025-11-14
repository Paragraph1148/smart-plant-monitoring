// src/hooks/usePlantData.js
import { useState, useEffect, useCallback } from "react";

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
    historicalData: [],
  });

  // Generate initial historical data
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
        moisture: Math.max(20, 65 - i * 1.5 + (Math.random() * 10 - 5)),
        pumpActive: false,
      });
    }

    setPlantData((prev) => ({ ...prev, historicalData: initialData }));
  }, []);

  // Natural moisture decrease simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPlantData((prev) => {
        // Only decrease moisture if pump is off and moisture is above 20%
        if (!prev.pumpStatus && prev.moisture > 20) {
          const newMoisture = prev.moisture - Math.random() * 0.5;
          const newTemp = 20 + Math.random() * 8; // Random temp between 20-28°C

          // Add to historical data (keep only last 24 points)
          const newHistorical = [...prev.historicalData];
          if (newHistorical.length >= 24) {
            newHistorical.shift();
          }
          newHistorical.push({
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            moisture: newMoisture,
            pumpActive: false,
          });

          return {
            ...prev,
            moisture: Number(newMoisture.toFixed(1)),
            temperature: Number(newTemp.toFixed(1)),
            historicalData: newHistorical,
          };
        }
        return prev;
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Pump effect - increase moisture when pump is on
  useEffect(() => {
    if (!plantData.pumpStatus) return;

    const pumpInterval = setInterval(() => {
      setPlantData((prev) => {
        if (prev.pumpStatus && prev.moisture < 85) {
          const newMoisture = prev.moisture + 8; // Fast increase when pumping

          // Update historical data with pump activity
          const newHistorical = [...prev.historicalData];
          if (newHistorical.length >= 24) {
            newHistorical.shift();
          }
          newHistorical.push({
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            moisture: newMoisture,
            pumpActive: true,
          });

          return {
            ...prev,
            moisture: Number(newMoisture.toFixed(1)),
            historicalData: newHistorical,
          };
        } else if (prev.moisture >= 85) {
          // Auto turn off pump when target reached
          return {
            ...prev,
            pumpStatus: false,
          };
        }
        return prev;
      });
    }, 1000); // Fast updates when pumping

    return () => clearInterval(pumpInterval);
  }, [plantData.pumpStatus]);

  const togglePump = useCallback(() => {
    setPlantData((prev) => {
      const newPumpStatus = !prev.pumpStatus;

      if (newPumpStatus) {
        // When turning pump ON, update last watered time
        return {
          ...prev,
          pumpStatus: newPumpStatus,
          lastWatered: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      }

      // When turning pump OFF
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

  return {
    plantData,
    togglePump,
    setAutoMode,
  };
};
