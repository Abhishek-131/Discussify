import React, { useEffect, useState } from "react";
import API from "../../api/api";

interface Stats {
  totalUsers: number;
  totalCommunities: number;
  totalResources: number;
}

const DashboardView: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await API.get("/admin/stats");
      setStats(res.data);
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h3 className="fw-bold mb-4">Admin Dashboard</h3>
      <p className="text-muted mb-4">
        Overview of platform statistics and recent activities
      </p>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm text-center p-3">
            <h1 className="text-primary">{stats?.totalUsers ?? 0}</h1>
            <p className="fw-bold mb-0">Total Users</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm text-center p-3">
            <h1 className="text-success">{stats?.totalCommunities ?? 0}</h1>
            <p className="fw-bold mb-0">Active Communities</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm text-center p-3">
            <h1 className="text-warning">{stats?.totalResources ?? 0}</h1>
            <p className="fw-bold mb-0">Resources Shared</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
