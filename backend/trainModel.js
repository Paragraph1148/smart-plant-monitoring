//backend/trainModel.js
// Simple ML simulation - we'll create a "smart" watering decision maker
export class PlantAIModel {
  constructor() {
    this.learningRate = 0.1;
    this.moistureThreshold = 35; // Initial threshold
    this.temperatureWeight = 0.3;
    this.historicalData = [];
    this.decisionHistory = [];
  }

  // Train the model with new data
  updateModel(currentMoisture, temperature, timeSinceWatering, pumpWasGood) {
    // Store historical data
    this.historicalData.push({
      moisture: currentMoisture,
      temperature,
      timeSinceWatering,
      timestamp: new Date(),
      pumpWasGood,
    });

    // Keep only last 100 records
    if (this.historicalData.length > 100) {
      this.historicalData.shift();
    }

    // Simple reinforcement learning
    if (pumpWasGood !== undefined) {
      if (pumpWasGood) {
        // If pumping was good, we might be able to wait longer
        this.moistureThreshold = Math.max(25, this.moistureThreshold - 2);
      } else {
        // If pumping was bad (too late/early), adjust threshold
        this.moistureThreshold = Math.min(45, this.moistureThreshold + 3);
      }
    }

    // Adjust for temperature (plants dry faster in heat)
    if (temperature > 28) {
      this.moistureThreshold += 5; // Water sooner in heat
    } else if (temperature < 18) {
      this.moistureThreshold -= 3; // Can wait longer in cool temps
    }

    console.log(`AI Model Updated - Threshold: ${this.moistureThreshold}%`);
  }

  // Make watering decision
  shouldWater(moisture, temperature, timeSinceWatering) {
    const baseDecision = moisture < this.moistureThreshold;

    // Consider temperature effect
    const tempAdjustment = temperature > 26 ? 0.8 : 1.0;
    const adjustedMoisture = moisture * tempAdjustment;

    // Consider time factor - if it's been too long, water anyway
    const timeFactor = timeSinceWatering > 48 ? 0.7 : 1.0; // 48 hours

    const finalDecision =
      adjustedMoisture < this.moistureThreshold * timeFactor;

    const confidence = this.calculateConfidence(moisture, temperature);

    this.decisionHistory.push({
      moisture,
      temperature,
      decision: finalDecision,
      confidence,
      threshold: this.moistureThreshold,
      timestamp: new Date(),
    });

    return {
      shouldWater: finalDecision,
      confidence: Math.round(confidence * 100),
      threshold: Math.round(this.moistureThreshold),
      reason: this.getDecisionReason(
        moisture,
        temperature,
        timeSinceWatering,
        finalDecision
      ),
    };
  }

  calculateConfidence(moisture, temperature) {
    // Higher confidence when moisture is far from threshold
    const distanceFromThreshold = Math.abs(moisture - this.moistureThreshold);
    let confidence = Math.min(distanceFromThreshold / 20, 0.9); // Max 90% confidence

    // Temperature consistency adds confidence
    const tempStability = this.calculateTemperatureStability();
    confidence = (confidence + tempStability) / 2;

    return Math.max(0.3, confidence); // Minimum 30% confidence
  }

  calculateTemperatureStability() {
    if (this.historicalData.length < 5) return 0.7;

    const recentTemps = this.historicalData.slice(-5).map((d) => d.temperature);
    const avgTemp = recentTemps.reduce((a, b) => a + b) / recentTemps.length;
    const variance =
      recentTemps.reduce((a, b) => a + Math.pow(b - avgTemp, 2), 0) /
      recentTemps.length;

    return Math.max(0, 1 - variance / 10); // Less variance = more stability
  }

  getDecisionReason(moisture, temperature, timeSinceWatering, decision) {
    if (decision) {
      if (moisture < 25) return "CRITICAL: Soil too dry";
      if (temperature > 28) return "Hot weather increasing water needs";
      if (timeSinceWatering > 48) return "Extended period since last watering";
      return "Optimal watering time based on soil moisture";
    } else {
      if (moisture > 60) return "Soil moisture sufficient";
      if (temperature < 16) return "Cool temperature reducing water needs";
      return "Within acceptable moisture range";
    }
  }

  getModelStats() {
    return {
      threshold: Math.round(this.moistureThreshold),
      dataPoints: this.historicalData.length,
      recentDecisions: this.decisionHistory.slice(-5),
      accuracy: this.calculateAccuracy(),
    };
  }

  calculateAccuracy() {
    if (this.decisionHistory.length < 10) return "Learning...";

    // Simple accuracy calculation based on moisture levels after decisions
    const recent = this.decisionHistory.slice(-10);
    const goodDecisions = recent.filter((decision) => {
      // Consider it good if moisture stayed between 30-70% after decision
      return decision.moisture >= 30 && decision.moisture <= 70;
    }).length;

    return `${Math.round((goodDecisions / recent.length) * 100)}%`;
  }
}
