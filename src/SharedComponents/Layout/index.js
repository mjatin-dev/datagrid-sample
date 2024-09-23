import React from "react";
import Sidebar from "./Sidebar";
import "./style.css";
import backgroundImage from "../../assets/Images/Onboarding/co-bg.png";

const Layout = (Component) => {
  return function layoutComponent({ isLoading, ...props }) {
    return (
      <div className="layout-container position-relative">
        <img
          src={backgroundImage}
          alt="background-csutra"
          className="layout-container__background"
        />
        <div>
          <Sidebar />
        </div>
        <div className="components-container">
          <Component {...props} />
        </div>
      </div>
    );
  };
};
export default Layout;
