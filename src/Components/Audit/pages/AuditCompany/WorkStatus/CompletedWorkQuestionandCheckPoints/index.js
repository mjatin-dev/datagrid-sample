import React, { useEffect, useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useHistory } from "react-router";
import "devextreme/dist/css/dx.light.css";

import IconButton from "../../../../components/Buttons/IconButton.jsx";
import Container from "../../../../components/Containers";
import Text from "../../../../components/Text/Text";
import styles from "./style.module.scss";
import Questionnaire from "./Questionnaire";
import Checkpoints from "./Checkpoints";


const tabs = ["questionnaire", "checkpoints"];
const TaxAudit = () => {
  const history = useHistory();
  const assignment_name = history?.location?.state?.assignment_name || "";
  const type = history?.location?.state?.type || null;
  const [currentTab, setCurrentTab] = useState(type || tabs[0]);
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
            text={assignment_name || ""}
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
      <>
        {currentTab === tabs[0] && <Questionnaire />}
        {currentTab === tabs[1] && <Checkpoints />}
      </>
    </Container>
  );
};

export default TaxAudit;
