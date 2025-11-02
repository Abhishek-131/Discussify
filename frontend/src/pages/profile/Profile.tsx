import React, { useEffect, useState } from "react";
import API from "../../api/api";

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    API.get("/profile/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  if (!user) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5" style={{ maxWidth: 600 }}>
      <div className="card p-4 shadow-sm">
        <div className="text-center mb-3">
          <img
            src={user.avatar ? `http://localhost:5010${user.avatar}` : "/default-avatar.png"}
            alt="Profile"
            width={100}
            height={100}
            className="rounded-circle border"
          />
        </div>
        <h5 className="text-center">{user.username || "Unnamed User"}</h5>
        <p className="text-center text-muted mb-1">{user.email}</p>
        <p className="text-center">{user.bio || "No bio yet."}</p>

        <div className="d-flex justify-content-center gap-2 mt-3">
          <a href="/edit-profile" className="btn btn-outline-primary">Edit Profile</a>
          <a href="/upload-avatar" className="btn btn-primary">Upload Picture</a>
        </div>
      </div>
    </div>
  );
};

export default Profile;
