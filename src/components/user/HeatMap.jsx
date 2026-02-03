import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";
import "./heatmap.css";

const HeatMapProfile = () => {
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:3000/user/activity/heatmap", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch heatmap");

        const data = await res.json();
        setActivityData(data);
      } catch (err) {
        console.error("Heatmap fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmap();
  }, []);

  if (loading) {
    return <p className="heatmap-loading">Loading contributions…</p>;
  }

  return (
    <div className="activity-card">
      <div className="activity-header">
        <h3>Activity</h3>
        <p className="subtitle">Recent Contributions</p>
      </div>

      <div className="heatmap-wrapper">
        <HeatMap
          value={activityData}
          startDate={new Date(new Date().getFullYear(), 0, 1)}
          rectSize={14}
          space={4}
          rectProps={{ rx: 4, ry: 4 }}
          /* ✅ THIS IS THE REAL FIX */
          style={{ color: "#c9d1d9" }}
          weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
          panelColors={{
            0: "#161b22",
            1: "#0e4429",
            3: "#006d32",
            6: "#26a641",
            10: "#39d353",
          }}
          rectRender={(props, data) => {
            if (!data) return <rect {...props} />;
            return (
              <rect {...props}>
                <title>
                  {`${data.count || 0} contributions on ${data.date}`}
                </title>
              </rect>
            );
          }}
        />
      </div>

      <div className="heatmap-legend">
        <span>Less</span>
        <div className="legend-scale">
          <span className="lvl lvl-0" />
          <span className="lvl lvl-1" />
          <span className="lvl lvl-2" />
          <span className="lvl lvl-3" />
          <span className="lvl lvl-4" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default HeatMapProfile;
