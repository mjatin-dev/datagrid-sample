import React from "react";
import PropTypes from "prop-types";

// import styles from "./styles.module.scss";

const ViewHeader = (props) => {
  return (
    <div
      className={`d-flex justify-content-${
        props.title ? "between" : "start"
      } align-items-center`}
      style={{ height: "48px" }}
    >
      {props.title && (
        <div className="header-title">
          <p className="header-title mb-0">
            {props.title}
            <>{props.icon}</>
          </p>
        </div>
      )}
      {props.children}
    </div>
  );
};

ViewHeader.propTypes = {
  title: PropTypes.elementType.isRequired,
  icon: PropTypes.elementType.isRequired,
};

export default ViewHeader;
