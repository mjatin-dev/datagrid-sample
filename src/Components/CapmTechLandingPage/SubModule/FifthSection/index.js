import React from "react";
import "./style.css";
import { AiOutlineArrowRight } from "react-icons/ai";
import CustomersTestimonial from "../imagecrousel";
import { Link } from "react-router-dom";
function FifthSection() {
  return (
    <div className="fifth-section mt-5 mb-5">
      <div className="container">
        {/* <CustomersTestimonial /> */}
        <div className="fifth-section-heading">
          <h2 className="fifth-section-heading1">Ready To get started?</h2>
          <h1 className="fifth-section-heading2">
            Set up <span className="fifth-section-heading3">Compliance</span>{" "}
            for
          </h1>
          <h1 className="fifth-section-heading2">Your Company</h1>
        </div>
        <div className="d-flex justify-content-center">
          <div className="p-2">
            <Link to="/sign-up">
              {" "}
              <button className="fifth-section-getstarted-button">
                Get Started
              </button>{" "}
            </Link>
          </div>
          <div className="p-2">
            <Link to="/compliance-demo">
              {" "}
              <button className="fifth-section-viewdemo-button">
                View Demo
              </button>
            </Link>
          </div>
        </div>

        <div className="container">
          <div className="fifth-section-linebreaker"></div>
          <div className="row">
            <div className="col">
              <h1 className="fifth-section-Connectwith">
                Connect with our sales team
              </h1>
              <p className="fith-section-para">
                We will be happy to answer your sales queries and we will be in
                touch as soon as possible
              </p>
              <a href="tel:+91-9870210171">
                {" "}
                <h3
                  className="fifth-section-contact-and-pricing"
                  href="tel:+91-9870210171"
                >
                  CONTACT <AiOutlineArrowRight />
                  <div className="fifth-section-hover-popup">
                    +91-9870210171
                  </div>
                </h3>
              </a>
            </div>
            <div className="col">
              <h1 className="fifth-section-Connectwith">Checkout our prices</h1>
              <p className="fith-section-para">
                Suitable pricing options for companies with all sizes and
                requirements
              </p>
              <h3 className="fifth-section-contact-and-pricing">
                <Link to="/pricing">
                  PRICING <AiOutlineArrowRight />
                </Link>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FifthSection;
