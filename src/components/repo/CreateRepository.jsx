import React, { useState } from "react";
import "./create-repo.css";
import Navbar from "../Navbar.jsx";
import { useNavigate } from "react-router-dom";

const CreateRepository = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [loading, setLoading] = useState(false);

  // ✅ CORRECT STATES
  const [createdRepoId, setCreatedRepoId] = useState(null);
  const [createdRepoName, setCreatedRepoName] = useState("");
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();

  // ✅ COPY HANDLER
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Repository name is required");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token) {
        alert("You are not logged in");
        return;
      }

      const response = await fetch("http://localhost:3000/repo/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          visibility,
          owner: userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create repository");
      }

      const data = await response.json();
      console.log("FULL RESPONSE:", data);

      // ✅ STORE WHAT BACKEND ACTUALLY RETURNS
      setCreatedRepoId(data.repositoryID);
      setCreatedRepoName(name);
    } catch (err) {
      console.error(err);
      alert("Error creating repository");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="create-repo-container">
        <div className="create-repo-card">
          {!createdRepoId ? (
            /* ================= CREATE FORM ================= */
            <form onSubmit={handleSubmit}>
              <h2>Create a New Repository</h2>

              <label>Repository Name *</label>
              <input
                type="text"
                placeholder="my-awesome-repo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label>Description</label>
              <textarea
                placeholder="Short description about your repository"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="visibility">
                <label>
                  <input
                    type="radio"
                    checked={visibility === true}
                    onChange={() => setVisibility(true)}
                  />
                  Public
                </label>

                <label>
                  <input
                    type="radio"
                    checked={visibility === false}
                    onChange={() => setVisibility(false)}
                  />
                  Private
                </label>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Repository"}
              </button>
            </form>
          ) : (
            /* ================= SUCCESS VIEW ================= */
            <div className="repo-success">
              <h2>🎉 Repository Created</h2>
              <p className="success-subtitle">
                Your repository is ready. Use the Repo ID below to initialize it
                locally.
              </p>

              {/* Repo name */}
              <div className="success-row">
                <span className="label">Repository</span>
                <span className="value">{createdRepoName}</span>
              </div>

              {/* Repo ID */}
              <div className="success-row">
                <span className="label">Repository ID</span>

                <div className="copy-row">
                  <input value={createdRepoId} readOnly />
                  <button onClick={() => handleCopy(createdRepoId)}>
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                <small className="hint">
                  Paste this Repo ID to initialize the repository locally
                </small>
              </div>

              {/* CLI command */}
              <div className="cli-box">
                <span className="label">Initialize locally</span>
                <pre
                  onClick={() =>
                    handleCopy(`node index.js init ${createdRepoId}`)
                  }
                >
                  node index.js init {createdRepoId}
                </pre>
                <small className="hint">Click to copy command</small>
              </div>

              {/* Actions */}
              <div className="action-buttons">
                <button
                  className="primary"
                  onClick={() => navigate(`/repo/${createdRepoId}`)}
                >
                  View Repository
                </button>
                <button className="secondary" onClick={() => navigate("/")}>
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateRepository;
