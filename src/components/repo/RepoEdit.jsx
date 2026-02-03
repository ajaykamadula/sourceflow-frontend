import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./repo-edit.css";

const RepoEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`http://localhost:3000/repo/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setName(data.name || "");
        setDescription(data.description || "");
      });
  }, [id, token]);

  const handleSave = async () => {
    const res = await fetch(`http://localhost:3000/repo/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description }),
    });

    if (res.ok) {
      navigate(`/repo/${id}`);
    } else {
      alert("Update failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this repository permanently?")) return;

    const res = await fetch(`http://localhost:3000/repo/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      navigate("/");
    } else {
      alert("Delete failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="repo-edit-wrapper">
        <div className="repo-edit-card">
          <h2>Edit Repository</h2>

          <div className="repo-edit-field">
            <label>Repository Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Repository name"
            />
          </div>

          <div className="repo-edit-field">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your repository"
            />
          </div>

          <div className="repo-edit-actions">
            <button className="save-btn" onClick={handleSave}>
              Save changes
            </button>

            <button className="cancel-btn" onClick={() => navigate(-1)}>
              Cancel
            </button>

            <button className="delete-btn" onClick={handleDelete}>
              Delete repository
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RepoEdit;
