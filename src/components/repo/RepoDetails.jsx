import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import RepoContents from "./RepoContents";
import "./repo-details.css";

const RepoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        if (!token) throw new Error("Unauthorized");

        const res = await fetch(`http://localhost:3000/repo/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Repo not found");

        const data = await res.json();
        setRepo(data);
      } catch (err) {
        console.error(err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchRepo();
  }, [id, token, navigate]);

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ padding: "20px" }}>Loading repository…</p>
      </>
    );
  }

  if (!repo) {
    return (
      <>
        <Navbar />
        <p style={{ padding: "20px" }}>Repository not found</p>
      </>
    );
  }

  const isOwner =
    repo?.owner &&
    (repo.owner._id === currentUserId || repo.owner === currentUserId);

  const handleDelete = async () => {
    if (!window.confirm("Delete this repository permanently?")) return;

    const res = await fetch(`http://localhost:3000/repo/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) navigate("/");
    else alert("Failed to delete repository");
  };

  const handlePull = () => {
    navigator.clipboard.writeText(repo._id);

    alert(
      `Repo ID copied!\n\nRun this in your local repo:\n\nnode index.js init ${repo._id} \n\n node index.js pull`,
    );
  };

  return (
    <>
      <Navbar />

      <section className="repo-details">
        <div className="repo-header">
          <h2 className="repo-title">{repo.name}</h2>
          <p className="repo-description">
            {repo.description || "No description"}
          </p>

          {isOwner && (
            <div className="repo-actions">
              <button
                className="edit-btn"
                onClick={() => navigate(`/repo/${id}/edit`)}
              >
                Edit
              </button>

              <button className="delete-btn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          )}
          {repo.visibility === true && (
            <div style={{ marginTop: "12px" }}>
              <button className="pull-btn" onClick={handlePull}>
                Pull Repository
              </button>
            </div>
          )}
        </div>

        <hr />

        <RepoContents />

        <hr />

        <button onClick={() => navigate(`/repo/${id}/issues`)}>
          View Issues →
        </button>
      </section>
    </>
  );
};

export default RepoDetails;
