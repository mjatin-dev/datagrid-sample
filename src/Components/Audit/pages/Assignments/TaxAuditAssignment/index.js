import React, { useEffect, useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useHistory, useParams } from "react-router";
import "devextreme/dist/css/dx.light.css";

import IconButton from "../../../components/Buttons/IconButton";
import Container from "../../../components/Containers";
import Text from "../../../components/Text/Text";
import styles from "./style.module.scss";
import Questionare from "./Questionare";
import Checkpoint from "./Checkpoint";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentAssignmentName } from "Components/Audit/redux/actions";
import LongTextPopup from "Components/Audit/components/LongTextPopup/LongTextPopup";

const tabs = ["Questions", "Checkpoints"];

function TaxAuditAssignment() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { type } = useParams();

  const audit_name = history.location.state?.audit_name || "";

  const [currentTab, setCurrentTab] = useState(type);
  const [headerHeight, setHeaderHight] = useState(0);

  const assignment_name = useSelector(
    (state) =>
      state?.auditCommonUtilsReducer?.assignments?.currentOpenedAssignmentName
  );

  useEffect(() => {
    const headerRef = document
      ?.querySelector("." + styles.header)
      ?.getClientRects()[0]?.height;
    setHeaderHight(Math.trunc(headerRef));
  }, [currentTab]);

  useEffect(() => {
    if (history.location.state?.audit_name) {
      dispatch(setCurrentAssignmentName(history.location.state?.audit_name));
    }
  }, [history.location.state?.audit_name]);

  return (
    // <Container variant="container">
    <Container variant="content">
      <div className={styles.header}>
        <LongTextPopup />
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
            text={audit_name || assignment_name}
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
        {currentTab === tabs[0] && <Questionare auditName={audit_name} />}
        {currentTab === tabs[1] && <Checkpoint auditName={audit_name} />}
      </div>
    </Container>
  );
}

export default TaxAuditAssignment;
