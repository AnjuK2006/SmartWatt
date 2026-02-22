const express = require("express");
const router = express.Router();
const { exec } = require("child_process");

const EMISSION = 0.82; // kg CO2 per kWh

// ---------- COST CALCULATION ----------
function calculateCost(power, hours) {
  const kWh = (power * hours) / 1000;

  let rate;
  if (kWh <= 400) rate = 4.875;
  else if (kWh <= 500) rate = 6.55;
  else if (kWh <= 600) rate = 8.675;
  else if (kWh <= 800) rate = 9.8;
  else if (kWh <= 1000) rate = 10.875;
  else rate = 11.975;

  return parseFloat((kWh * rate).toFixed(2));
}

// ---------- FAKE SENSOR DATA ----------
function generateHourlyPower(hours) {
  return Array.from({ length: hours }, () =>
    +(Math.random() * 1200 + 300).toFixed(2)
  );
}

// ---------- JS FALLBACK PREDICTION ----------
function predictPowerJS(data) {
  const last5 = data.slice(-5);
  return last5.reduce((a, b) => a + b, 0) / last5.length;
}

// ---------- API ----------
router.get("/energy", (req, res) => {
  const filter = req.query.filter;

  let hours = 24;
  if (filter === "month") hours = 24 * 30;
  if (filter === "year") hours = 24 * 365;

  const powerData = generateHourlyPower(hours);

  const avgPower =
    powerData.reduce((a, b) => a + b, 0) / powerData.length;

  const energyKWh = (avgPower * hours) / 1000;
  const cost = calculateCost(avgPower, hours);

  // Last 10 readings for ML
  const values = powerData.slice(-10).join(",");

  const pythonPath = "D:\\smarttwattproj\\backend\\venv\\Scripts\\python.exe"; // your venv Python

  exec(`${pythonPath} ml/energy_prediction.py ${values}`, (err, stdout) => {
    let predictedPower;

    if (err) {
      console.error("ML prediction failed, using JS fallback:", err);
      predictedPower = predictPowerJS(powerData);
    } else {
      predictedPower = parseFloat(stdout.toString().trim());
      if (isNaN(predictedPower)) predictedPower = predictPowerJS(powerData);
    }

    const predictedCost = calculateCost(predictedPower, hours);

    res.json({
      hours,
      averagePower: avgPower.toFixed(2),
      energy: energyKWh.toFixed(2),
      cost,
      carbon: (energyKWh * EMISSION).toFixed(2),
      predictedPower: predictedPower.toFixed(2),
      predictedCost
    });
  });
});

module.exports = router;