import React from "react";
import SideImage from "../../../../src/assets/Images/home/perImg.png";
import Mobilemg from "../../../../src/assets/Images/home/mobileImg.png";
import CurveLineImg from "../../../../src/assets/Images/home/curveLine.png";
import CurveLineImgMobile from "../../../../src/assets/Images/home/mobile-line.png";

function TaskSection() {
  return (
    <>
      <section className="section-wrapper py-5 brand-section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2 className="my-auto text-center brand-title ">
                Access tasks completion and performance from anywhere.
              </h2>
            </div>
            <div className="col-md-7 align-items-center justify-content-left d-flex d-img-section order-3 order-md-1">
            <img
                src={SideImage}
                className="img-fluid text-img dashboard-img"
                alt="text-img"
              />
            </div> 
            <div className="col-md-1 position-relative  d-flex order-2 order-md-2">
              <img className="curve-line-img" src={CurveLineImg} alt="line-icon" />
              <img className="mobile-line-img" src={CurveLineImgMobile} alt="mobile-line-img"  />
            </div> 
            <div className="col-md-4 d-flex  justify-content-right  order-1 order-md-3 mobile-img-section">
              <img
                src={Mobilemg}
                className="img-fluid text-img"
                alt="text-img"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default TaskSection;
