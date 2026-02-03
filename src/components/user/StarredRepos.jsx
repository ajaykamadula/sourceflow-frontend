import React, { useEffect, useState } from "react";
import RepoCard from "../repo/RepoCard";

const StarredRepos = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStarredRepos = async () => {
      try {
        const res = await fetch("http://localhost:3000/repo/starred", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setRepos(
          data.map((repo) => ({
            ...repo,
            isStarred: true,
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStarredRepos();
  }, []);

  const handleUnstar = async (repoId) => {
    try {
      await fetch(`http://localhost:3000/repo/${repoId}/star`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // remove immediately from UI
      setRepos((prev) => prev.filter((repo) => repo._id !== repoId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <p style={{ padding: "24px" }}>Loading starred repositories…</p>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <h2>Starred Repositories</h2>

      {repos.length === 0 ? (
        <p>No starred repositories yet</p>
      ) : (
        repos.map((repo) => (
          <RepoCard
            key={repo._id}
            repo={repo}
            onStarToggle={handleUnstar}
          />
        ))
      )}
    </div>
  );
};

export default StarredRepos;
