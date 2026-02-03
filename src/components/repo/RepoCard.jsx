import { useNavigate } from "react-router-dom";
import {
  IssueOpenedIcon,
  StarIcon,
  RepoIcon,
  LockIcon,
} from "@primer/octicons-react";
import "./repo-card.css";

const RepoCard = ({ repo, onStarToggle }) => {
  const navigate = useNavigate();

  return (
    <div className="repo-card">
      {/* LEFT */}
      <div className="repo-info">
        <div className="repo-title">
          <RepoIcon size={14} />
          <h3>{repo.name}</h3>

          {!repo.visibility && (
            <span className="repo-private">
              <LockIcon size={12} /> Private
            </span>
          )}
        </div>

        <p className="repo-description">
          {repo.description || "No description provided"}
        </p>

        <div className="repo-actions">
          <button
            className="issues-link"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/repo/${repo._id}/issues`);
            }}
          >
            <IssueOpenedIcon size={14} />
            <span>Issues</span>
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <button
        className={`star-button ${repo.isStarred ? "starred" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onStarToggle && onStarToggle(repo._id);
        }}
        title={repo.isStarred ? "Unstar repository" : "Star repository"}
      >
        <StarIcon size={16} />
      </button>
    </div>
  );
};

export default RepoCard;
