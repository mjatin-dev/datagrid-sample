import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import Text from "../../components/Text/Text";
import Container from "../../components/Containers";
import CustomTemplates from "./CustomTemplates";
import StandardTemplates from "./StandardTemplate";
import { isMobile } from "react-device-detect";


const tabs = ["Custom", "Standard"];
function AuditTemplates() {
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const [headerHeight, setHeaderHight] = useState(0);

  useEffect(() => {
    // dispatch(auditTemplateActions.getAuditTemplatesList());
  }, []);

  useEffect(() => {
    const headerRef = document
      ?.querySelector("." + styles.header)
      ?.getClientRects()[0]?.height;
    setHeaderHight(Math.trunc(headerRef));
  }, [currentTab]);

  return (
    <>
      {/* <BackDrop isLoading={isLoading} /> */}
      <Container variant="content">
        <div className={styles.header}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Text
              heading="p"
              variant="stepperMainHeading"
              text="Audit Templates"
              className="mb-0"
            />
          </div>
          {tabs.map((tab) => (
            <div
              key={tab}
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
            height: `calc(95vh - ${
              headerHeight + (isMobile ? 32 : 96) || 26
            }px)`,
            // overflowY: "auto",
          }}
        >
            <>
              {currentTab === tabs[0] && (
                <CustomTemplates/>
              )}
              {currentTab === tabs[1] && (
                <StandardTemplates/>
              )}
            </>
        </div>
      </Container>
    </>
  );
}

export default AuditTemplates;
