import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Dots from "../../../CommonModules/sharedComponents/Loader/Dots";
import DashboardHeader from "../DashboardHeader";
import TaskAccordion from "../TaskAccordion";
import styles from "./styles.module.scss";
import DashboardSearchResults from "../SearchResults";
const LeftBar = () => {
  const { currentViewByFilter, tasks, tasksBySearchQuery } = useSelector(
    (state) => state?.DashboardState
  );
  const { searchQuery } = tasksBySearchQuery;
  const { isLoading, list: tasksList } = tasks;
  const mainContainerRef = useRef(null);
  useEffect(() => {
    const mainContainer = mainContainerRef.current;
    if (mainContainer) {
      const mainContainerClientTop = mainContainer.getClientRects()[0]?.top;
      mainContainer.style.height = `calc(100vh - ${
        mainContainerClientTop + 16
      }px)`;
    }
  }, []);
  return (
    <div className={`${styles.leftBarContainer} d-none d-md-block`}>
      <div className="mt-5">
        <DashboardHeader isLeftBar={true} />
      </div>
      <div ref={mainContainerRef} className="overflow-auto">
        {!searchQuery ? (
          <>
            {isLoading ? (
              <Dots height="30vh" />
            ) : (
              tasksList &&
              tasksList?.length > 0 &&
              tasksList?.map((item, index) => {
                const { keyName, keyId } = item;
                return (
                  <TaskAccordion
                    key={`taskAccordion-${keyId || keyName}-${index}`}
                    data={item}
                    currentViewByFilter={currentViewByFilter}
                    isLeftBar={true}
                  />
                );
              })
            )}
          </>
        ) : (
          <DashboardSearchResults isLeftBar={true} />
        )}
      </div>
    </div>
  );
};

export default LeftBar;
