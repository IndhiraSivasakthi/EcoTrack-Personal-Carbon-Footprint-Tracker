import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import "./Dashboard.css";
import API from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trendData, setTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]); 
  const COLORS = [
    '#10b981',  // Green
    '#3b82f6',  // Blue  
    '#f59e0b',  // Amber
    '#ef4444',  // Red
    '#8b5cf6',  // Purple
    '#06b6d4',  // Cyan
    '#84cc16',  // Lime
    '#f97316'   // Orange
  ];
  const getGoalMessage = () => {
  if (goals.progress >= 100) {
    return {
      text: "🎉 Weekly goal achieved! You have reached your limit.",
      type: "success"
    };
  }
  if (goals.progress >= 80) {
    return {
      text: "⚠️ Warning: You are very close to your weekly goal.",
      type: "warning"
    };
  }
  if (goals.progress >= 50) {
    return {
      text: "👍 Good progress. Keep tracking your activities carefully.",
      type: "info"
    };
  }
  return {
    text: "🌱 You are within the safe range. Keep going.",
    type: "safe"
  };
};
  const getEcoMessage = () => {
  if (ecoScore.week === 0 || ecoScore.today === 0) {
    return {
      type: "warning",
      text: "⚠️ Eco score reached 0 because your carbon emission exceeded the safe daily or weekly limit."
    };
  }

  if (ecoScore.week < 40 || ecoScore.today < 40) {
    return {
      type: "alert",
      text: "📉 Your eco score is low. Try reducing high-emission activities to improve it."
    };
  }

  if (ecoScore.week >= 80 && ecoScore.today >= 80) {
    return {
      type: "good",
      text: "🌱 Great job! Your daily and weekly emissions are within a healthy range."
    };
  }

  return {
    type: "normal",
    text: "📊 Your eco score is moderate. Small improvements can raise it further."
  };
};



 const getComparisonMessage = () => {
  const current = parseFloat(comparisonData.current) || 0;
  const previous = parseFloat(comparisonData.previous) || 0;
  const change = parseFloat(comparisonData.change) || 0;

  if (previous === 0 && current === 0) {
    return {
      type: "empty",
      text: "📭 No activity found for this week and last week yet."
    };
  }

  if (previous === 0 && current > 0) {
    return {
      type: "info",
      text: "🆕 No last-week data available, so comparison starts from this week’s activity."
    };
  }

  if (change < 0) {
    return {
      type: "good",
      text: `✅ Great! This week emissions are ${Math.abs(change).toFixed(1)}% lower than last week.`
    };
  }

  if (change > 0) {
    return {
      type: "warning",
      text: `⚠️ This week emissions are ${change.toFixed(1)}% higher than last week. Try reducing high-impact activities.`
    };
  }

  return {
    type: "normal",
    text: "📊 This week and last week emissions are almost the same."
  };
};
  const [comparisonData, setComparisonData] = useState({ current: 0, previous: 0, change: 0 });
  const [ecoScore, setEcoScore] = useState({ week: 0, today: 0 });
  const [goals, setGoals] = useState({ progress: 0, target: 10 });
  
  const getScoreLevel = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'average';
    return 'poor';
  };
