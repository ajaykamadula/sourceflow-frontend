import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./issueDetails.css";

const IssueDetails = () => {
  const { id } = useParams(); // issueId
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await fetch(`http://localhost:3000/issue/${id}`);
        const data = await res.json();
        setIssue(data);
      } catch (err) {
        console.error("Error fetching issue", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  const deleteIssue = async () => {
    if (!window.confirm("Delete this issue? This action is irreversible."))
      return;

    try {
      await fetch(`http://localhost:3000/issue/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate(-1);
    } catch (err) {
      alert("Failed to delete issue");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ padding: "20px" }}>Loading issue...</p>
      </>
    );
  }

  if (!issue) {
    return (
      <>
        <Navbar />
        <p style={{ padding: "20px" }}>Issue not found</p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="issue-details-page">
        <div className="issue-details-card">
          {/* Header */}
          <div className="issue-header">
            <h1 className="issue-title">{issue.title}</h1>

            <span className={`issue-badge ${issue.status}`}>
              {issue.status.toUpperCase()}
            </span>
          </div>

          {/* Meta */}
          <div className="issue-meta">
            Opened by <strong>@{issue.createdBy?.username}</strong> ·{" "}
            {new Date(issue.createdAt).toLocaleDateString()}
          </div>

          {/* Description */}
          <div className="issue-description-box">
            {issue.description || "No description provided."}
          </div>

          {/* Actions */}
          <div className="issue-actions">
            <button
              className="btn-secondary"
              onClick={() => navigate(`/issue/${issue._id}/edit`)}
            >
              Edit
            </button>

            <button className="btn-danger" onClick={deleteIssue}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default IssueDetails;
