import React, { useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

const EditProfile: React.FC = () => {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.put("/profile", { username, bio });
      setMsg(res.data.message);
      setTimeout(() => navigate("/profile"), 1200);
    } catch (err: any) {
      setMsg(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h4>Edit Profile</h4>
      {msg && <div className="alert alert-info mt-2">{msg}</div>}
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label>Username</label>
          <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Bio</label>
          <textarea className="form-control" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <button className="btn btn-primary w-100">Update</button>
      </form>
    </div>
  );
};

export default EditProfile;
