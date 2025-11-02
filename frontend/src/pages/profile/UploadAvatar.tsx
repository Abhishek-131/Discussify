import React, { useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

const UploadAvatar: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setMsg("Please select an image");

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await API.post("/profile/picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMsg(res.data.message);
      setTimeout(() => navigate("/profile"), 1200);
    } catch (err: any) {
      setMsg(err.response?.data?.error || "Upload failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h4>Upload Profile Picture</h4>
      {msg && <div className="alert alert-info mt-2">{msg}</div>}
      <form onSubmit={handleUpload}>
        <div className="mb-3">
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>
        <button className="btn btn-primary w-100">Upload</button>
      </form>
    </div>
  );
};

export default UploadAvatar;
