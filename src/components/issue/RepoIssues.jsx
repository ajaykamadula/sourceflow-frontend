import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar.jsx";
import "./repoIssues.css";

const RepoIssues = () => {
  const { id } = useParams(); // repoId
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch(`http://localhost:3000/repo/${id}/issues`);
        const data = await res.json();
        setIssues(data);
      } catch (err) {
        console.error("Error fetching issues", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ padding: "20px" }}>Loading issues...</p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="issues-page">
        <div className="issues-container">
          {/* ===== HEADER (TITLE + CREATE BUTTON) ===== */}
          <div className="issues-header">
            <h1 className="issues-title">Issues</h1>

            <button
              className="new-issue-btn"
              onClick={() => navigate(`/repo/${id}/issues/new`)}
            >
              New Issue
            </button>
          </div>

          {/* ===== EMPTY STATE ===== */}
          {issues.length === 0 && <p className="no-issues">No issues found</p>}

          {/* ===== ISSUE LIST ===== */}
          {issues.map((issue) => (
            <div
              key={issue._id}
              className="issue-card"
              onClick={() => navigate(`/issue/${issue._id}`)}
            >
              <div className="issue-header-row">
                <h3 className="issue-title">{issue.title}</h3>

                <span className={`issue-status ${issue.status}`}>
                  {issue.status}
                </span>
              </div>

              {issue.description && (
                <p className="issue-description">{issue.description}</p>
              )}

              <div className="issue-meta">
                <span>
                  Opened by{" "}
                  <strong>@{issue.createdBy?.username || "unknown"}</strong>
                </span>
                <span>· {new Date(issue.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RepoIssues;
