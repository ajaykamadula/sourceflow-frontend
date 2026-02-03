import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Navbar from "../Navbar.jsx";
import "./repo-contents.css";

const RepoContents = () => {
  const { id } = useParams();

  const [files, setFiles] = useState([]);
  const [commit, setCommit] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:3000/repo/${id}/files`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        setFiles(data.files || []);
        setCommit(data.commit || null);
      } catch (err) {
        console.error("Error fetching repo files:", err);
      }
    };

    fetchFiles();
  }, [id]);

  const openFile = async (file) => {
    if (!commit) return;

    setSelectedFile(file);
    setLoading(true);
    setFileContent("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3000/repo/${id}/file?commit=${commit}&path=${encodeURIComponent(
          file,
        )}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const text = await res.text();
      setFileContent(text);
    } catch {
      setFileContent("Failed to load file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <div className="repo-tabs">
        <NavLink
          to={`/repo/${id}`}
          end
          className={({ isActive }) =>
            isActive ? "repo-tab active" : "repo-tab"
          }
        >
          Code
        </NavLink>

        <NavLink
          to={`/repo/${id}/issues`}
          className={({ isActive }) =>
            isActive ? "repo-tab active" : "repo-tab"
          }
        >
          Issues
        </NavLink>
      </div>

      <div className="repo-container">
        {/* FILE LIST */}
        <aside className="file-sidebar">
          <h3 className="sidebar-title">Files</h3>

          {files.length === 0 && (
            <div className="empty-state">No files in repository</div>
          )}

          {files.map((file) => (
            <div
              key={file}
              className={`file-item ${selectedFile === file ? "active" : ""}`}
              onClick={() => openFile(file)}
            >
              {file}
            </div>
          ))}
        </aside>

        {/* FILE VIEWER */}
        <main className="file-viewer">
          <div className="file-header">
            {selectedFile || "Select a file to view"}
          </div>

          {loading ? (
            <div className="loading">Loading file...</div>
          ) : (
            <pre className="file-content">{fileContent}</pre>
          )}
        </main>
      </div>
    </>
  );
};

export default RepoContents;
