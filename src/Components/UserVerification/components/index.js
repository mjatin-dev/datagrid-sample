import React from "react";
import CheckIcon from "../../../assets/Images/Onboarding/checkIcon.png";
import { withRouter } from "react-router-dom";
function YourAreDone() {
  return (
    <div className="you-are-done">
      <div className="text-section">
        <img src={CheckIcon} alt="CheckIcon" />
        <p className="title"> Wait while verify you! </p>
        <p className="desc">Taking you to the verification process</p>
      </div>
    </div>
  );
}

export default withRouter(YourAreDone);
