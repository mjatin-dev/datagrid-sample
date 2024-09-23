import React from "react";
import "./Dots.style.css";
const Dots = ({ className, height, justify = "center", ...rest }) => {
  return (
    <>
      <div
        className={`dots-loading__container d-flex align-items-center justify-content-${justify} w-100 ${
          className || ""
        }`}
        {...rest}
        style={{
          height: height || "50%",
        }}
      >
        <div class="loadingio-spinner-ellipsis-6irb11chj08">
          <div class="ldio-q08kff1w26d">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dots;
