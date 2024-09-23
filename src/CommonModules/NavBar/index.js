/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./style.css";
import Logo from "../../assets/Images/CAPMLanding/NavLogo.svg";
import { Link } from "react-router-dom";
function NavBar() {
  return (
    <div className="navbar-position">
      <div className="container navbar-bottom-border">
        <nav className="navbar navbar-expand-lg navbar-light">
          <Link className="navbar-brand navbar-heading" to="/">
            <img src={Logo} alt="Logo" /> COMPLIANCE SUTRA
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link nav-link-fonts" to="/pricing">
                  Pricing
                </Link>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link nav-link-fonts"
                  href="mailto:kaushik@secmark.in"
                >
                  Support
                </a>
              </li>
            </ul>
            <div className="my-2 my-lg-0">
              <ul className="navbar-nav">
                <li className="nav-item dropdown">
                  <a
                    className="nav-link nav-link-fonts dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Contact Sales
                  </a>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <a className="dropdown-item" href="tel:+91-9870210171">
                      +91 9870210171
                    </a>
                    <div className="dropdown-divider" />
                    <a className="dropdown-item" href="mailto:kaushik@secmark.in">
                      kaushik@secmark.in
                    </a>
                  </div>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link nav-link-fonts"
                    to="/login"
                    title=" Login"
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/sign-up">
                    {" "}
                    <button
                      className="navbar-getstarted-button"
                      href="#"
                      title="Get Started"
                    >
                      Get Started
                    </button>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default NavBar;
