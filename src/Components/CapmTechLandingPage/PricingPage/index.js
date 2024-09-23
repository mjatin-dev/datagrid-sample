import React, { useEffect, useRef } from "react";
import NavBar from "CommonModules/NavBar";
import Pricing from "./Pricing";
import FooterNew from "Components/ComplianceLandingPage/HomeComp/Footer";
import FooterOld from "CommonModules/Footer";
import NewNavbar from "CommonModules/NavBar/NewNavbar";
import currentEnvironment, { environments } from "app.config";

function PricingPage() {
  useEffect(() => {
    document.body.scrollTop = 0;
  }, []);
  return (
    <div>
      {/* <NavBar /> */}
      <NewNavbar/>
      <Pricing />
      <FooterNew/>
      {/* <FooterOld/> */}
    </div>
  );
}

export default PricingPage;
