import React, { useState } from "react";
import { FaBell, FaUser, FaPowerOff, FaUserTie, FaSortAmountDown } from "react-icons/fa";
import { BsDatabaseFillCheck } from "react-icons/bs";
import "../../assets/css/dashboard.css";
import LeadershipOverview from "../pages/LeadershipOverview";
import DrilldownView from "../pages/DrilldownView";
import DataQuality from "../pages/DataQuality";

function Dashboard({ onLogout }) {
  const [showLogout, setShowLogout] = useState(false);
  const [activePage, setActivePage] = useState("overview");

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="navbar-right">
          <FaBell className="icon" title="Notifications" />
          <span className="divider"></span>
          <FaUser className="icon" title="Profile" />
        </div>
      </header>

      {/* Main Layout */}
      <div className="main-layout">

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="top-icons">
            <FaUserTie
              className={`icon ${activePage === "overview" ? "active" : ""}`}
              title="Leadership Overview"
              onClick={() => setActivePage("overview")}
            />

            <FaSortAmountDown
              className={`icon ${activePage === "drilldown" ? "active" : ""}`}
              title="Drilldown View"
              onClick={() => setActivePage("drilldown")}
            />

            <BsDatabaseFillCheck
              className={`icon ${activePage === "data-quality" ? "active" : ""}`}
              title="Data Quality & Assumptions"
              onClick={() => setActivePage("data-quality")}
            />
          </div>

          <div className="bottom-icons">
            <FaPowerOff
              className="icon"
              title="Logout"
              onClick={() => setShowLogout(true)}
            />
          </div>
        </aside>

        {/* Logout Modal */}
        {showLogout && (
          <div className="logout-overlay">
            <div className="logout-popup">
              <p>Are you sure you want to logout?</p>
              <div className="logout-buttons">
                <button onClick={onLogout}>Logout</button>
                <button onClick={() => setShowLogout(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="content">
          {activePage === "overview" && <LeadershipOverview />}
          {activePage === "drilldown" && <DrilldownView />}
          {activePage === "data-quality" && <DataQuality />}

          {!activePage && (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              Please select a menu option
            </p>
          )}
        </main>

      </div>
    </div>
  );
}

export default Dashboard;