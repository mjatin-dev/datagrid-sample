import React, { useEffect, useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useHistory } from "react-router";
import "devextreme/dist/css/dx.light.css";

import IconButton from "../../../../components/Buttons/IconButton";
import Container from "../../../../components/Containers";
import Text from "../../../../components/Text/Text";
import styles from "./style.module.scss";
// import Questionnaire from "./Questionnaire";
// import Checkpoints from "./Checkpoints";
import CompletedWork from "../WorkStatus/CompletedWork";
import CurrentWork from "../WorkStatus/CurrentWork";
import { isMobile } from "react-device-detect";
const tabs = ["Completed Work", "Current Work"];
const WorkStatus = () => {
  const history = useHistory();
  const userName = history?.location?.state?.user?.first_name || "";
  const userEmail = history?.location?.state?.user?.email || "";
  
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const [headerHeight, setHeaderHight] = useState(0);
  useEffect(() => {
    const headerRef = document
      ?.querySelector("." + styles.header)
      ?.getClientRects()[0]?.height;
    setHeaderHight(Math.trunc(headerRef));
  }, [currentTab]);

  return (
    <Container variant="content">
      <div className={styles.header}>
        <div className="d-flex mb-3">
          <IconButton
            onClick={() => {
              history.goBack();
            }}
            variant="iconButtonRound"
            description={<MdKeyboardArrowLeft />}
            size="none"
          />
          <Text
            heading="p"
            variant="stepperMainHeading"
            text={userName}
            className="mb-0 ml-3"
          />
        </div>
        {tabs.map((tab) => (
          <div
            className={`${styles.tab} ${
              currentTab === tab && styles.tabActive
            }`}
            onClick={() => setCurrentTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
      <div
        className="mt-3"
        style={{
          height: `calc(95vh - ${headerHeight + (isMobile ? 32 : 96) || 26}px)`,
          overflowY: "auto",
        }}
      >
        {currentTab === tabs[0] && <CompletedWork userEmail={userEmail} />}
        {currentTab === tabs[1] && <CurrentWork userEmail={userEmail} />}
      </div>
    </Container>
  );
};

export default WorkStatus;
