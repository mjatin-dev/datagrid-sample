import React, { useState } from "react";
import "./style.css";
import Stepper from "SharedComponents/ComplianceStepper";

function MobileStepper({ currentStep }) {
  const [activeStep, setStep] = useState(currentStep ? currentStep : 1);
  const steps = [
    { title: "Stage - 1" },
    { title: "Stage - 2" },
    // { title: "Stage - 3" },
    // { title: "Stage - 4" },
    { title: "Stage - 3" },
  ];

  return (
    <div className="mobile-steper-stripe">
      <Stepper
        steps={steps}
        activeStep={activeStep}
        showNumber={false}
        setStep={setStep}
      />
    </div>
  );
}

export default MobileStepper;
