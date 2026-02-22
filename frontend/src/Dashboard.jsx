import { useState, useEffect } from "react";
import "./App.css";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState("");
  const [alert, setAlert] = useState(false);
  const [smsMessage, setSmsMessage] = useState("");
  const [energyLimit, setEnergyLimit] = useState(10); // 👈 Dynamic limit

  const appliances = [
  { id: 1, name: "AC", power: 1.5, hours: 4 },
  { id: 2, name: "Fridge", power: 0.3, hours: 24 },
  { id: 3, name: "TV", power: 0.2, hours: 5 },
];

  const load = async (filter) => {
    try {
      setLoading(true);
      setActive(filter);
      const res = await fetch(
        `http://localhost:5000/api/energy?filter=${filter}`
      );
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Overuse Detection
  useEffect(() => {
    if (data && data.energy > energyLimit) {
      setAlert(true);
      const message = `High energy usage detected! (${data.energy} kWh exceeds limit ${energyLimit} kWh)`;
      setSmsMessage(message);
      console.log("📩 SMS Sent:", message);
    } else {
      setAlert(false);
      setSmsMessage("");
    }
  }, [data, energyLimit]); // 👈 Important dependency

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>⚡ SmartWatt Dashboard</h1>

        {/* 👇 Dynamic Threshold Input */}
        <div className="limit-control">
          <label>Set Energy Limit (kWh): </label>
          <input
            type="number"
            value={energyLimit}
            onChange={(e) => setEnergyLimit(Number(e.target.value))}
          />
        </div>

        <div className="filters">
          <button
            className={active === "today" ? "active" : ""}
            onClick={() => load("today")}
          >
            Today
          </button>
          <button
            className={active === "month" ? "active" : ""}
            onClick={() => load("month")}
          >
            Month
          </button>
          <button
            className={active === "year" ? "active" : ""}
            onClick={() => load("year")}
          >
            Year
          </button>
        </div>
      </div>

      {loading && <p className="loading">Loading data...</p>}

      {alert && (
        <div className="alert-box">
          ⚠ High Energy Usage! <br />
          {smsMessage}
        </div>
      )}

      {data && (
        <div className="card-grid">
          <div className="card">
            <h3>Energy Used</h3>
            <p>{data.energy} kWh</p>
          </div>

          <div className="card">
            <h3>Cost</h3>
            <p>₹{data.cost}</p>
          </div>

          <div className="card">
            <h3>Carbon</h3>
            <p>{data.carbon} kg CO₂</p>
          </div>

          <div className="card">
            <h3>Predicted Energy</h3>
            <p>{data.predictedPower} kWh</p>
          </div>

          <div className="card">
            <h3>Predicted Cost</h3>
            <p>₹{data.predictedCost}</p>
          </div>
        </div>
      )}
    </div>
  );
}