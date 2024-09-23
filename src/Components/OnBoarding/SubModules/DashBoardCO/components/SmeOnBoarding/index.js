import SideBar from "Components/OnBoarding/SubModules/SideBar";
import React from "react";
import RightImageBg from "assets/Images/Onboarding/RectangleOnboadign.png";
import OnBoardingForm from "./onBoardingForm";
import complianceLogo from "assets/Images/CapmTech.png";
import { Link } from "react-router-dom";

function SmeOnBoarding() {
  return (
    <div className='row getStartMobile'>
      <div className='col-3 left-fixed'>
        <div className='on-boarding'>
          <SideBar />
        </div>
      </div>
      <div className='col-12 padding-right'>
        <img
          className='bottom-right-bg'
          src={RightImageBg}
          alt='RightImageBg'
        />
        <div className='get-main-get-start'>
          <div className='get-started-header'>
            <div className='row'>
              <div className='col-lg-12'>
                <div className='header_logo'>
                  <Link to='/'>
                    <img
                      src={complianceLogo}
                      alt='COMPLIANCE SUTRA'
                      title='COMPLIANCE SUTRA'
                    />
                    <span className='camp'>COMPLIANCE SUTRA</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <OnBoardingForm />
          {/* <ApplicationSuccess/> */}
        </div>
      </div>
    </div>
  );
}

export default SmeOnBoarding;
