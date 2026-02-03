import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav>
      <div className="navbar-inner">
        <div className="nav-left">
          <Link to="/">
            <img
              src="/src/assets/logo.png"
              alt="Logo"
            />
          </Link>
          <Link to="/">
            <h3>SourceFlow</h3>
          </Link>
        </div>

        <div className="nav-right">
          <Link to="/create">
            <p>Create a Repository</p>
          </Link>
          <Link to="/profile">
            <p>Profile</p>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
