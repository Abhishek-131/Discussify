import React, { useEffect, useState } from "react";
import API from "../api/api";
import {
  FaUsers,
  FaComments,
  FaFileAlt,
  FaPaperclip,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  type: string;
  message: string;
  createdAt: string;
}

const ActivityLog: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  const fetchActivity = async () => {
    setLoading(true);
    try {
      const res = await API.get("/users/me/activity");
      setActivities(res.data.activities);
    } catch (err) {
      console.error("Error loading activity:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  const filtered = activities.filter((a) =>
    filter === "all" ? true : a.type === filter
  );

  const getIcon = (type: string) => {
    switch (type) {
      case "discussion":
        return <FaComments className="text-primary me-3 fs-4" />;
      case "join":
        return <FaUsers className="text-success me-3 fs-4" />;
      case "resource":
        return <FaFileAlt className="text-warning me-3 fs-4" />;
      case "comment":
        return <FaPaperclip className="text-secondary me-3 fs-4" />;
      default:
        return <FaFileAlt className="text-muted me-3 fs-4" />;
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="fw-bold mb-3">Activity Log</h3>

      {/* Filter Buttons */}
      <div className="mb-3 d-flex flex-wrap gap-2">
        {["all", "discussion", "join", "resource", "comment"].map((t) => (
          <button
            key={t}
            className={`btn ${
              filter === t ? "btn-primary" : "btn-outline-primary"
            } btn-sm`}
            onClick={() => setFilter(t)}
          >
            {t === "all"
              ? "All"
              : t.charAt(0).toUpperCase() + t.slice(1) + "s"}
          </button>
        ))}
      </div>

      {/* Loading Spinner */}
      {loading && <p>Loading...</p>}

      {/* Activity Cards */}
      {!loading && filtered.length === 0 && (
        <p className="text-muted">No activity found.</p>
      )}

      <div className="list-group">
        {filtered.map((a, i) => (
          <div
            key={i}
            className="list-group-item d-flex align-items-start border-0 border-bottom py-3"
          >
            {getIcon(a.type)}
            <div>
              <div className="fw-semibold">{a.message}</div>
              <div className="text-muted small">
                {formatDistanceToNow(new Date(a.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;
