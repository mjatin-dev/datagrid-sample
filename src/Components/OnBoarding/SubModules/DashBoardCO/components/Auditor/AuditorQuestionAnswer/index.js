import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useHistory, useParams } from "react-router";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import SideBarInputControl from "../../../components/LeftSideBar";
import Text from "../../../../../../Audit/components/Text/Text";
import IconButton from "../../../../../../Audit/components/Buttons/IconButton";
import Questionaire from "./Questionaire";
import Checkpoints from "./Checkpoints";
import Container from "SharedComponents/Containers";
import { useSelector } from "react-redux";
import LongTextPopup from "Components/Audit/components/LongTextPopup/LongTextPopup";

function AuditorQuestionAnswer() {
  const userTypeNo = useSelector(
    (state) => state?.auth?.loginInfo?.auditUserType
  );

  const [tabs, setTabs] = useState(["Questions", "Checkpoints"]);
  const history = useHistory();
  const { type } = useParams();
  const company = history?.location?.state?.company || "";
  const [isTaskListOpen, setIsTaskListOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(type || tabs[0]);

  useEffect(() => {
    if (userTypeNo === 13) {
      setTabs(["Checkpoints"]);
    } else if (userTypeNo === 14) {
      setTabs(["Questions"]);
    } else {
      setTabs(["Questions", "Checkpoints"]);
    }
  }, [userTypeNo]);

  return (
    <div className="row co-dashboard">
      <LongTextPopup/>
      <div className="left-fixed">
        <div className="on-boarding">
          <SideBarInputControl
            isTaskListOpen={isTaskListOpen}
            setIsTaskListOpen={setIsTaskListOpen}
          />
        </div>
      </div>
      <div className="col-12">
        <Container variant="main" style={{ marginLeft: "5vw" }}>
          <Container variant="container">
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
                    text={company}
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
              {currentTab === "Questions" ? (
                <Questionaire assignmentName={company} />
              ) : (
                <Checkpoints assignmentName={company} />
              )}
            </Container>
          </Container>
        </Container>
      </div>
    </div>
  );
}

export default AuditorQuestionAnswer;
