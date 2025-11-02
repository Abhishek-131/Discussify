import React, { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/Feed.css";
import { FaPlus, FaExternalLinkAlt } from "react-icons/fa";

interface Resource {
  _id: string;
  title?: string;
  description?: string;
  fileUrl?: string;
  fileType?: string;
  externalLink?: string;
  user: { username?: string; email?: string };
  createdAt?: string;
  community?: string | null;
}

const Home: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const fetchResources = async () => {
    try {
      const res = await API.get("/resources");
      setResources(res.data.resources || []);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Failed to load feed");
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validate mandatory fields
    if (!title.trim() || !description.trim()) {
      setMessage("⚠️ Title and Description are required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("externalLink", externalLink);
      if (file) formData.append("file", file);

      const res = await API.post("/resources", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResources((prev) => [res.data.resource, ...prev]);
      setTitle("");
      setDescription("");
      setExternalLink("");
      setFile(null);
      setShowModal(false);
      setMessage("✅ Resource shared successfully!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Failed to share resource");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">🌍 Global Resource Feed</h3>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={() => setShowModal(true)}
        >
          <FaPlus className="me-2" /> Share Resource
        </button>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      {/* Share Modal */}
      {showModal && (
        <>
          <div className="modal d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <form onSubmit={handleShare}>
                  <div className="modal-header">
                    <h5 className="modal-title">Share Resource</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowModal(false)}
                    />
                  </div>
                  <div className="modal-body">
                    <input
                      className="form-control mb-2"
                      placeholder="Title *"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                    <textarea
                      className="form-control mb-2"
                      placeholder="Description *"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                    <input
                      className="form-control mb-2"
                      placeholder="External link (optional)"
                      value={externalLink}
                      onChange={(e) => setExternalLink(e.target.value)}
                    />
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="form-control mb-2"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <small className="text-muted">
                      * Title and Description are mandatory.
                    </small>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Share Resource
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop show"
            onClick={() => setShowModal(false)}
          ></div>
        </>
      )}

      {/* Feed Grid */}
      <div className="row">
        {resources.map((r) => (
          <div className="col-md-6 mb-4" key={r._id}>
            <div className="card feed-card h-100">
              <div className="card-body">
                  <p className="small text-secondary mb-2">
                  Shared by{" "}
                  <b>{r.user?.username || r.user?.email}</b> •{" "}
                  {new Date(r.createdAt || "").toLocaleString()}
                </p>
                <h5 className="feed-title">{r.title}</h5>
                <p className="feed-desc text-muted">{r.description}</p>
              
              </div>

              {/* ✅ Media Section */}
              {r.fileType === "image" && r.fileUrl && (
                <img
                  src={`${import.meta.env.VITE_API_URL || "http://localhost:5010"}${r.fileUrl}`}
                  alt="resource"
                  className="feed-media"
                />
              )}
              {r.fileType === "video" && r.fileUrl && (
                <video controls className="feed-media">
                  <source
                    src={`${import.meta.env.VITE_API_URL || "http://localhost:5010"}${r.fileUrl}`}
                    type="video/mp4"
                  />
                </video>
              )}

              {/* ✅ Always show link if it exists, even with image/video */}
              {r.externalLink && (
                <div className="p-3 border-top bg-light link-box">
                  <a
                    href={r.externalLink}
                    target="_blank"
                    rel="noreferrer"
                    className="link-text"
                  >
                    <FaExternalLinkAlt className="me-1" />
                    {r.externalLink}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
        {resources.length === 0 && (
          <p className="text-center text-muted">
            No resources yet — share the first one!
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
