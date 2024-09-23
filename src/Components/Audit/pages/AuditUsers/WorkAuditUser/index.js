import React, { useEffect, useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useHistory, useRouteMatch } from "react-router";
import "devextreme/dist/css/dx.light.css";
import IconButton from "../../../components/Buttons/IconButton";
import Container from "../../../components/Containers";
import Text from "../../../components/Text/Text";
import styles from "./style.module.scss";
import CompleteWork from "./CompletedWork/CompleteWork";
import CurrentWork from "./CurrentWork/CurrentWork";
import { isMobile } from "react-device-detect";
const tabs = ["Complete Work", "Current Work"];
const WorkAuditUser = () => {
  const history = useHistory();
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const [headerHeight, setHeaderHight] = useState(0);
  const first_name = history?.location?.state?.first_name || "";

  useEffect(() => {
    const headerRef = document
      ?.querySelector("." + styles.header)
      ?.getClientRects()[0]?.height;
    setHeaderHight(Math.trunc(headerRef));
  }, [currentTab]);
  return (
    <Container variant="content">
      <div className={styles.header}>
        <div className="d-flex justify-content-between align-items-center">
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
              text={first_name}
              className="mb-0 ml-3"
            />
          </div>
        </div>
        {tabs.map((tab, index) => (
          <div
            className={`${styles.tab} ${
              currentTab === tab && styles.tabActive
            }`}
            onClick={() => setCurrentTab(tab)}
            key={index}
          >
            {tab}
          </div>
        ))}
      </div>
      <div
        className="mt-1"
        style={{
          height: `calc(95vh - ${headerHeight + (isMobile ? 32 : 96) || 26}px)`,
          overflowY: "auto",
        }}
      >
        {currentTab === tabs[0] && <CompleteWork />}
        {currentTab === tabs[1] && <CurrentWork />}
      </div>
    </Container>
  );
};

export default WorkAuditUser;
