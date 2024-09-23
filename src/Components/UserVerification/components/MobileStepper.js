import React, { useState } from "react";
import "./mobileStepper.css";
import Stepper from "SharedComponents/ComplianceStepper";

function MobileStepper() {
  const [activeStep, setStep] = useState(1);
  const steps = [
    { title: "Stage - 1" },
    { title: "Stage - 2" },
    { title: "Stage - 3" },
    { title: "Stage - 4" },
    { title: "Stage - 5" },
  ];

  return (
    <div className="mobile-steper-stripe">
      <Stepper
        steps={steps}
        activeStep={activeStep}
        setStep={setStep}
        showNumber={false}
      />
    </div>
  );
}

export default MobileStepper;
