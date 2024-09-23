import "./Navbar.scss";
import Burger from "../../assets/Images/home/ham-burger.png";
import HomeIcon from "../../assets/Images/home/home-icon.svg";
import PriceIcon from "../../assets/Images/home/dollar-square.svg";
import HelpIcon from "../../assets/Images/home/24-support.png";
import SalesIcon from "../../assets/Images/home/sales.svg";

import React from "react";
import { Link } from "react-router-dom";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MobileSidebar from "./MobileSidebar";
import { useHistory } from "react-router";
import { isShowSmeModule } from "app.config";

// login
const LiList = [
  { link: "/", title: "Home", icon: HomeIcon },
  { link: "/pricing", title: "Pricing", icon: PriceIcon },
  { link: "#", title: "Help", icon: HelpIcon },
  { link: "#", title: "Sales", icon: SalesIcon },
];

const NewNavbar = () => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openSidebar, setOPenSidebar] = React.useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <nav className="main-navbar navbar navbar-expand-lg fixed-top navbar-light bg-light p-0">
        <div className="container-md">
          {/* Left elements */}
          <div className="d-flex align-items-center justify-content-between navbar-brand-section">
            {/* Brand */}
            <a
              className="navbar-brand me-2 mb-1 d-flex align-items-center"
              href="#"
            >
              <span
                className="nav-show-mobile-btn"
                onClick={() => setOPenSidebar(true)}
              >
                <img src={Burger} className="burger-icon" />
              </span>
              <img
                src="/images/newComplianceLogo.svg"
                height={50}
                alt="COMPLIANCE SUTRA LOGO"
                loading="lazy"
                className="brand-logo"
                style={{ marginTop: 2, marginRight: "10px" }}
                onClick={() => {
                  history.push("/");
                }}
              />
              <span
                onClick={() => {
                  history.push("/");
                }}
                className="brand-text"
              >
                COMPLIANCE SUTRA
              </span>
            </a>

            <Link
              to="/compliance-demo"
              className="btn btn-default btn-purple nav-btn nav-show-mobile-btn"
            >
              View Demo
            </Link>
          </div>
          {/* Left elements */}
          {/* Center elements */}
          <ul className="navbar-nav flex-row show-desktop">
            <li className="nav-item me-3 me-lg-1 active">
              <Link to={"/"}>
                <a className="nav-link" href="#">
                  <span>Home</span>
                </a>
              </Link>
            </li>
            <li className="nav-item me-3 me-lg-1 ">
              <Link to={"/pricing"}>
                <a className="nav-link" href="#">
                  <span>Pricing</span>
                </a>
              </Link>
            </li>

            <li className="nav-item me-3 me-lg-1 ">
              {/* <Link to={"/FAQ"}>
              <a className="nav-link" href="#">
                <span>Help</span>
              </a>
            </Link> */}
              <a className="nav-link" href="#" onClick={handleClick}>
                <span>Help</span>
              </a>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={handleClose}>
                  Write us on &nbsp;
                  <a href="mailto:kaushik@secmark.in">kaushik@secmark.in</a>
                </MenuItem>
              </Menu>
            </li>
            <li className="nav-item dropdown me-3 me-lg-1 textColor">
              <a
                className="nav-link nav-link-fonts dropdown-toggle textColor"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                style={{ color: "grey" }}
              >
                Sales
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="tel:919870210171">
                  +91 9870210171
                </a>
                <div className="dropdown-divider" />
                <a className="dropdown-item" href="mailto:kaushik@secmark.in">
                  kaushik@secmark.in
                </a>
              </div>
            </li>
          </ul>
          {/* Center elements */}
          {/* Right elements */}
          <ul className="navbar-nav flex-row  side-btns show-desktop">
            <li className="nav-item me-3 me-lg-1 mx-4">
              <Link to="/login" className="btn btn-default btn-purple nav-btn">
                Login
              </Link>
            </li>
            <li className="nav-item me-3 me-lg-1">
              <Link
                to="/sign-up"
                className="btn btn-default btn-purple nav-btn"
              >
                Get Started
              </Link>
            </li>
            {isShowSmeModule &&  history.location.pathname !== "/join-expert" && (
              <li className="nav-item me-3 ml-4 me-lg-1">
                <Link
                  to="/join-expert"
                  className="btn btn-default btn-purple nav-btn"
                >
                  Join as an Expert
                </Link>
              </li>
            )}
          </ul>
          {/* Right elements */}
        </div>
      </nav>

      <ul className=" fixe-buttons">
        <li className="nav-link">
          <a
            href="https://apps.apple.com/sa/app/compliance-sutra/id1625028234"
            target="_blank"
          >
            <img
              src={"/images/app-store.png"}
              alt="app-store"
              className="img-fluid"
            />
          </a>
        </li>
        <li className="nav-link">
          <a
            href="https://play.google.com/store/apps/details?id=com.compliancesutra&gl=US"
            target="_blank"
          >
            <img
              src={"/images/g-play.png"}
              alt="app-store"
              className="img-fluid"
            />
          </a>
        </li>
      </ul>

      <MobileSidebar
        openSidebar={openSidebar}
        setOPenSidebar={setOPenSidebar}
        LiList={LiList}
      />
    </>
  );
};
export default NewNavbar;
