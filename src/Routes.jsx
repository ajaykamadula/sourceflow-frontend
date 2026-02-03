import React, { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";

// Pages
import Dashboard from "./components/dashboard/Dashboard.jsx";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import Profile from "./components/user/Profile.jsx";
import CreateRepository from "./components/repo/CreateRepository.jsx";
import RepoDetails from "./components/repo/RepoDetails.jsx";
import RepoContents from "./components/repo/RepoContents.jsx";
import RepoIssues from "./components/issue/RepoIssues.jsx";
import RepoEdit from "./components/repo/RepoEdit.jsx";
import CreateIssue from "./components/issue/CreateIssue.jsx";
import IssueDetails from "./components/issue/IssueDetails.jsx";
import EditIssue from "./components/issue/EditIssue.jsx";
import StarredRepos from "./components/user/StarredRepos.jsx";

// Auth
import { useAuth } from "./authContext.jsx";

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    // Restore session on refresh
    if (userId && !currentUser) {
      setCurrentUser(userId);
      return;
    }

    // Not logged in → force auth (except auth routes)
    if (
      !userId &&
      !["/auth", "/signup"].includes(window.location.pathname)
    ) {
      navigate("/auth", { replace: true });
    }

    // Logged in but on auth page → redirect home
    if (userId && window.location.pathname === "/auth") {
      navigate("/", { replace: true });
    }
  }, [currentUser, navigate, setCurrentUser]);

  return useRoutes([
    // Public / auth
    { path: "/auth", element: <Login /> },
    { path: "/signup", element: <Signup /> },

    // Dashboard
    { path: "/", element: <Dashboard /> },

    // Profile
    { path: "/profile", element: <Profile /> },
    { path: "/profile/starred", element: <StarredRepos /> },

    // Create repo (THIS FIXES YOUR ERROR)
    { path: "/create", element: <CreateRepository /> },

    // Repository pages
    { path: "/repo/:id", element: <RepoDetails /> },
    { path: "/repo/:id/code", element: <RepoContents /> },
    { path: "/repo/:id/issues", element: <RepoIssues /> },
    { path: "/repo/:id/issues/new", element: <CreateIssue /> },
    { path: "/repo/:id/edit", element: <RepoEdit /> },

    // Issue pages
    { path: "/issue/:id", element: <IssueDetails /> },
    { path: "/issue/:id/edit", element: <EditIssue /> },
  ]);
};

export default ProjectRoutes;
