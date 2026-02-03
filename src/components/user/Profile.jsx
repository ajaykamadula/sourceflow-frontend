import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./profile.css";
import Navbar from "../Navbar";
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon } from "@primer/octicons-react";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";

const Profile = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  // SINGLE source of truth
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const res = await axios.get("http://localhost:3000/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (err) {
        console.error("Cannot fetch user details:", err);
      }
    };

    fetchUserDetails();
  }, []);

  if (!user) {
    return (
      <>
        <Navbar />
        <p style={{ padding: "20px" }}>Loading profile...</p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="profile-container">
        {/* PROFILE HEADER */}
        <div className="profile-header">
          <div className="avatar" />

          <div className="profile-info">
            <h2>{user.username}</h2>
            <p className="user-handle">@{user.username}</p>
          </div>

          <div className="profile-actions">
            <button
              className="logout-btn"
              onClick={() => {
                localStorage.clear();
                setCurrentUser(null);
                navigate("/auth");
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* PROFILE STATS */}
        <div className="profile-stats">
          <div className="stat-item">
            <strong>{user.repoCount ?? 0}</strong>
            <span>Repositories</span>
          </div>

          <div className="stat-item">
            <strong>{user.followers?.length ?? 0}</strong>
            <span>Followers</span>
          </div>

          <div className="stat-item">
            <strong>{user.followedUsers?.length ?? 0}</strong>
            <span>Following</span>
          </div>
        </div>

        {/* NAVIGATION */}
        <UnderlineNav aria-label="Profile navigation">
          <UnderlineNav.Item aria-current="page" icon={BookIcon}>
            Overview
          </UnderlineNav.Item>

          <UnderlineNav.Item
            onClick={() => navigate("starred")}
            icon={RepoIcon}
          >
            Starred
          </UnderlineNav.Item>
        </UnderlineNav>

        {/* ACTIVITY */}
        <div className="profile-section">
          <h3>Activity</h3>
          <HeatMapProfile />
        </div>
      </div>
    </>
  );
};

export default Profile;
