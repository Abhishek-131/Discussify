import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Community {
  _id: string;
  name: string;
  description?: string;
  members: string[];
  createdAt: string;
}

const CommunitiesView: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selected, setSelected] = useState<Community | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [message, setMessage] = useState("");

  const fetchCommunities = async () => {
    try {
      const res = await API.get("/admin/communities");
      setCommunities(res.data.communities || []);
    } catch (err) {
      console.error("Error fetching communities:", err);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const openEditModal = (c: Community) => {
    setSelected(c);
    setForm({ name: c.name, description: c.description || "" });
    const modalEl = document.getElementById("editCommunityModal");
    if (modalEl && (window as any).bootstrap?.Modal) {
      const modal = new (window as any).bootstrap.Modal(modalEl);
      modal.show();
    }
  };

  const closeModal = () => {
    const modalEl = document.getElementById("editCommunityModal");
    if (modalEl && (window as any).bootstrap?.Modal) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
      modal?.hide();
    }
    setSelected(null);
  };

const handleEditSave = async () => {
  if (!selected) return;
  try {
    const res = await API.put(`/admin/communities/${selected._id}`, form);

    // ✅ Instantly update local state
    setCommunities((prev) =>
      prev.map((c) =>
        c._id === selected._id
          ? { ...c, name: form.name, description: form.description }
          : c
      )
    );

    setMessage("✅ Community updated successfully");
    closeModal();
    setTimeout(() => setMessage(""), 2000);
  } catch (err: any) {
    console.error("Community update failed:", err);
    setMessage(err.response?.data?.error || "Update failed");
  }
};


  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this community?")) return;
    try {
      const res = await API.delete(`/admin/communities/${id}`);
      setMessage(res.data.message || "Community deleted successfully");
      await fetchCommunities();
      setTimeout(() => setMessage(""), 1500);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Delete failed");
    }
  };

  return (
    <div>
      <h4 className="fw-bold mb-3">Communities</h4>
      {message && <div className="alert alert-info">{message}</div>}

      <table className="table table-hover shadow-sm">
        <thead className="table-light">
          <tr>
            <th>Community</th>
            <th>Total Members</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {communities.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.members.length}</td>
              <td>{new Date(c.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn btn-outline-primary btn-sm me-2"
                  onClick={() => openEditModal(c)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete(c._id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      <div className="modal fade" id="editCommunityModal" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Community</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <label className="form-label">Community Name</label>
              <input
                className="form-control mb-3"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleEditSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunitiesView;
