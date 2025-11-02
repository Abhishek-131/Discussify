import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

interface Comment {
  _id?: string;
  content: string;
  author: { email?: string; username?: string };
  createdAt?: string;
}

interface Discussion {
  _id: string;
  title: string;
  content: string;
  author: { email?: string; username?: string };
  comments: Comment[];
  createdAt?: string;
}

const CommunityDiscussions: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [commentText, setCommentText] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchDiscussions = async () => {
    if (!id) return;
    try {
      const res = await API.get(`/discussions/${id}`);
      setDiscussions(res.data.discussions || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [id]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setMessage("Both title and content are required");
      return;
    }

    try {
      const res = await API.post(`/discussions/${id}`, { title, content });
      setDiscussions((prev) => [res.data.discussion, ...prev]);
      setTitle("");
      setContent("");
      setMessage("Discussion created successfully!");
      setTimeout(() => setMessage(""), 1500);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Failed to create discussion");
    }
  };

  const handleAddComment = async (discussionId: string) => {
    if (!commentText.trim()) return;
    setLoading(true);
    try {
      const res = await API.post(`/discussions/comment/${discussionId}`, {
        content: commentText,
      });

      // update only that discussion
      setDiscussions((prev) =>
        prev.map((d) =>
          d._id === discussionId ? res.data.discussion : d
        )
      );

      setCommentText("");
      setSelectedId(null);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setMessage(err.response?.data?.error || "Failed to add comment");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Community Discussions</h3>
      {message && <div className="alert alert-info">{message}</div>}

      {/* Discussion form */}
      <div className="card mb-4 p-3">
        <h5>Start a Discussion</h5>
        <form onSubmit={handleCreate}>
          <input
            className="form-control mb-2"
            placeholder="Discussion Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="form-control mb-2"
            placeholder="Write your post..."
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Post
          </button>
        </form>
      </div>

      {/* Discussion list */}
      {discussions.length === 0 && <p>No discussions yet. Be the first!</p>}

      {discussions.map((d) => (
        <div key={d._id} className="card mb-3">
          <div className="card-body">
            <h5>{d.title}</h5>
            <p className="text-muted small">
              By {d.author?.username || d.author?.email}
            </p>
            <p>{d.content}</p>

            <h6 className="mt-3">Comments</h6>
            {d.comments.map((c, idx) => (
              <div key={idx} className="border p-2 mb-2 rounded bg-light">
                <small className="text-muted d-block">
                  {c.author?.username || c.author?.email}
                </small>
                <div>{c.content}</div>
              </div>
            ))}

            <div className="input-group mt-2">
              <input
                className="form-control"
                placeholder="Write a comment..."
                value={selectedId === d._id ? commentText : ""}
                onChange={(e) => {
                  setSelectedId(d._id);
                  setCommentText(e.target.value);
                }}
              />
              <button
                className="btn btn-success"
                onClick={() => handleAddComment(d._id)}
                disabled={loading}
              >
                {loading ? "Posting..." : "Reply"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunityDiscussions;
