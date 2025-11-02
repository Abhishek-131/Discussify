import React from "react";
import { FaUsers, FaComments, FaChartBar } from "react-icons/fa";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header text-center py-3">
        <h5 className="text-primary fw-bold mb-0">Discussify</h5>
        <small className="text-muted">Admin Panel</small>
      </div>

      <div className="sidebar-menu mt-4">
        <button
          className={`sidebar-item ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <FaChartBar className="me-2" /> Dashboard
        </button>
        <button
          className={`sidebar-item ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <FaUsers className="me-2" /> Users
        </button>
        <button
          className={`sidebar-item ${activeTab === "communities" ? "active" : ""}`}
          onClick={() => setActiveTab("communities")}
        >
          <FaComments className="me-2" /> Communities
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
