import React from "react";

const TaskLicense = ({ text }) => {
  return (
    <div
      className="task-status__container"
      style={{
        borderRadius: "0.125rem",
        backgroundColor: "rgb(108, 93, 211)",
      }}
    >
      <p
        className="task-status__text--task-list"
        style={{
          fontWeight: "500",
          color: "#fff",
        }}
      >
        {text}
      </p>
    </div>
  );
};

export default TaskLicense;
