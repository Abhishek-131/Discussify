import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

interface Community {
  _id: string;
  name: string;
  description: string;
  creator: { email: string };
  members: string[];
}

const Explore: React.FC = () => {
  const [list, setList] = useState<Community[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchPublic = async (q = "") => {
    try {
      const res = await API.get(`/communities/public?search=${encodeURIComponent(q)}`);
      setList(res.data.communities || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPublic();
  }, []);

  const handleJoin = async (id: string) => {
    try {
      const res = await API.post(`/communities/${id}/join`);
      setMessage(res.data.message || "Joined");
      // optimistic UI: remove from list or navigate to discussions
      // navigate to discussions page
      setTimeout(() => {
        setMessage("");
        navigate(`/community/${id}/discussions`);
      }, 700);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Failed to join");
    }
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPublic(search);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Explore Communities</h3>
        <form className="form-inline" onSubmit={onSearch}>
          <input className="form-control mr-2" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn btn-outline-primary" type="submit">Search</button>
        </form>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="row">
        {list.map((c) => (
          <div className="col-md-4 mb-3" key={c._id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{c.name}</h5>
                <p className="card-text text-muted">{c.description}</p>
                <p className="small">Members: {c.members?.length || 0}</p>
                <div className="mt-auto d-flex">
                  <button className="btn btn-primary mr-2" onClick={() => navigate(`/community/${c._id}/discussions`)}>View</button>
                  <button className="btn btn-success" onClick={() => handleJoin(c._id)}>Join</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && <div className="col-12"><p>No communities found.</p></div>}
      </div>
    </div>
  );
};

export default Explore;
