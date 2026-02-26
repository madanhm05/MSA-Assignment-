import React from "react";
import { FaPlus } from "react-icons/fa";
// import "../assets/css/dashboardContent.css";
import "../../assets/css/dashboardContent.css";

const DashboardContent = () => {
  return (
    <div className="dashboard-content">
      {/* Top Bar */}
      <div className="top-bar">
        <FaPlus className="add-icon" title="Add New" />
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <div className="left-section">
          <p>Hello</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
