import React, { useState } from "react";
import "./style.css";

const TextInput = () => {
  return (
    <div>
      <p className="short-answer-p">Text Field</p>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <input
          type="text"
          placeholder="Text Field"
          className="short-answer-input"
          style={{ width: "80%" }}
        />
      </div>
    </div>
  );
};

export default TextInput;
