import React from "react";

interface Props {
  title: string;
  count?: number;
  icon: React.ReactNode;
  color: "primary" | "success" | "warning";
}

const StatsCard: React.FC<Props> = ({ title, count, icon, color }) => {
  return (
    <div className={`card border-0 shadow-sm text-center text-${color}`}>
      <div className="card-body">
        <div className="display-6 mb-2">{icon}</div>
        <h3 className="fw-bold">{count ?? 0}</h3>
        <p className="text-secondary">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;
