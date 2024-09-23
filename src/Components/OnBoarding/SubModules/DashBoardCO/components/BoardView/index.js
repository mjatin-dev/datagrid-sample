/* eslint-disable no-loop-func */
import React, { useEffect, useState } from "react";
// import "./style.css";
import styled from "styled-components";

import { useSelector } from "react-redux";

import CustomCard from "./Components/BoardCard";
import MyLaneHeader from "./Components/BoardHeader";
import Board from "react-trello";
import {
  getDataByCompany,
  getDataByLicenses,
  getDataByStatus,
  getDataByTeam,
} from "../../../../../../CommonModules/helpers/tasks.helper";

const ScrollableLane = styled.div`
  flex: 1;
  overflow-y: auto;
  min-width: 100%;
  overflow-x: auto;
  align-self: center;
  max-height: 55vh;
  margin-top: 10px;
  flex-direction: column;
  justify-content: space-between;
`;
function BoardView({ isRedirect }) {
  const state = useSelector((state) => state);
  const [taskData, setTaskData] = useState([]);
  // const dashboardCurrentTab = state?.adminMenu?.dashboardCurrentTab;
  const currentBoardViewBy = useSelector(
    (state) => state?.DashboardState?.currentViewByFilter
  );
  const taskList =
    state &&
    state.taskReport &&
    state.taskReport.taskReport &&
    state.taskReport.taskReport.taskReport &&
    state.taskReport.taskReport.taskReport;
  const userDetails = state && state.auth && state.auth.loginInfo;
  useEffect(() => {
    if (taskList && taskList.length > 0) {
      let data = [];
      switch (currentBoardViewBy) {
        case "Status":
          data = getDataByStatus([...new Set([...taskList])]);
          setTaskData(data);
          break;
        case "Company":
          data = getDataByCompany([...new Set([...taskList])]);
          setTaskData(data);
          break;
        case "License":
          data = getDataByLicenses([...new Set([...taskList])]);
          setTaskData(data);
          break;
        case "Team":
          data = getDataByTeam([...new Set([...taskList])]);
          setTaskData(data);
          break;
        default:
          data = getDataByStatus([...new Set([...taskList])]);
          setTaskData(data);
          break;
      }
    }
  }, [taskList, currentBoardViewBy]);
  const data1 = () => {
    let arr1 = [];

    let i = 0;
    let j = 0;
    let obj = [];
    if (taskData) {
      for (i = 0; i < taskData.length; i++) {
        obj = taskData[i].tasks;
        if (
          obj &&
          obj.length > 0 &&
          obj.some((i) => !i.license.includes("Norec"))
        ) {
          for (j = 0; j < taskData[i].tasks.length; j++) {
            obj =
              taskData[i] &&
              taskData[i].tasks &&
              taskData[i].tasks.map((item, index) => {
                if (item.license === "Norec") {
                  return {};
                } else {
                  return (obj = {
                    id: item.task_name + "-" + index,
                    description: item.subject,
                    label: item.due_date,
                    currentBoardViewBy: currentBoardViewBy,
                    metadata: {
                      cardId: "Card2",
                    },
                    title: item.license,
                    status: taskData[i].status,
                    style: { color: "red" },
                    currentItem: item,
                    isRedirect,
                  });
                }
              });
          }

          arr1 = [
            ...arr1,
            Object.assign({
              id: taskData[i].status,
              title: taskData[i].status,
              cards: obj,
              cardStyle: { minWidth: "100px", color: "red" },
            }),
          ];
        }
      }
    }

    return { lanes: arr1 };
  };

  const components = {
    // GlobalStyle: MyGlobalStyle, // global style created with method `createGlobalStyle` of `styled-components`
    LaneHeader: MyLaneHeader,
    Card: CustomCard,
    ScrollableLane: ScrollableLane,
    data: data1(),
    // AddCardLink: MyAddCardLink,
  };
  return (
    <div className="row">
      <div className="col-12">
        {taskData && taskData.length > 0 && (
          <div className="task-list-grid customHeight">
            <Board
              components={components}
              laneStyle={
                userDetails.UserType === 5 || userDetails.UserType === 4
                  ? {
                      maxHeight: "98vh",
                      maxWidth: "100%",
                      height: "calc(100vh - 420px)",
                    }
                  : { maxHeight: "98vh", maxWidth: "100%", height: "59vh" }
              }
              cardDraggable={false}
              draggable={false}
              cardStyle={{ minWidth: "100%" }}
              editable={false}
              hideCardDeleteIcon={true}
              style={{ backgroundColor: "transparent" }}
              data={data1()}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default BoardView;
