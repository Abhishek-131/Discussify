import React, { useEffect, useState } from "react";
import API from "../api/api";

interface Notification {
  _id: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await API.get("/notifications");
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mark single notification as read
  const markAsRead = async (id: string, link: string) => {
    try {
      await API.put(`/notifications/${id}/read`);
      window.location.href = link; // Navigate to the link
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  // ✅ Clear all notifications
  const clearAll = async () => {
    try {
      await API.delete("/notifications/clear");
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  // ✅ Auto-refresh every 10 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dropdown">
      <button
        className="btn btn-outline-secondary position-relative"
        type="button"
        id="notifDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        🔔
        {notifications.some((n) => !n.isRead) && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {notifications.filter((n) => !n.isRead).length}
          </span>
        )}
      </button>

      <ul className="dropdown-menu dropdown-menu-end p-2" aria-labelledby="notifDropdown" style={{ width: "320px" }}>
        <li className="d-flex justify-content-between align-items-center mb-2">
          <strong>Notifications</strong>
          {notifications.length > 0 && (
            <button className="btn btn-sm btn-link text-danger" onClick={clearAll}>
              Clear All
            </button>
          )}
        </li>

        {loading && <li className="text-center text-muted">Loading...</li>}

        {!loading && notifications.length === 0 && (
          <li className="text-center text-muted">No notifications</li>
        )}

        {notifications.map((n) => (
          <li
            key={n._id}
            className={`p-2 rounded mb-1 ${n.isRead ? "bg-light" : "bg-white border-start border-4 border-primary"}`}
            style={{ cursor: "pointer" }}
            onClick={() => markAsRead(n._id, n.link)}
          >
            <div className="fw-semibold small">{n.message}</div>
            <div className="text-muted small">
              {new Date(n.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notification;
