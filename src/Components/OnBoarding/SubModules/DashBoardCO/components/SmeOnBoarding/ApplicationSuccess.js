import React from "react";
import styles from "./style.module.scss";
import ApplicationSuccessImg from "assets/Images/sme/applicationSubmitted.svg";
function ApplicationSuccess() {
  return (
    <div className={styles.applicationSuccess}>
      <h5>Thank you for Submitting your Application</h5>
      <p>Our representative will connect with you shortly</p>
      <img src={ApplicationSuccessImg} alt="application success" />
    </div>
  );
}

export default ApplicationSuccess;
