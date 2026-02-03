import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./editIssue.css";

const EditIssue = () => {
  const { id } = useParams(); // issueId
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`http://localhost:3000/issue/${id}`)
      .then((res) => res.json())
      .then((issue) => {
        setTitle(issue.title);
        setDescription(issue.description);
      });
  }, [id]);

  

  const updateIssue = async (e) => {
    e.preventDefault();

    try {
      await fetch(`http://localhost:3000/issue/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      navigate(`/issue/${id}`);
    } catch {
      alert("Failed to update issue");
    }
  };

  return (
    <>
      <Navbar />

      <div className="edit-issue-page">
        <form className="edit-issue-card" onSubmit={updateIssue}>
          <h2 className="edit-issue-title">Edit Issue</h2>

          <div className="form-group">
            <label>Title</label>
            <input
              className="issue-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="issue-textarea"
              rows="6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="issue-actions">
            <button type="submit" className="btn-primary">
              Save Changes
            </button>

            <button
              type="button"
              className="btn-secondary"
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

export default EditIssue;
