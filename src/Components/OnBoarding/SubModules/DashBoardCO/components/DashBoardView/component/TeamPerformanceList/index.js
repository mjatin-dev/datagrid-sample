/* eslint-disable react-hooks/exhaustive-deps */
import { IconButton } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Container from "SharedComponents/Containers";
import dashboardStyles from "../../../../../../../../SharedComponents/Dashboard/styles.module.scss";
import { setTeamPerformanceUser } from "Components/OnBoarding/SubModules/DashBoardCO/MenuRedux/actions";
import { Close } from "@mui/icons-material";
import { clearTasksByTeamPerformance } from "SharedComponents/Dashboard/redux/actions";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import CheckTable from "../AnalyticsList/CheckTable";
import { createCustomDataGridStore } from "CommonModules/helpers/tasks.helper";
const TeamPerformanceList = ({
  defaultVisibleColumns,
  setDefaultVisibleColumns,
}) => {
  const [limits, setLimits] = useState({
    offset: 0,
    limit: 1000,
    filter: "Team",
  });
  const { data } = useSelector(
    (state) => state?.DashboardState?.tasksByTeamPerformanceUser
  );
  const teamPerformanceUser = useSelector(
    (state) => state.adminMenu.teamPerformanceUser
  );

  const takeActionActiveTab = useSelector(
    (state) => state?.adminMenu?.takeActionActiveTab
  );
  const mainContainerRef = useRef();
  const tasksListScrollHeight = useScrollableHeight(mainContainerRef, 64, [
    teamPerformanceUser,
  ]);
  const dispatch = useDispatch();
  const onNext = () => {
    setLimits({ ...limits, offset: limits.offset + 1 });
  };

  // useEffect(() => {
  //   if (teamPerformanceUser?.user_id) {
  //     dispatch(
  //       fetchTasksByTeamPerformanceUserRequest({
  //         ...limits,
  //         key: teamPerformanceUser?.user_id,
  //       })
  //     );
  //   }
  // }, [limits]);

  const [tblCount, setTblCount] = useState(10);
  const [handleDataSource, setHandleDataSource] = useState([]);
  const skipReff = useRef(0);

  const onClose = () => {
    dispatch(setTeamPerformanceUser(null));
    dispatch(clearTasksByTeamPerformance());
  };
  const fetchTblData = useCallback(async () => {
    const CustomDataStore = createCustomDataGridStore(
      takeActionActiveTab,
      skipReff,
      setTblCount,
      teamPerformanceUser
    );
    setHandleDataSource(CustomDataStore);
  }, [
    teamPerformanceUser,
    data,
    setHandleDataSource,
    skipReff,
    setTblCount,
    takeActionActiveTab,
  ]);

  useEffect(() => {
    if (teamPerformanceUser?.user_id) {
      setLimits({ ...limits, offset: 0 });
      skipReff.current = 1;
      fetchTblData();
    }
  }, [teamPerformanceUser]);

  useEffect(() => {
    fetchTblData();
  }, [data]);

  return (
    <Container variant="main">
      <Container variant="container">
        <Container variant="content" className="px-0" isShowAddTaskButton>
          <div
            className={`${dashboardStyles.dashboardHeaderContainer} justify-content-between align-items-center m-0`}
          >
            <h5 className="mb-0">{teamPerformanceUser.user_name}</h5>
            <IconButton
              className="ml-2"
              size="small"
              disableTouchRipple={true}
              onClick={onClose}
            >
              <Close />
            </IconButton>
          </div>
          <div
            id="teamPerformanceDataScrollableList"
            ref={mainContainerRef}
            style={{
              height: tasksListScrollHeight,
            }}
            className={`${dashboardStyles.dashboardMainContainer} mt-2`}
          >
            <CheckTable
              TableData={handleDataSource}
              onNext={onNext}
              rowCount={tblCount}
              currentAnalyticsKey={takeActionActiveTab}
              defaultVisibleColumns={defaultVisibleColumns}
              setDefaultVisibleColumns={setDefaultVisibleColumns}
              is_teamperformance={true}
            />
          </div>
        </Container>
      </Container>
    </Container>
  );
};

export default TeamPerformanceList;
