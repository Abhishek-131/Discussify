import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { FaEdit, FaTrash } from "react-icons/fa";

interface User {
  _id: string;
  username: string;
  email: string;
  bio?: string;
  createdAt: string;
}

const UsersView: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<User | null>(null);
  const [form, setForm] = useState({ username: "", bio: "" });
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    const res = await API.get("/admin/users");
    setUsers(res.data.users || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEditModal = (user: User) => {
    setSelected(user);
    setForm({
      username: user.username || "",
      bio: user.bio || "user",
    });

    const modalEl = document.getElementById("editUserModal");
    if (modalEl && (window as any).bootstrap?.Modal) {
      const modal = new (window as any).bootstrap.Modal(modalEl);
      modal.show();
    }
  };

  const closeModal = () => {
    const modalEl = document.getElementById("editUserModal");
    if (modalEl && (window as any).bootstrap?.Modal) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
      modal?.hide();
    }
    setSelected(null);
  };

  const handleEditSave = async () => {
    if (!selected) return;
    try {
      const res = await API.put(`/admin/users/${selected._id}`, {
        username: form.username,
        bio: form.bio,
      });

      // ✅ Update state instantly
      setUsers((prev) =>
        prev.map((u) =>
          u._id === selected._id
            ? { ...u, username: form.username, bio: form.bio }
            : u
        )
      );

      setMessage("✅ User updated successfully");
      closeModal();

      // Auto-clear message
      setTimeout(() => setMessage(""), 2000);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const res = await API.delete(`/admin/users/${id}`);
    setMessage(res.data.message || "User deleted successfully");
    await fetchUsers();
    setTimeout(() => setMessage(""), 1500);
  };

  return (
    <div>
      <h4 className="fw-bold mb-3">Users</h4>
      {message && <div className="alert alert-info py-2">{message}</div>}

      <table className="table table-hover shadow-sm">
        <thead className="table-light">
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>bio</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.username || "N/A"}</td>
              <td>{u.email}</td>
              <td>
                <span
                  className={`badge bg-${
                    u.bio === "admin" ? "danger" : "success"
                  }`}
                >
                  {u.bio?.toUpperCase() || "USER"}
                </span>
              </td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn btn-outline-primary btn-sm me-2"
                  onClick={() => openEditModal(u)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete(u._id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      <div className="modal fade" id="editUserModal" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit User</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <label className="form-label">Email (read-only)</label>
              <input
                className="form-control mb-3"
                value={selected?.email || ""}
                disabled
              />

              <label className="form-label">Username</label>
              <input
                className="form-control mb-3"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
              />

              <label className="form-label">bio</label>
              <select
                className="form-select"
                value={form.bio}
                onChange={(e) =>
                  setForm({ ...form, bio: e.target.value })
                }
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleEditSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersView;
