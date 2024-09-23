import React from "react";
import "./style.css";
import headerLogo from "../../assets/Images/logo.png";
import { Link } from "react-router-dom";
import Disclaimer from "./Disclaimer";
import PrivacyPolicy from "./PrivacyPolicy";
export default function Footer() {
  const [open, setOpen] = React.useState(false);
  const [openPrivacy, setOpenPrivacy] = React.useState(false);
  const handleOpenPrivacy = () => setOpenPrivacy(true);
  const handleClosePrivacy = () => setOpenPrivacy(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <footer class="bg-dark text-center footer-link">
      <Disclaimer
        handleClose={handleClose}
        handleOpen={handleOpen}
        open={open}
        setOpen={setOpen}
      />
      <PrivacyPolicy
        handleClosePrivacy={handleClosePrivacy}
        handleOpenPrivacy={handleOpenPrivacy}
        openPrivacy={openPrivacy}
        setOpenPrivacy={setOpenPrivacy}
      />
      <div className="container">
        <div class="row">
          <div class="col-lg-4 col-md-4 text-left">
            <Link to="/">
              <img className="header-logo" src={headerLogo} alt="logoaa" />
              <span className="capmtech-text">COMPLIANCE SUTRA</span>
            </Link>
            <Link to="/sign-up" >
              {" "}
              <h1 className="footer-getStartedBtn">
              <button className="get-started">GET STARTED</button>{" "}</h1>
            </Link>
          </div>

          <div class="col-lg-3 offset-lg-2 col-md-6 mb-4 mb-md-0">
            <div className="footer-title">Our Products</div>
            <div className="links-grid">
              <p>
                <Link to="#" class="footer-link">
                  Compliance
                </Link>
              </p>
              <p>
                <Link to="#" class="footer-link">
                  Audit
                </Link>
              </p>
              <p>
                <Link to="#" class="footer-link">
                  Process
                </Link>
              </p>
            </div>
          </div>

          {/* <div class="col-lg-2 col-md-6 mb-4 mb-md-0">
            <div className="footer-title">About us</div>

            <ul class="list-unstyled mb-0 text-left">
              <li>
                <Link to="/" class="footer-link">
                  Meet the Team
                </Link>
              </li>
              <li>
                <Link to="/" class="footer-link">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/" class="footer-link">
                  Career
                </Link>
              </li>
            </ul>
          </div> */}

          <div class="col-lg-3 col-md-6 mb-4 mb-md-0">
            <div className="footer-title">Contact Us</div>

            <ul class="list-unstyled mb-0 text-left">
              <li>
                <a href="tel:+91-9870210171" class="footer-link">
                  +91 9870210171
                </a>
              </li>
              <li>
                <a href="mailto:kaushik@secmark.in" class="footer-link">
                  kaushik@secmark.in
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="copyright-grid">
          <div className="row mt-2">
            <div className="col-sm-12 col-lg-6">
             <div className="footer-disclaimer"> © 2020 Copyright: <a  href="mailto:kaushik@secmark.in">
                kaushik@secmark.in
              </a></div>
              
            </div>
            <div className="col-sm-12 col-lg-3">
              <div className="footer-disclaimer" onClick={handleOpen} >Disclaimer</div>
            </div>
            <div className="col-sm-12 col-lg-3">
              <div className="footer-disclaimer" onClick={handleOpenPrivacy}>Privacy Policy</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
