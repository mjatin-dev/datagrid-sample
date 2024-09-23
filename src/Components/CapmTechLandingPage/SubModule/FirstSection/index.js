import React from "react";
import "../../style.css";
import BannerBg from "../../../../assets/Images/CAPMLanding/FirstSectionRectangle.png";
import Banner1 from "../../../../assets/Images/CAPMLanding/banner1.png";
import Banner21 from "../../../../assets/Images/CAPMLanding/banner21.png";
import Banner22 from "../../../../assets/Images/CAPMLanding/banner22.png";
import Banner23 from "../../../../assets/Images/CAPMLanding/banner23.png";
import RectangleBottom1 from "../../../../assets/Images/CAPMLanding/RectangleBottom.png";
import RectangleRight from "../../../../assets/Images/CAPMLanding/RectangleRight.png";
import { Link } from "react-router-dom";

function FirstSection() {
  return (
    <div className="first-section">
      <div className="container mt-5">
        {/* <div className="finServicesOuter">
                    <span className="finServices">Built for financial services</span>
                </div> */}
        <p className="landingPageTitle">
          On-time, worry-free and transparent <br />
          compliance system
        </p>
        {/* <div className="center">
          <img className="BannerImg" src={Banner1} alt="" />
        </div> */}
        <div className="center viewDemoOuter">
          <Link to="/compliance-demo">
            {" "}
            <button className="viewDemo btn common-button">View Demo</button>
          </Link>
        </div>
        <div className="center">
          <img className="bannerImg1" src={Banner21} alt="" />
          <img className="bannerImg2" src={Banner22} alt="" />
          <img className="bannerImg3" src={Banner23} alt="" />
        </div>
      </div>
      <div className="RectangleBottom1">
        <img className="RectangleBottom1Img" src={RectangleBottom1} alt="" />
      </div>
      <div className="RectangleRight2">
        <img className="RectangleRight2Img" src={RectangleRight} alt="" />
      </div>
      <div className="bottomBanner1">
        <img className="bottomBanner1Img" src={BannerBg} alt="" />
      </div>
    </div>
  );
}

export default FirstSection;
