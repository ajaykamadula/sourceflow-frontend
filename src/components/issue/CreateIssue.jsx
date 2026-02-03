import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./createIssue.css";

const CreateIssue = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:3000/repo/${id}/issues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) throw new Error("Failed to create issue");

      navigate(`/repo/${id}/issues`);
    } catch (err) {
      console.error(err);
      alert("Error creating issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="create-issue-page">
        <form className="create-issue-card" onSubmit={handleSubmit}>
          <h2 className="create-issue-title">New Issue</h2>

          <div className="form-group">
            <label>
              Title <span className="required">*</span>
            </label>
            <input
              className="issue-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Bug: push command fails"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="issue-textarea"
              rows="6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Steps to reproduce..."
            />
          </div>

          <div className="issue-actions">
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Creating…" : "Create Issue"}
            </button>

            <button
              className="btn-secondary"
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateIssue;
