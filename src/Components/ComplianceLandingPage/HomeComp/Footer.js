import lionIcon from "../../../assets/Images/home/india.svg";

import React from "react";
import Disclaimer from "./Disclaimer";
import PrivacyPolicy from "./PrivacyPolicy";

const Footer = () => {
  const [open, setOpen] = React.useState(false);
  const [openPrivacy, setOpenPrivacy] = React.useState(false);
  const handleOpenPrivacy = () => setOpenPrivacy(true);
  const handleClosePrivacy = () => setOpenPrivacy(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const scrollToTop = () => {
    document.body.scrollTop = 0;
  };

  return (
    <>
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
      <footer className="footer-distributed">
        <div className="container" style={{ height: "fit-content" }}>
          <div className="row">
            <div className="footer-left col-md-6">
              <h3 onClick={scrollToTop}>
                <img
                  src="/images/newComplianceLogo.svg"
                  className="footer-logo"
                  alt="COMPLIANCE SUTRA"
                />{" "}
                COMPLIANCE SUTRA
              </h3>
            </div>
            <div className="col-md-6 row">
              {/* <div className="footer-center col-6 ">
              <ul className="products-footbar">
                <li>Our Products</li>
                <li>Compliance</li>
                <li>Audit</li>
                <li>Process</li>
              </ul>
            </div> */}
              <div className="footer-center col-12">
                <ul className="verticle-list align-items-baseline">
                  <li>Contact us</li>
                  <li>
                    <a href="tel:919870210171" className="alignLeftbtn">
                      +91 9870210171
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:kaushik@secmark.in"
                      className="alignLeftbtn"
                    >
                      kaushik@secmark.in
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="container foot">
          <div className="row">
            <div className="col-md-3 leading-8">
              <div className="d-flex">
                <p className="text-white copyright">
                  2020 Copyright : <a href="">kaushik@secmark.in</a>
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex main-section">
                <img src={lionIcon} className="lion-icon" />
                <span className="text-white make-india">Make in India </span>

                <span className="text-white">
                  Powered by SecMark Consultancy Limited
                </span>
              </div>
            </div>

            <div className="col-md-3">
              <div className="d-flex text-right disclamer-section">
                <a ClasName="text-white mr-2" onClick={handleOpen}>
                  Disclaimer
                </a>
                &nbsp; &nbsp; &nbsp;
                <a ClasName="text-white ml-2" onClick={handleOpenPrivacy}>
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
export default Footer;
