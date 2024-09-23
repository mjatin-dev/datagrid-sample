import React from "react";
import "./style.css";

const NoResultFound = ({ text }) => {
  return (
    <div className="d-flex align-items-center justify-content-center no-detail-container">
      <p className="text-muted text-center">{text}</p>
    </div>
  );
};

export default NoResultFound;
