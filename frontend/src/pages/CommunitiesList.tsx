import React, { useEffect, useState } from "react";
import API from "../api/api";
// import { useNavigate } from "react-router-dom";

interface Community {
  _id: string;
  name: string;
  description: string;
  creator: { email: string };
  members: string[];
}

const CommunitiesList: React.FC = () => {
//   const navigate = useNavigate();

  const [communities, setCommunities] = useState<Community[]>([]);
  const [selected, setSelected] = useState<Community | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [inviteEmail, setInviteEmail] = useState("");
  const [message, setMessage] = useState("");

  const fetchCommunities = async () => {
    try {
      const res = await API.get("/communities/my");
      setCommunities(res.data.communities);
    } catch (err: any) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleCreate = async () => {
    if (!form.name.trim()) {
      setMessage("Community name is required");
      return;
    }

    try {
      const res = await API.post("/communities", form);
      setMessage(res.data.message || "Community created successfully");
      setForm({ name: "", description: "" });

      // ✅ Always re-fetch to show the new card
      await fetchCommunities();

      // ✅ Hide the modal immediately and safely
      const modalEl = document.getElementById("createModal");
      if (modalEl && (window as any).bootstrap?.Modal) {
        // Force-create modal instance
        const modalInstance = new (window as any).bootstrap.Modal(modalEl);
        modalInstance.hide();
      } else {
        // Fallback: manually trigger click on backdrop (rare case)
        document.querySelector(".modal-backdrop")?.remove();
        modalEl?.classList.remove("show");
        modalEl?.setAttribute("aria-hidden", "true");
      }

      // ✅ Small delay, then clear message
      setTimeout(() => setMessage(""), 2000);
    } catch (err: any) {
      console.error("Create error:", err);
      const errMsg = err.response?.data?.error || "Failed to create community";
      setMessage(errMsg);
    }
  };

  const handleEdit = async () => {
    if (!selected) return;

    if (!form.name.trim()) {
      setMessage("Community name is required");
      return;
    }

    try {
      // 1️⃣ Update on server
      const res = await API.put(`/communities/${selected._id}`, {
        name: form.name,
        description: form.description,
      });

      const updated = res.data.community || { ...selected, ...form };

      // 2️⃣ Update locally — instant UI feedback
      setCommunities((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      );

      // 3️⃣ Hide the modal immediately
      const modalEl = document.getElementById("editModal");
      if (modalEl && (window as any).bootstrap?.Modal) {
        const modalInstance =
          (window as any).bootstrap.Modal.getInstance(modalEl) ||
          new (window as any).bootstrap.Modal(modalEl);
        modalInstance.hide();
      } else {
        document.querySelector(".modal-backdrop")?.remove();
        modalEl?.classList.remove("show");
        modalEl?.setAttribute("aria-hidden", "true");
      }

      // 4️⃣ Small delay and re-fetch to ensure backend sync
      setTimeout(() => {
        fetchCommunities(); // optional refresh for accuracy
      }, 500);

      // 5️⃣ Message feedback
      setMessage(res.data.message || "Community updated successfully");
      setTimeout(() => setMessage(""), 500);
    } catch (err: any) {
      console.error("Edit error:", err);
      const errMsg = err.response?.data?.error || "Update failed";
      setMessage(errMsg);
    }
  };

  const handleInvite = async () => {
    if (!selected) return;
    try {
      const res = await API.post(`/communities/${selected._id}/invite`, {
        email: inviteEmail,
      });
      setMessage(res.data.message);
      setInviteEmail("");
      await fetchCommunities();
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Invite failed");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Your Communities</h3>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#createModal"
        >
          + Create Community
        </button>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="row">
        {communities.map((c) => (
          <div key={c._id} className="col-md-4 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">{c.name}</h5>
                <p className="card-text text-muted">{c.description}</p>
                <p className="small mb-2">
                  Creator: <b>{c.creator?.email}</b>
                </p>
                <button
                  className="btn btn-outline-primary btn-sm me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#viewModal"
                  onClick={() => setSelected(c)}
                >
                  View
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  onClick={() => {
                    setSelected(c);
                    setForm({ name: c.name, description: c.description });
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      <div className="modal fade" id="createModal" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create Community</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <input
                className="form-control mb-2"
                placeholder="Community Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <textarea
                className="form-control"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreate}>
                Create
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      <div className="modal fade" id="editModal" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Community</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <input
                className="form-control mb-2"
                placeholder="Community Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <textarea
                className="form-control"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW / INVITE MODAL */}
      <div className="modal fade" id="viewModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{selected?.name}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <p>{selected?.description}</p>
              <hr />
              <h6>Invite Member</h6>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter user email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <button className="btn btn-success" onClick={handleInvite}>
                  Invite
                </button>
              </div>
              <h6>Members:</h6>
              <ul className="list-group">
                {selected?.members.map((m) => (
                  <li key={m} className="list-group-item">
                    {m}
                  </li>
                ))}
              </ul>
               <hr />
<h6>Resources</h6>
<button
  className="btn btn-outline-success w-100"
  onClick={() => {
    // close modal UI
    document.getElementById("viewModal")?.classList.remove("show");
    document.querySelector(".modal-backdrop")?.remove();
    // navigate
    window.location.href = `/communities/${selected?._id}/resources`;
  }}
>
  View Resources
</button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunitiesList;
