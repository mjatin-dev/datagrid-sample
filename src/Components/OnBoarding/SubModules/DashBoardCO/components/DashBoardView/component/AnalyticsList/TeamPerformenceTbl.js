import React, { useEffect, useRef, useState } from "react";
import moment from "moment";

import PivotGrid, { FieldChooser } from "devextreme-react/pivot-grid";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import assignIconRound from "../../../../../../../../assets/Icons/assignIconCircle.png";
import { createStore } from "devextreme-aspnet-data-nojquery";
import { MdInfo } from "react-icons/md";
import Dropdown from "react-dropdown";
import styles from "./style.module.scss";
import { exportGrid } from "Components/Audit/constants/CommonFunction";

// import DataGrid, {
//   Column,HeaderFilter,
//   Grouping,
//   GroupPanel,
//   Paging,
//   SearchPanel,
//   Scrolling,
//   Summary,
//   TotalItem,
// } from 'devextreme-react/data-grid';

import DataGrid, {
  Column,
  HeaderFilter,
  Grouping,
  GroupPanel,
  Paging,
  Selection,
  SearchPanel,
  Scrolling,
  Summary,
  TotalItem,
  ColumnChooser,
  Item,
  Toolbar,
  Export,
} from "devextreme-react/data-grid";
import { getInitialName } from "CommonModules/helpers/GetIntialName.helper";
import { useDispatch, useSelector } from "react-redux";
import "./table.scss";
import { getTaskListItemBackgroundColor } from "CommonModules/helpers/tasks.helper";
import {
  fetchImpactDetailsByTaskId,
  fetchTaskDetailRequest,
} from "SharedComponents/Dashboard/redux/actions";
import CustomStore from "devextreme/data/custom_store";
import CheckTable from "./CheckTable";
import { IconButton } from "@mui/material";
import ImpactModal from "SharedComponents/Dashboard/TaskDetail/TaskDetailTabs/Impact";
// import { sales } from './data.js';

const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};
function isNotEmpty(value) {
  return value !== undefined && value !== null && value !== "";
}

