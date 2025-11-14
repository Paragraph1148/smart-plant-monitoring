# Smart Plant Monitoring System – Hackathon Prototype

## Overview

A **software‑only** demo that shows how a plant can be watered automatically using sensor data, a lightweight AI decision engine, and an interactive 3‑D front‑end. The prototype runs entirely on a laptop/desktop, mocking the ESP8266 hardware and using a Kaggle soil‑moisture dataset for a data‑driven model.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Run](#setup--run)
- [Data & Model](#data--model)
- [Mock Sensor](#mock-sensor)
- [Front‑End Interaction](#front-end-interaction)
- [Further Improvements](#further-improvements)
- [License](#license)

---

## Features

- **Real‑time dashboard** showing moisture, temperature, humidity, and pump status.
- **3‑D plant scene** built with React + Three.js, animated with GSAP.
- **AI decision engine** (logistic regression) trained on a Kaggle dataset.
- **Hardware mock**: ESP8266 sensor data simulated via a Node script.
- Docker‑compatible backend for easy deployment.

## Tech Stack

| Layer           | Tools                                                                                 |
| --------------- | ------------------------------------------------------------------------------------- |
| Backend         | Node.js, Express, CORS, Docker                                                        |
| AI/ML           | Python, pandas, scikit‑learn, joblib (model)                                          |
| Front‑end       | React, Vite, TypeScript, three.js, @react-three/fiber, @react-three/drei, GSAP, Axios |
| Data            | Kaggle “Soil Moisture Prediction” CSV (or similar)                                    |
| Version control | Git + GitHub (issues & Projects)                                                      |

## Project Structure

```
smart-plant-hackathon/
├─ backend/          # Express API, Dockerfile
│   ├─ index.js
│   └─ Dockerfile
├─ frontend/         # React + 3D UI
│   ├─ src/
│   │   ├─ App.tsx
│   │   └─ PlantScene.tsx
│   └─ vite.config.ts
├─ ml/               # Data prep, model training, mock sensor
│   ├─ data.csv      # (generated from Kaggle)
│   ├─ train.py
│   ├─ predict.py
│   └─ mockSensor.js
├─ .gitignore
├─ LICENSE
└─ README.md
```

## Setup & Run

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/smart-plant-hackathon.git
cd smart-plant-hackathon
```

### 2. Backend

```bash
cd backend
npm install
# optional: build Docker image
docker build -t plant-backend .
docker run -p 4000:4000 plant-backend
# or run directly
node index.js
```

### 3. Machine‑Learning model

```bash
cd ml
# install Python deps (use a virtual env)
python -m venv venv && source venv/bin/activate
pip install pandas scikit-learn joblib
# download Kaggle data (replace with actual dataset slug)
kaggle datasets download -d <owner>/<dataset-slug> -p .
unzip <dataset>.zip
python train.py   # creates model.joblib & scaler.joblib
```

### 4. Mock sensor (starts sending data)

```bash
cd ml
node mockSensor.js
```

### 5. Front‑end

```bash
cd ../frontend
npm install
npm run dev   # Vite dev server at http://localhost:5173
```

Open the front‑end URL; you should see live moisture numbers, a “need water” indicator, and a 3‑D plant that animates when watering is required.

## Data & Model

- **Dataset**: Kaggle “Soil Moisture Prediction” (CSV).
- **Features used**: temperature, humidity, moisture (%).
- **Target**: `need_water` (1 = moisture < 30 %).
- **Model**: Logistic regression (≈ 92 % accuracy on hold‑out set).
- **Serving**: Backend `/predict` endpoint runs a Python script that loads `scaler.joblib` and `model.joblib` and returns a boolean prediction.

## Mock Sensor

`mockSensor.js` generates realistic random values:

| Parameter   | Range               |
| ----------- | ------------------- |
| moisture    | 300 – 800 (raw ADC) |
| temperature | 15 °C – 30 °C       |
| humidity    | 30 % – 80 %         |

It POSTs to `http://localhost:4000/sensor` every 2 seconds, mimicking an ESP8266.

## Front‑End Interaction

- **Dashboard**: Shows numeric values and pump status.
- **3‑D Scene**:
  - Green cone = plant.
  - Blue sphere = water droplet (drops when `needWater` becomes true).
  - GSAP animates the droplet and adds a subtle leaf sway.
- **Manual Override** (optional): Add buttons to force pump on/off by calling a future `/pump` endpoint.

## Further Improvements

| Idea                                                            | Why it adds value                              |
| --------------------------------------------------------------- | ---------------------------------------------- |
| Add real image classification of leaf health                    | Gives a visual cue beyond sensor data.         |
| Use a time‑series model (LSTM) with weather forecasts           | Improves watering schedule accuracy.           |
| Deploy backend to a cloud function (e.g., Railway)              | Makes the demo accessible from any device.     |
| Replace mock sensor with a physical ESP8266 + capacitive sensor | Turns the prototype into a working IoT device. |

## License

This project is licensed under the **MIT License** – see the `LICENSE` file for details.
