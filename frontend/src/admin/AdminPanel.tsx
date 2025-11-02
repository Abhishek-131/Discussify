import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import UsersView from "./components/UserView";
import CommunitiesView from "./components/CommunitiesView";
import "./components/Admin.css";

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="admin-wrapper">
      {/* Sticky Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="admin-main">
        <div className="admin-navbar">
          <h5 className="mb-0 text-white">Discussify Admin Panel</h5>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>

        <div className="admin-content">
          {activeTab === "dashboard" && <DashboardView />}
          {activeTab === "users" && <UsersView />}
          {activeTab === "communities" && <CommunitiesView />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
