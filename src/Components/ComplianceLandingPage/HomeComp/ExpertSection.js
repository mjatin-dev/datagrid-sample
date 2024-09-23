import joinExpert from "../../../../src/assets/Icons/Join-expert.svg";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import NewNavbar from "CommonModules/NavBar/NewNavbar";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function ExpertSection() {
  const [state, setState] = useState(false);
  const history = useHistory();
  return (
    <>
      <NewNavbar />
      <div className='bg-banner' style={{ marginTop: "60px" }}>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12 '>
              <h1 className='banner-title  show-mobile-block'>Hi,</h1>
            </div>
            <div className='col-md-6 order-2 order-md-1'>
              <h1 className='banner-title show-desktop-block'>Hi,</h1>
              <p className='join-expert-p'>
                If you are a compliance expert in any domain and assist your
                clients in complying with thelaws the right way, you are at the
                right place to excel your business and expand your reach by
                joining{" "}
                <a
                  style={{ color: "black", textDecoration: "underline" }}
                  href='https://www.w3schools.com'
                >
                  compliancesutra.com (CS)
                </a>{" "}
                as a Subject Matter Expert (SME).
              </p>

              <p className='join-expert-p'>
                To become an SME you should possess expertise in a specific
                domain of compliance and applicable laws and would be
                responsible for:
              </p>

              <ul>
                <li>
                  <p className='join-expert-p'>
                    Creating “Compliance Events” – Compliance events are the
                    date based compliance requirements from regulators. Eg. If
                    you are in expert in Income Tax, one compliance event can be
                    - July 31, 2023 – Filing income tax returns for assesses
                    other than tax audit.
                  </p>
                </li>

                <li>
                  <p className='join-expert-p'>
                    Publish “Updates” – You will be responsible for providing
                    regulatory updates, which will be published to the users who
                    have subscribed for the relevant services.
                  </p>
                </li>
              </ul>

              <p className='join-expert-p'>Thinking what will you get?</p>

              <ul>
                <li>
                  <span>
                    <p className='join-expert-p'>
                      On being associated with CS, you stand a chance to earn up
                      to 50% share of the income that CS generates from the
                      subscribers who subscribe to compliances created by you.
                      So let’s explore the world of compliance together with CS
                      by registering yourself as a SME.
                    </p>
                  </span>
                </li>
              </ul>

              <span className='d-flex mt-4'>
                <input
                  type='checkbox'
                  className='checkBox-input'
                  onClick={(event) => {
                    setState(event.target.checked);
                  }}
                />
                <p className='join-expert-p mb-0 ml-2'>Terms and conditions.</p>
              </span>

              <button
                className='join-now-btn'
                disabled={!state}
                onClick={() => {
                  if (state) {
                    window.location.href = "/sme-onboarding";
                    //history.push("/sme-onboarding");
                  } else {
                    toast.error("Please accept terms and conditions");
                  }
                }}
              >
                Join now
              </button>
            </div>
            <div className='col-md-6 order-1 order-md-2'>
              <img src={joinExpert} className='img-fluid' alt={"joinExpert"} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ExpertSection;
