import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar.jsx";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // ================= STATE =================
  const [repositories, setRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [publicRepos, setPublicRepos] = useState([]);
  const [suggestedSearch, setSuggestedSearch] = useState("");

  const [starredRepoIds, setStarredRepoIds] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPublic, setLoadingPublic] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // ================= FETCH USER REPOS =================
  const fetchRepositories = async () => {
    try {
      setLoadingUser(true);
      const res = await fetch(`http://localhost:3000/repo/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRepositories(data.repositories || []);
      setSearchResults(data.repositories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUser(false);
    }
  };

  // ================= FETCH STARRED =================
  const fetchStarredRepos = async () => {
    const res = await fetch("http://localhost:3000/repo/starred", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    const ids = data.map((repo) => repo._id);
    setStarredRepoIds(ids);
    return ids;
  };

  // ================= FETCH ALL PUBLIC =================
  const fetchPublicRepos = async () => {
    try {
      setLoadingPublic(true);
      const [reposRes, starredIds] = await Promise.all([
        fetch("http://localhost:3000/repo/all"),
        fetchStarredRepos(),
      ]);

      const repos = await reposRes.json();
      setPublicRepos(
        repos.map((repo) => ({
          ...repo,
          isStarred: starredIds.includes(repo._id),
        })),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPublic(false);
    }
  };

  useEffect(() => {
    fetchRepositories();
    fetchPublicRepos();
  }, []);

  // ================= STAR / UNSTAR =================
  const toggleStar = async (repoId) => {
    await fetch(`http://localhost:3000/repo/${repoId}/star`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    setStarredRepoIds((prev) =>
      prev.includes(repoId)
        ? prev.filter((id) => id !== repoId)
        : [...prev, repoId],
    );

    setPublicRepos((prev) =>
      prev.map((repo) =>
        repo._id === repoId ? { ...repo, isStarred: !repo.isStarred } : repo,
      ),
    );
  };

  // ================= SEARCH YOUR REPOS =================
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults(repositories);
    } else {
      setSearchResults(
        repositories.filter((repo) =>
          repo.name.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    }
  }, [searchQuery, repositories]);

  // ================= GLOBAL SEARCH (PUBLIC) =================
  useEffect(() => {
    const controller = new AbortController();

    const searchPublic = async () => {
      if (!suggestedSearch.trim()) {
        fetchPublicRepos();
        return;
      }

      try {
        setLoadingPublic(true);
        const res = await fetch(
          `http://localhost:3000/repo/search?q=${suggestedSearch}`,
          { signal: controller.signal },
        );

        const data = await res.json();

        setPublicRepos(
          data.map((repo) => ({
            ...repo,
            isStarred: starredRepoIds.includes(repo._id),
          })),
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Global search failed:", err);
        }
      } finally {
        setLoadingPublic(false);
      }
    };

    searchPublic();
    return () => controller.abort();
  }, [suggestedSearch]);

  // ================= UI =================
  const LoadingSkeleton = () =>
    [1, 2, 3].map((i) => (
      <div key={i} className="loading-skeleton" style={{ height: "80px" }} />
    ));

  const EmptyState = ({ text }) => (
    <div className="empty-state">
      <p>{text}</p>
    </div>
  );

  const renderRepoItem = (repo) => (
    <div key={repo._id} className="repo-item">
      <div className="repo-info">
        <Link to={`/repo/${repo._id}`} className="repo-link">
          <h3>{repo.name}</h3>
        </Link>
        <p>{repo.description || "No description provided"}</p>
      </div>
      <button
        className="star-btn"
        onClick={() => toggleStar(repo._id)}
        title={repo.isStarred ? "Unstar" : "Star"}
      >
        {repo.isStarred ? "⭐" : "☆"}
      </button>
    </div>
  );

  const reposToShow = suggestedSearch ? publicRepos : publicRepos.slice(0, 10);

  return (
    <>
      <Navbar />

      <section id="dashboard">
        {/* ================= SUGGESTED ================= */}
        <aside className="dashboard-card">
          <h2>Suggested Repositories</h2>
          <div className="section-divider" />

          <input
            className="search-input"
            placeholder="Search public repositories..."
            value={suggestedSearch}
            onChange={(e) => setSuggestedSearch(e.target.value)}
          />

          {loadingPublic ? (
            <LoadingSkeleton />
          ) : reposToShow.length ? (
            <div className="repos-container">
              {reposToShow.map(renderRepoItem)}
            </div>
          ) : (
            <EmptyState text="No public repositories found" />
          )}
        </aside>

        {/* ================= YOUR REPOS ================= */}
        <main className="dashboard-card main-card">
          <h2>Your Repositories</h2>
          <div className="section-divider" />

          <input
            className="search-input"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {loadingUser ? (
            <LoadingSkeleton />
          ) : searchResults.length ? (
            <div className="repos-container">
              {searchResults.map(renderRepoItem)}
            </div>
          ) : (
            <EmptyState text="No repositories found" />
          )}
        </main>

        {/* ================= EVENTS ================= */}
        <aside className="dashboard-card">
          <h2>Upcoming Events</h2>
          <div className="section-divider" />
          <ul className="events-list">
            <li>Tech Conference 2026</li>
            <li>Hackathon Spring</li>
            <li>Open Source Summit</li>
            <li>Developer Meetup</li>
            <li>Code Review Workshop</li>
          </ul>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;