const getTrendMessage = () => {
  if (!trendData || trendData.length === 0) {
    return {
      type: "empty",
      text: "📭 No weekly trend data available yet."
    };
  }

  const values = trendData.map(item => Number(item.value) || 0);
  const hasData = values.some(value => value > 0);

  if (!hasData) {
    return {
      type: "empty",
      text: "📭 No emission activity recorded for this week yet."
    };
  }

  const first = values[0];
  const last = values[values.length - 1];
  const max = Math.max(...values);
  const min = Math.min(...values);

  if (last < first) {
    return {
      type: "good",
      text: `✅ Good trend. Emissions dropped from ${first.toFixed(1)}kg to ${last.toFixed(1)}kg this week.`
    };
  }

  if (last > first) {
    return {
      type: "warning",
      text: `⚠️ Emissions increased from ${first.toFixed(1)}kg to ${last.toFixed(1)}kg this week.`
    };
  }

  if (max === min) {
    return {
      type: "normal",
      text: "📊 Emissions stayed almost constant throughout the week."
    };
  }

  return {
    type: "info",
    text: `ℹ️ Emissions changed during the week, ranging between ${min.toFixed(1)}kg and ${max.toFixed(1)}kg.`
  };
};
  const [tips, setTips] = useState([
    { 
      text: "Use public transport for short trips (saves 0.2kg CO₂/km)", 
      category: "transport" 
    },
    { 
      text: "Switch to LED bulbs (saves 0.8kg CO₂ per bulb/year)", 
      category: "energy" 
    },
    { 
      text: "Eat plant-based 2 days/week (saves 1.5kg CO₂/week)", 
      category: "food" 
    }
  ]);

  const handleTipClick = (index) => {
    const tip = tips[index];
    navigator.clipboard.writeText(tip.text);
    // Add success animation via CSS
  };
  
  const fetchDashboard = async () => {
    try {
      const res = await API.get("api/dashboard");
      const data = res.data;

      setStats([
        {
          title: "Total CO₂",
          value: (data.totalCO2 || 0).toFixed(2) + " kg",
          note: "Overall"
        },
        {
          title: "Today CO₂",
          value: (data.todayCO2 || 0).toFixed(2) + " kg",
          note: "Today"
        },
        {
          title: "This Week",
          value: (data.weekCO2 || 0).toFixed(2) + " kg",
          note: "Weekly"
        },
        {
          title: "Activities",
          value: (data.activities || 0).toString(),
          note: "Logged"
        }
        
      ]);

      // NEW: Comparison & Scores
      setComparisonData({
      current: Number((data.weekCO2 || 0).toFixed(1)),
      previous: Number((data.lastWeekCO2 || 0).toFixed(1)),
      change:
        data.lastWeekCO2 && data.lastWeekCO2 > 0
          ? (((data.weekCO2 || 0) - data.lastWeekCO2) / data.lastWeekCO2 * 100).toFixed(1)
          : 0
    });

      setEcoScore({
        week: Math.round(data.ecoScore || 0),
        today: Math.round(data.ecoScoreToday || 0)
      });

      // Goal progress (example calculation)
      const progress = data.weekCO2 ? Math.min(100, (data.weekCO2 / 10) * 100) : 0;
      setGoals({ progress, target: 15 });

    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  // ✅ LOAD ON PAGE OPEN
  useEffect(() => {
    fetchDashboard();
    fetchCharts();
  }, []);

  const fetchCharts = async () => {
    try {
      const trendRes = await API.get("api/activity/trend");
      const categoryRes = await API.get("api/activity/category");
      
      // Convert to chart format
      setTrendData(
        Object.entries(trendRes.data).map(([day, value]) => ({
          day,
          value: parseFloat(value)
        }))
      );

      setCategoryData(
        Object.entries(categoryRes.data).map(([name, value]) => ({
          name,
          value: parseFloat(value)
        }))
      );

    } catch (err) {
      console.error("Chart error:", err);
    }
  };
  const updatePref = async (key, value) => {
  const newPrefs = { ...notificationPrefs, [key]: value };
  setNotificationPrefs(newPrefs);
  
  try {
    await API.patch("/notifications/prefs", newPrefs);
  } catch (error) {
    console.error("Pref update error:", error);
  }
};

  const handleSubmitActivity = async (activityData) => {
    if (!activityData) {
      setIsModalOpen(false);
      return;
    }

    try {
      const res = await API.post("api/activity", activityData);
      console.log("Saved:", res.data);
      setIsModalOpen(false);
      // Refresh dashboard after adding activity
      fetchDashboard();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-intro">
          <span className="section-pill">Track. Reduce. Improve.</span>
          <h1 className="dashboard-title">Your Carbon Dashboard</h1>
          <p className="dashboard-subtitle">
            Monitor daily emissions, spot high-impact habits, and take small actions that lower your footprint over time.
          </p>
        </div>
        <button
          className="dashboard-action"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="dashboard-action__icon">+</span>
          <span>Add Activity</span>
        </button>
      </div>

      <div className="stats-grid">
        {stats.map((item, index) => (
          <div className="stat-card" key={index}>
            <span>{item.title}</span>
            <h3>{item.value}</h3>
            <p>{item.note}</p>
          </div>
        ))}
      </div>

      {/* 🌡️ NEW: Comparison & Goals Section */}
      <div className="comparison-section">
        <div className="comparison-card">
          <h3>📊 Week Comparison</h3>

          <div className="comparison-bars">
          <div className="bar-container">
            <div className="bar-row">
              <div className="bar-label">Last Week</div>
              <div className="bar-number">{comparisonData.previous}kg</div>
            </div>

            <div className="bar-track">
              <div
                className="bar last-week"
                style={{ width: `${Math.max(Math.min(comparisonData.previous * 8, 100), 14)}%` }}
              />
            </div>
          </div>

          <div className="bar-container">
            <div className="bar-row">
              <div className="bar-label">This Week</div>
              <div className="bar-number">{comparisonData.current}kg</div>
            </div>

            <div className="bar-track">
              <div
                className="bar this-week"
                style={{ width: `${Math.max(Math.min(comparisonData.current * 8, 100), 14)}%` }}
              />
            </div>
          </div>
        </div>
          <div className="change-indicator">
            {parseFloat(comparisonData.change) >= 0 ? '📈' : '📉'}
            <span className={parseFloat(comparisonData.change) >= 0 ? 'positive' : 'negative'}>
              {comparisonData.change}% {parseFloat(comparisonData.change) >= 0 ? '↑' : '↓'}
            </span>
          </div>

          <div className={`comparison-message ${getComparisonMessage().type}`}>
            {getComparisonMessage().text}
          </div>
        </div>

        <div className="score-card">
          <div className="eco-score-primary">
            <span className="score-label">🌱 Eco Score</span>
            <div
              className="score-circle"
              style={{
                background: `conic-gradient(#10b981 0deg, #10b981 ${ecoScore.week * 3.6}deg, #e5e7eb ${ecoScore.week * 3.6}deg 360deg)`
              }}
            >
              <span className="score-value">{ecoScore.week}</span>
            </div>
            <span className="score-subtext">This Week</span>
          </div>

          <div className="eco-score-secondary">
            <span>📅 Today: {ecoScore.today}</span>
            <div className={`score-badge ${getScoreLevel(ecoScore.today)}`}>
              {getScoreLevel(ecoScore.today).toUpperCase()}
            </div>
          </div>

          <div className={`eco-message ${getEcoMessage().type}`}>
            {getEcoMessage().text}
          </div>
        </div>

       <div className="goal-card">
        <h3>🎯 Goal Progress</h3>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(goals.progress, 100)}%` }}
          />
          <span className="progress-text">
            {Math.round(goals.progress)}% to {goals.target}kg weekly goal
          </span>
        </div>

        <p className={`goal-message ${getGoalMessage().type}`}>
          {getGoalMessage().text}
        </p>
      </div>
      </div>
      
      

      <div className="dashboard-grid">
        {/* 📈 Weekly Trend - WITH LABELS */}
        <div className="dashboard-box large-box">
  <h2>Weekly Trend</h2>

  <ResponsiveContainer width="100%" height={280}>
    <LineChart data={trendData}>
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#10b981"
        strokeWidth={4}
        dot={{ fill: '#10b981', strokeWidth: 2 }}
        label={{
          position: 'top',
          valueFormatter: (value) => `${value.toFixed(1)}kg`,
          fill: '#10b981',
          fontWeight: 'bold'
        }}
      />
    </LineChart>
  </ResponsiveContainer>

  <div className={`trend-message ${getTrendMessage().type}`}>
    {getTrendMessage().text}
  </div>
</div>

        {/* 🥧 Category Breakdown - MAXIMUM SIZE */}
        <div className="dashboard-box">
        <h2>Category Breakdown</h2>

        {categoryData.length > 0 && categoryData.some(item => item.value > 0) ? (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                innerRadius={50}
                paddingAngle={3}
                label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                labelLine
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-empty-state">
          <div className="chart-empty-icon">🥧</div>
          <h3>No category data yet</h3>
          <p>Add transport, food, or energy activities to view the category breakdown here.</p>
          <div className="chart-empty-hint">Start by adding your first activity</div>
        </div>
        )}
      </div>

        
                            
        <div className="dashboard-box tip-card">
          <div className="tips-header">
            <h2>✨ Smart Tips</h2>
            <span className="tip-counter">{tips.length} tips</span>
          </div>
          <ul className="tip-list">
            {tips.map((tip, index) => (
              <li 
                key={index}
                className="tip-item"
                onClick={() => handleTipClick(index)}
              >
                <div className="tip-icon">💡</div>
                <div className="tip-content">
                  <span className="tip-number">Tip {index + 1}</span>
                  <p>{tip.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🌱 Add New Activity</h2>
              <button 
                className="close-btn" 
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            <ActivityForm onSubmit={handleSubmitActivity} />
          </div>
        </div>
      )}
    </div>
  );
}

function ActivityForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    type: "",
    subtype: "",
    quantity: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    dietType: "",
    mealWeight: "normal",
    region: "",
    distanceType: "",
    fuelType: "",
    applianceType: ""
  });

  const activityTypes = [
    { label: "Transport 🚗", value: "transport" },
    { label: "Food 🍔", value: "food" },
    { label: "Energy ⚡", value: "energy" }
  ];

  const subtypeOptions = {
    transport: ["Car", "Bike", "Bus", "Train"],
    food: ["Breakfast", "Lunch", "Dinner", "Snack"],
    energy: ["Electricity", "LPG Gas", "AC Usage"]
  };

  const units = {
    transport: "km",
    food: "meals",
    energy: "kWh"
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setFormData({ 
      ...formData, 
      type, 
      subtype: "",
      distanceType: "",
      fuelType: "",
      applianceType: "",
      dietType: "",
      mealWeight: "normal",
      region: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.type || !formData.subtype || !formData.quantity) return;
    
    onSubmit({ 
      ...formData, 
      quantity: parseFloat(formData.quantity),
      unit: units[formData.type]
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="activity-form">
      <div className="form-group">
        <label>1. Activity Type *</label>
        <select name="type" value={formData.type} onChange={handleTypeChange} required>
          <option value="">Select type</option>
          {activityTypes.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>2. Subtype *</label>
        <select 
          name="subtype" 
          value={formData.subtype} 
          onChange={handleInputChange} 
          required 
          disabled={!formData.type}
        >
          <option value="">Select subtype</option>
          {subtypeOptions[formData.type]?.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>3. Quantity *</label>
          <input 
            type="number" 
            name="quantity" 
            value={formData.quantity} 
            onChange={handleInputChange}
            step="0.1" 
            min="0"
            placeholder="e.g. 1.5"
            required 
          />
        </div>
        <div className="form-group">
          <label>4. Unit</label>
          <input value={formData.type ? units[formData.type] : ""} readOnly />
        </div>
      </div>

      {/* TRANSPORT FIELDS */}
      {formData.type === "transport" && (
        <>
          <div className="form-row">
            <div className="form-group">
              <label>5. Distance Type</label>
              <select 
                name="distanceType" 
                value={formData.distanceType} 
                onChange={handleInputChange}
              >
                <option value="">select tip</option>
                <option value="one-way">One-way</option>
                <option value="round-trip">Round Trip</option>
              </select>
            </div>
            <div className="form-group">
              <label>6. Fuel Type</label>
              <select 
                name="fuelType" 
                value={formData.fuelType} 
                onChange={handleInputChange}
              >
                <option value="">Select Type</option>
                <option value="petrol">🛢️ Petrol</option>
                <option value="diesel">⛽ Diesel</option>
                <option value="cng">🟢 CNG</option>
                <option value="electric">⚡ Electric</option>
              </select>
            </div>
          </div>
        </>
      )}

      {/* FOOD FIELDS */}
      {formData.type === "food" && (
        <>
          <div className="form-row">
            <div className="form-group">
              <label>5. Diet Type *</label>
              <select 
                name="dietType" 
                value={formData.dietType} 
                onChange={handleInputChange}
                required
              >
                <option value="">Select diet</option>
                <option value="vegetarian">🌱 Vegetarian</option>
                <option value="non-veg">🍗 Non-Veg</option>
                <option value="dairy">🧀 Dairy-Heavy</option>
                <option value="mixed">🥗 Mixed</option>
              </select>
            </div>
            <div className="form-group">
              <label>6. Meal Weight</label>
              <select 
                name="mealWeight" 
                value={formData.mealWeight} 
                onChange={handleInputChange}
              >
                <option value="light">🍲 Light</option>
                <option value="normal">🍛 Normal</option>
                <option value="heavy">🍽️ Heavy</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>7. Region</label>
            <select 
              name="region" 
              value={formData.region} 
              onChange={handleInputChange}
            >
              <option value="">select region</option>
              <option value="indian">Indian</option>
              <option value="western">Western</option>
            </select>
          </div>
        </>
      )}

      {/* ENERGY FIELDS */}
      {formData.type === "energy" && (
        <>
          <div className="form-group">
            <label>5. Appliance Type</label>
            <select 
              name="applianceType" 
              value={formData.applianceType} 
              onChange={handleInputChange}
            >
              <option value="">Select Type</option>
              <option value="general">📜 General</option>
              <option value="ac">❄️ AC</option>
              <option value="fan">💨 Fan</option>
              <option value="fridge">🧊 Fridge</option>
              <option value="washing-machine">🧺 Washing Machine</option>
            </select>
          </div>
        </>
      )}

      <div className="form-group">
        <label>{formData.type === "transport" || formData.type === "food" ? "9" : "8"}. Date *</label>
        <input 
          type="date" 
          name="date" 
          value={formData.date} 
          onChange={handleInputChange} 
          required 
        />
      </div>

      <div className="form-group">
        <label>{formData.type === "transport" || formData.type === "food" ? "10" : "9"}. Notes (Optional)</label>
        <textarea 
          name="notes" 
          value={formData.notes} 
          onChange={handleInputChange}
          placeholder='e.g. "Office travel petrol car", "Biryani dinner"'
        />
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={() => onSubmit(null)}>
          Cancel
        </button>
        <button 
          type="submit" 
          className="submit-btn" 
          disabled={!formData.type || !formData.subtype || !formData.quantity}
        >
          Add Activity
        </button>
      </div>
    </form>
  );
}
