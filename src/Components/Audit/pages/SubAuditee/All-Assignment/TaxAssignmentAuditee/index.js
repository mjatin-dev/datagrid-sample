import React, { useEffect, useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useHistory } from "react-router";
import "devextreme/dist/css/dx.light.css";
import IconButton from "Components/Audit/components/Buttons/IconButton";
import Container from "Components/Audit/components/Containers";
import Text from "Components/Audit/components/Text/Text";
import styles from "./style.module.scss";
import Questionarie from "./Questionarie";

const tabs = ["questionnaire"];

function TaxAuditeeSubOrdinate() {
  const history = useHistory();
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const [headerHeight, setHeaderHight] = useState(0);
  const assignment_name = history?.location?.state?.assignment_name || "";
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
            text={assignment_name}
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
      <div className="mt-3 pr-2">
        {currentTab === tabs[0] && <Questionarie />}
      </div>
    </Container>
  );
}

export default TaxAuditeeSubOrdinate;
