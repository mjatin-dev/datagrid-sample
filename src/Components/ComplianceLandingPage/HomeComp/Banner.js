import banner1 from "../../../../src/assets/Images/home/banner.png";
import React from "react";
import { Link } from "react-router-dom";


const DataList = [
  { title: "Stock Brokers" },
  { title: "Depository Participants" },
  { title: "Portfolio Managers" },
  { title: "Alternative Investment Fund" },
  { title: "Investment Advisors" },
  { title: "Research Analysts" },
];

const Checkbox = () => (
  <>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0 12C0 8.8174 1.26428 5.76516 3.51472 3.51472C5.76516 1.26428 8.8174 0 12 0C15.1826 0 18.2348 1.26428 20.4853 3.51472C22.7357 5.76516 24 8.8174 24 12C24 15.1826 22.7357 18.2348 20.4853 20.4853C18.2348 22.7357 15.1826 24 12 24C8.8174 24 5.76516 22.7357 3.51472 20.4853C1.26428 18.2348 0 15.1826 0 12H0ZM11.3152 17.136L18.224 8.4992L16.976 7.5008L11.0848 14.8624L6.912 11.3856L5.888 12.6144L11.3152 17.1376V17.136Z"
        fill="url(#paint0_radial_1321_4042)"
      />
      <defs>
        <radialGradient
          id="paint0_radial_1321_4042"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(4.5 0.999999) rotate(55.8403) scale(16.9189)"
        >
          <stop stop-color="#BEBBFF" />
          <stop offset="1" stop-color="#7A73FF" />
        </radialGradient>
      </defs>
    </svg>
  </>
);
function Banner() {
  return (
    <>
      <div className="bg-banner" style={{ marginTop: "60px" }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 " >
              <h1 className="banner-title  show-mobile-block">
                On-time, worry-free and transparent compliance system
              </h1>
            </div> 
            <div className="col-md-6 order-2 order-md-1">
              <h1 className="banner-title show-desktop-block">
                On-time, worry-free and transparent compliance system
              </h1>

              <ul className="banner-list">
                {DataList.map((item, index) => (
                  <li key={index} className="">
                    <span className="mr-2">
                      <Checkbox />
                    </span>
                    {item.title}
                  </li>
                ))}
              </ul>

              <Link
                to="/compliance-demo"
              >
                <button className="view-demo-btn">
                  View Demo
                </button>
              </Link>
            </div>
            <div className="col-md-6 order-1 order-md-2">
              <img src={banner1} className="img-fluid" alt={"banner-img"} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Banner;