const TeamPerformenceTbl = ({ TableData, currentAnalyticsKey, rowCount }) => {
  const dispatch = useDispatch();
  let tableRef = useRef();
  const currentOpenedTaskId = useSelector(
    (state) => state?.DashboardState?.taskDetailById?.id
  );
  const userEmail = useSelector((state) => state.auth.loginInfo.email);
  const userName = useSelector((state) => state.auth.loginInfo.UserName);
  const userType = useSelector((state) => state.auth.loginInfo.UserType);

  const [checkBoxesMode, setcheckBoxesMode] = useState("onClick");
  const [allMode, setallMode] = useState("allPages");

  // const [handleDataSource,setHandleDataSource] = useState([]);

  // https://dev.compliancesutra.com/api/method/compliance.compliance.apis.task.task?key=all&filter=All&search=&offset=0&limit=10000

  const HandleRow = (e) => {
    let assignTo = e?.data?.assignTo;
    if (e.rowType == "header") {
      e.rowElement.style.fontSize = "14px";
    }

    if (e.rowType == "data") {
      e.rowElement.style.backgroundColor = getTaskListItemBackgroundColor(
        userEmail,
        assignTo
      );
      e.rowElement.style.cursor = "pointer";
    }
  };

  const RenderData = (data) => {
    return (
      <>
        <div className="">
          <p className={styles.tr_text}>
            {moment(data?.value).format("DD MMM YYYY")}
          </p>
        </div>
      </>
    );
  };

  const RenderAsignTo = (data) => {
    return (
      <>
        <div className="cursor-pointer d-none d-md-flex">
          {data?.data?.status !== "Not Assigned" && data?.value ? (
            <>
              <div className="initial-name__container mr-2">
                <span className={`initial-name ${styles.tr_text}`}>
                  {getInitialName(data?.value)}
                </span>
              </div>
              <p title={data?.value} className={`mb-0 ${styles.tr_text}`}>
                {data?.value.length > 12
                  ? data?.value.slice(0, 12) + "..."
                  : data?.value}
              </p>
            </>
          ) : (
            <>
              <div className="initial-name__container">
                <img
                  src={assignIconRound}
                  alt="assign"
                  style={{ width: "18px", height: "18px" }}
                />
              </div>
              <p
                className={`mb-0 ${styles.tr_text} `}
                // style={{fontSize:'14px'}}
              >
                {" "}
                &nbsp; Assign
              </p>
            </>
          )}
        </div>
      </>
    );

    /* 
    return (<div className='d-flex gap-2'>
              <div className="initial-name__container mr-2">
                <span className="initial-name">
                  {getInitialName(data?.value)}
                </span>
              </div>

              <p
                title={data?.value}
                className={`mb-0`}
                style={{fontSize:'14px'}}
              >
                {data?.value}
              </p>
    </div>) */
  };

  const RenderTask = (e) => {
    return (
      <>
        <div className="">
          <p
            className={styles.tr_text}
            style={{ fontWeight: " 500", color: "rgb(108, 93, 211)" }}
          >
            {e?.value}
          </p>
        </div>
      </>
    );
  };
  const RenderTaskStatus = (e) => {
    return (
      <>
        <div className="">
          <p
            className={styles.tr_text}
            style={{ fontWeight: " 500", color: "rgb(108, 93, 211)" }}
          >
            {e?.value === "Assigned" ? "Task Assigned" : e?.value}
          </p>
        </div>
      </>
    );
  };

  const HanleClick = (e) => {
    if (e?.data?.taskId) {
      dispatch(fetchTaskDetailRequest(e?.data?.taskId));
    }
  };

  const RenderTaskName = (e) => {
    return (
      <>
        <div className="">
          <p className={styles.tr_text}>
            {e?.value.length > 30 ? e?.value.slice(0, 30) + "..." : e?.value}
          </p>
        </div>
      </>
    );
  };

  const RenderImpect = (ev) => {
    return ev.value ? (
      <IconButton
        size="small"
        title="Impact"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(
            fetchImpactDetailsByTaskId({
              task_name: ev.data.taskId,
              isShow: true,
              data: null,
              isLoading: true,
            })
          );
        }}
        style={{ marginTop: "-0.5rem" }}
      >
        <MdInfo style={{ color: "#7a73ff" }} />
      </IconButton>
    ) : (
      ""
    );
  };

  const RenderImpect2 = (ev) => {
    return ev.data.impactFlag ? (
      <IconButton
        size="small"
        title="Impact"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(
            fetchImpactDetailsByTaskId({
              task_name: ev.data.taskId,
              isShow: true,
              data: null,
              isLoading: true,
            })
          );
        }}
        style={{ marginTop: "-0.5rem" }}
      >
        <MdInfo style={{ color: "#7a73ff" }} />
      </IconButton>
    ) : (
      ""
    );
  };

  const onScroll = (event) => {
    if (tableRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        // TO SOMETHING HERE
        console.log("Reached bottom");
      }
    }
  };

  useEffect(() => {}, [currentAnalyticsKey]);

  const [showClearBtn, setShowClearBtn] = useState(false);
  useEffect(() => {
    if (tableRef?.instance?.clearFilter?.length > 0) {
      setShowClearBtn(true);
    } else {
      setShowClearBtn(false);
    }
  }, [tableRef]);

  const clearFilter = () => {
    const dataGrid = tableRef.instance;
    dataGrid.clearFilter();
  };

  const options = [
    { value: "Assign To", label: "Assign To" },
    { value: "Approver", label: "Approver" },
    { value: "cc", label: "CC" },
    { value: "comment", label: "Comment" },
    { value: "Mark_complete", label: "Mark Complete" },
    { value: "Upload_file", label: "Upload File" },
    { value: "Bulk_approve?", label: "Bulk Approve?" },
  ];
  const customStyles = {
    menu: (provided) => ({
      ...provided,
      width: 200,
      color: "black",
    }),
    menuList: (provided) => ({
      ...provided,
      backgroundColor: "white",
      color: "black",
    }),

    container: (provided) => ({
      ...provided,
      width: 200,
      margin: "-8px 8px",
    }),
    dropdownIndicator: () => ({
      color: "black",
      paddingRight: 4,
    }),

    singleValueLabel: () => ({
      backgroundColor: "white",
      padding: 2,
      margin: 2,
      borderRadius: 8,
    }),
    singleValue: () => ({
      border: "none",
      color: "black",
      fontSize: "85%",
      display: "flex",
    }),
    indicatorSeparator: () => ({
      backgroundColor: "#f7f4fe",
    }),
    control: () => ({
      backgroundColor: "#e4e4e4",
      display: "flex",
      borderRadius: 7,
    }),
  };
  const SelectedFilter = (e) => {
    console.log("Selected Filter : ", e?.value);
  };

  const checkFilter = (e) => {
    console.log("working here");
    console.log(tableRef.instance);
    console.log(e);
  };
  // console.log('here we are :',tableRef.instance)
  return (
    <div id="dashboard-task-table-GP1001">
      {console.log("Here we are : ", TableData, rowCount)}
      <DataGrid
        dataSource={TableData}
        noDataText={"No Task Found"}
        // ref={tableRef}
        ref={(ref) => {
          tableRef = ref;
        }}
        showBorders={true}
        // columnAutoWidth={true}
        wordWrapEnabled={true}
        showColumnLines={true}
        // allowColumnResizing={true}
        height={`${rowCount > 6 ? "460px" : "100%"}`}
        onRowPrepared={HandleRow}
        onRowClick={HanleClick}
        allowColumnReordering={true}
        allowColumnResizing={false}
        columnAutoWidth={false}
        remoteOperations={true}
        onExporting={(e) => exportGrid(e, "Custom Templates")}
        export={{
          allowExportSelectedData: true,
          enabled: true,
          texts: {
            exportAll: "Export all data",
            exportSelectedRows: "Export selected rows",
            exportTo: "Export",
          },
        }}
      >
        <Paging defaultPageSize={10} />

        <Scrolling mode="infinite" rowRenderingMode="virtual" />
        <Selection
          mode="multiple"
          selectAllMode={allMode}
          showCheckBoxesMode={checkBoxesMode}
        />
        <ColumnChooser enabled={true} mode="select" />
        {/* <SearchPanel visible={true} /> */}
        {/* <Grouping autoExpandAll={true} /> */}
        {/* <Paging defaultPageSize={10} />  width={'20%'} */}

        <Column
          dataField="subject"
          caption="Task Name"
          dataType="string"
          cellRender={RenderTaskName}
        />

        <Column
          dataField="customerName"
          caption="Company Name"
          dataType="string"
          visible={false}
        />
        <Column
          dataField="status"
          width={"120px"}
          caption="Status"
          dataType="string"
          cellRender={RenderTaskStatus}
          visible={false}
        />
        <Column
          dataField="licenseDisplay"
          width={"90px"}
          caption="License"
          dataType="string"
          cellRender={RenderTask}
        />
        <Column
          dataField="assignedToName"
          caption="Assigned To"
          dataType="string"
          cellRender={RenderAsignTo}
        />
        <Column
          dataField="frequency"
          width={"120px"}
          caption="Frequency"
          dataType="string"
          visible={false}
        />
        <Column
          dataField="dueDate"
          caption="Internal Deadline"
          dataType="string"
          cellRender={RenderData}
        />

        <Column
          width={"60px"}
          dataField="impactFlag"
          caption="Impact"
          dataType="string"
          cellRender={RenderImpect}
          allowFiltering={false}
        />
        {/* impactFlag */}

        {/* <Scrolling mode="infinite" /> */}
        {/* <Column dataField="customerName" caption="Customer Name" dataType="string" /> */}
      </DataGrid>
    </div>
  );
};

export default TeamPerformenceTbl;
