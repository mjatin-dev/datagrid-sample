import React from "react";
// import styles from "./styles.module.scss";
import "./style.css";
import { IconButton } from "@mui/material";
import { MdClose } from "react-icons/md";
const SmallDrawer = (props) => {
  return (
    <>
      <div
        className={`filter-popup ${props.isShowMobileFilter && `popup-open`}`}
        style={{
          boxShadow: props.isShowMobileFilter
            ? "1px 1px 9999px 9999px rgba(0,0,0,0.7)"
            : "none",
        }}
      >
        <div className="container" style={{ width: "364px", height: "auto" }}>
          <div className="popup-header d-flex align-items-center justify-content-between mt-5">
            <h3 style={{ marginBottom: "0px" }}>Filters</h3>
            <IconButton
              disableTouchRipple={true}
              onClick={() => props.changeShowUpdateDetail()}
            >
              <MdClose />
            </IconButton>
          </div>
          <div className="filter-wrapper-desktop">
            <div>{props.children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SmallDrawer;
