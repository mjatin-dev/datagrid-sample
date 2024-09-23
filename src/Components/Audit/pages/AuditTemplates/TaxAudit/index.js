import React, { useEffect, useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useHistory } from "react-router";
import IconButton from "../../../components/Buttons/IconButton";
import Container from "../../../components/Containers";
import Text from "../../../components/Text/Text";
import styles from "./style.module.scss";
import Questionnaire from "./Questionnaire";
import Checkpoints from "./Checkpoints";
import { isMobile } from "react-device-detect";
import LongTextPopup from "Components/Audit/components/LongTextPopup/LongTextPopup";
const tabs = ["questionnaire", "checkpoints"];
const TaxAudit = () => {
  const history = useHistory();
  const { templateName, templateId } = history?.location?.state;
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const [headerHeight, setHeaderHight] = useState(0);
  useEffect(() => {
    const headerRef = document
      ?.querySelector("." + styles.header)
      ?.getClientRects()[0]?.height;
    setHeaderHight(Math.trunc(headerRef));
  }, [currentTab]);

  useEffect(() => {
    let searchParams = history.location?.search;
    if (
      searchParams &&
      new URLSearchParams(searchParams).get("isChecklist") === "true"
    ) {
      setCurrentTab(tabs[1]);
    }
  }, []);

  return (
    <Container variant="content">
      <LongTextPopup/>
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
            text={templateName}
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
        {currentTab === tabs[0] && <Questionnaire templateId={templateId} templateName={templateName} />}
        {currentTab === tabs[1] && <Checkpoints templateId={templateId} templateName={templateName}/>}
      </div>
    </Container>
  );
};

export default TaxAudit;
