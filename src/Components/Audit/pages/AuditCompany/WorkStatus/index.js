import React, { useState } from "react";
import styles from "./style.module.scss";
import Text from "../../../components/Text/Text";
import IconButton from "../../../components/Buttons/IconButton";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useHistory } from "react-router";
import CurrentWork from "./CurrentWork";
import CompletedWork from "./CompletedWork";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import Container from "../../../components/Containers";

function AuditCompanyWorkStatus() {
  const tabs = ["Current Work", "Completed Work"];
  const history = useHistory();
  const routeName = history?.location?.state?.routeName || "";
  const [currentTab, setCurrentTab] = useState(tabs[0]);

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
            text={routeName}
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
      {currentTab === "Current Work" ? <CurrentWork /> : <CompletedWork />}
    </Container>
  );
}

export default AuditCompanyWorkStatus;
