import React, { useCallback, useEffect, useRef, useState } from "react";
import moment from "moment";

import PivotGrid, { FieldChooser } from "devextreme-react/pivot-grid";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import assignIconRound from "../../../../../../../../assets/Icons/assignIconCircle.png";
import { createStore } from "devextreme-aspnet-data-nojquery";
import { MdInfo } from "react-icons/md";
import Dropdown from "react-dropdown";
import styles from "./style.module.scss";
import { exportGrid } from "Components/Audit/constants/CommonFunction";
import api from "../../../../../../../../apiServices/index";
import { actions as taskReportActions } from "Components/OnBoarding/SubModules/DashBoardCO/redux/actions.js";

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
import { IconButton } from "@mui/material";
import ImpactModal from "SharedComponents/Dashboard/TaskDetail/TaskDetailTabs/Impact";
import { toast } from "react-toastify";
import ReAssignTasksModal from "Components/ReAssignTasks";
import BulkReAssignTasksModal from "./BulkActions/BulkReAssignTasksModal";
import BulkReAssignTasksToUserModal from "./BulkActions/BulkReAssignTasksToUserModal";
import AddBulkComment from "./BulkActions/AddBulkComment";
import BulkUploadFile from "./BulkActions/BulkUploadFiles";
import ConfirmModal from "./BulkActions/ConfirmModal";
import { remoteOperations } from "Components/Audit/constants/datagrid.config";
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

const AnalyticsTbl = ({
  TableData,
  currentAnalyticsKey,
  rowCount,
  reCallfetchTaskList,
  setDefaultVisibleColumns,
  defaultVisibleColumns,
}) => {
  const dispatch = useDispatch();
  let tableRef = useRef();
  const state = useSelector((state) => state);
  const userEmail = useSelector((state) => state.auth.loginInfo.email);
  const userName = useSelector((state) => state.auth.loginInfo.UserName);
  const userType = useSelector((state) => state.auth.loginInfo.UserType);
  const userDetails = state && state.auth && state.auth.loginInfo;
  const selectedMenu = state && state.adminMenu && state.adminMenu.currentMenu;

  const [checkBoxesMode, setcheckBoxesMode] = useState("onClick");
  const [allMode, setallMode] = useState("allPages");
  const [rowData, setRowData] = useState([]);

  const [openAsignModal, setOpenAsignModal] = useState(false);
  const [taskAsignUserModal, setTaskAsignUserModal] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [openFileModal, setOpenFileModal] = useState(false);
  const [tab, setTab] = useState("");
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

  const [showClearBtn, setShowClearBtn] = useState(false);
  const [options, setOptions] = useState([]);
  // Fetch Team Members
  const [AsingUserList, setAsignUserList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [comment, setComment] = useState("");

  let disableList = ["ccTask", "rejectedTask", "completedTask"];

  const checkBulkFn = () => {
    let sendArr = [
      { value: "Assign To", label: "Assign To" },
      { value: "Add Approver", label: "Add Approver" },
      { value: "cc", label: "CC" },
      { value: "comment", label: "Comment" },
      { value: "Mark_complete", label: "Mark Complete" },
      { value: "Upload_file", label: "Upload File" },
    ];
    if (currentAnalyticsKey.filter === "approvalPending") {
      // console.log('here we are : ',currentAnalyticsKey.key);
      if (
        currentAnalyticsKey.key === "assignedToMe" ||
        currentAnalyticsKey.key === "assignedToOthers"
      ) {
        return [
          { value: "APPROVE", label: "Approve" },
          { value: "REJECT", label: "Reject" },
          { value: "Upload_file", label: "Upload File" },
          { value: "comment", label: "Comment" },
        ];
      }
      return [];
    } else {
      if (disableList.includes(currentAnalyticsKey.filter)) {
        return [];
      }
      return sendArr;
    }
  };

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
              <p title={data?.value} className={`mb-0 ${styles.tr_text}`}>
                {data?.value.length > 12
                  ? data?.value.slice(0, 12) + "..."
                  : data?.value}
              </p>
            </>
          ) : (
            <>
              <p className={`mb-0 ${styles.tr_text} `}> Assign</p>
            </>
          )}
        </div>
      </>
    );
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
        <div className="class-name">
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
    console.log("Here we are : ", e);
    if (e?.data?.taskId) {
      dispatch(fetchTaskDetailRequest(e?.data?.taskId));
    }
  };

  const RenderTaskName = (e) => {
    if (e?.value) {
      return (
        <>
          <div className="class-name">
            {/* <p className={styles.tr_text} title={e?.value} >{(e?.value.length > 30)?e?.value.slice(0,30)+"...":e?.value}</p> */}
            <p className={styles.tr_text} title={e?.value}>
              {e?.value}
            </p>
            {/* <span className="dots" >...</span> */}
          </div>
        </>
      );
    } else {
      return "";
    }
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
    console.log("Select Filter: ", e.value);
    setTab(e.value);
    switch (e?.value) {
      case "Upload_file":
        setOpenFileModal(true);
        break;
      case "comment":
        setOpenCommentModal(true);
        break;
      case "Mark_complete":
        setOpenConfirmModal(true);
        break;
      case "APPROVE":
        setOpenConfirmModal(true);
        break;
      case "REJECT":
        setOpenConfirmModal(true);
        break;
      case "Assign To":
        setOpenAsignModal(true);
        break;
      case "Add Approver":
        setOpenAsignModal(true);
        break;
      case "cc":
        setOpenAsignModal(true);
        break;
    }
  };

  const getRegisteredUserList = async () => {
    let result = await api.get("compliance.api.getUserList", {
      params: { isFromAssignPage: true },
    });
    if (result?.data?.message) {
      setAsignUserList(result?.data?.message);
    }
  };

  useEffect(() => {
    let checkAction = checkBulkFn();
    setOptions(checkAction);
    getRegisteredUserList();
  }, []);

  const renderCompanyName = (e) => {
    return (
      <div className="class-name">
        <p className={styles.tr_text}>{e?.value}</p>
      </div>
    );
  };

  const renderFreqency = (e) => {
    return (
      <div className="class-name">
        <p className={styles.tr_text}>{e?.value}</p>
      </div>
    );
  };
  const handleConfirmAction = async (response, uEmail = "") => {
    // console.log("response",response,tab);
    // return '';

    setOpenConfirmModal(false);
    setOpenAsignModal(false);
    setOpenCommentModal(false);

    if (response === "confirm") {
      if (selectedList.length === 0) {
        toast.error("Please select any task");
        return false;
      }

      if (selectedList.length > 10) {
        toast.error("Cannot select more then 10 Task.");
        return false;
      }

      if (tab === "Mark_complete") {
        await markCompleted();
      }

      if (tab === "cc") {
        await AsignCC(uEmail);
      }

      if (tab === "Assign To") {
        await AsignAsignee(uEmail);
      }

      if (tab === "Add Approver") {
        await AsignApprover(uEmail);
      }

      if (tab === "APPROVE") {
        await ApproveRejectask("Approved");
      }

      if (tab === "REJECT") {
        await ApproveRejectask("Rejected");
      }

      if (tab === "comment") {
        await SaveBulkComment();
      }

      reCallfetchTaskList();
    }
  };

  const handleOptionChange = (e) => {
    if (e.fullName === "selectedRowKeys") {
      setSelectedList(e.value);
    }
  };

  const AsignCC = async (uEmail) => {
    let TaskIDlist = [];
    for (let index = 0; index < selectedList.length; index++) {
      const element = selectedList[index];
      TaskIDlist.push(element.taskId);
    }
    dispatch(
      taskReportActions.changeBulkTaskAsignRequest({
        task_details: [
          {
            name: TaskIDlist,
            cc: uEmail,
            assigned_by: userDetails.email,
          },
        ],
      })
    );
  };

  const AsignAsignee = async (uEmail) => {
    let TaskIDlist = [];
    for (let index = 0; index < selectedList.length; index++) {
      const element = selectedList[index];
      TaskIDlist.push(element.taskId);
    }
    dispatch(
      taskReportActions.changeBulkTaskAsignRequest({
        task_details: [
          {
            name: TaskIDlist,
            assign_to: uEmail,
            assigned_by: userDetails.email,
            approver: "",
          },
        ],
      })
    );
  };

  const AsignApprover = async (uEmail) => {
    let TaskIDlist = [];
    for (let index = 0; index < selectedList.length; index++) {
      const element = selectedList[index];
      TaskIDlist.push(element.taskId);
    }
    dispatch(
      taskReportActions.changeBulkTaskAsignRequest({
        task_details: [
          {
            name: TaskIDlist,
            assign_to: "",
            assigned_by: userDetails.email,
            approver: uEmail,
          },
        ],
      })
    );

    // let assignEmail = uEmail;
    // console.log('jere we ',uEmail)
    // // let id = getTaskById.TaskId;

    // for (let index = 0; index < selectedList.length; index++) {
    //   const element = selectedList[index];
    //   let userKey = 'assignTo';
    //   let id = element.TaskId;
    //   dispatch(
    //     taskReportActions.taskAssignByTaskID({
    //       taskID: id,
    //       email: assignEmail,
    //       userType: 4,
    //       // invitee: user.EmailID,
    //       isApproved: 0,
    //       userDetails: userDetails,
    //       loginID: userDetails.UserID,
    //     })
    //   );
    // }
  };
  const markCompleted = async () => {
    for (let index = 0; index < selectedList.length; index++) {
      const element = selectedList[index];
      dispatch(
        taskReportActions.changeBulkTaskStatusRequest({
          task_name: element.taskId,
          ...((
            element.customerName === "Internal Task"
              ? userDetails.email === element.approver ||
                userDetails.email === element.taskOwner
              : userDetails.UserType === 3 ||
                userDetails.email === element.approver
          )
            ? { status: "Approved" }
            : { status: "Approval Pending" }),
        })
      );
    }
  };

  const ApproveRejectask = async (status) => {
    for (let index = 0; index < selectedList.length; index++) {
      const element = selectedList[index];
      dispatch(
        taskReportActions.changeBulkTaskStatusRequest({
          task_name: element.taskId,
          status: status,
        })
      );
    }
  };

  const SaveBulkComment = async () => {
    let TaskIDlist = "";
    for (let index = 0; index < selectedList.length; index++) {
      const element = selectedList[index];
      TaskIDlist += element.taskId + ",";
    }
    TaskIDlist = TaskIDlist.slice(0, -1);
    dispatch(
      taskReportActions.postBulkTaskCommentByTaskID({
        task_name: TaskIDlist,
        content: comment,
      })
    );
  };

  const handleColumnChange = (e) => {
    if (e.name === "columns") {
      let vCol = [...defaultVisibleColumns];
      let foundIndex = defaultVisibleColumns.findIndex(
        (x) => x.col == e.fullName
      );
      if (foundIndex !== -1) {
        vCol[foundIndex].is_visible = e.value;
        setDefaultVisibleColumns(vCol);
        tableRef?.current?.instance?.showColumnChooser();
      }
    }
  };

  return (
    <div id="dashboard-task-table-GP1001">
      <DataGrid
        dataSource={TableData}
        noDataText={"No Task Found"}
        // ref={(ref) => { tableRef = ref; }}
        ref={tableRef}
        height={`${(rowCount || TableData?.length) > 6 ? "480px" : "auto"}`}
        onRowPrepared={HandleRow}
        onRowClick={HanleClick}
        // onColumnsChange={handleColumnChange}
        // onOptionChanged
        onOptionChanged={handleColumnChange}
        selectedRowKeys={selectedList}
        scrolling={{
          columnRenderingMode: "standard",
          mode: "standard",
          preloadEnabled: false,
          renderAsync: undefined,
          rowRenderingMode: "virtual",
          scrollByContent: true,
          scrollByThumb: true,
          showScrollbar: "onHover",
          useNative: "auto",
        }}
        // onFilterValueChange={checkFilter}
        // onFilterPanelChange={checkFilter}
        // onSelectionFilterChange={checkFilter}
        allowColumnReordering={false}
        // allowColumnResizing={false}
        remoteOperations={remoteOperations}
        // columnWidth={200}
        wordWrapEnabled={true}
        // columnMinWidth={200}
        columnAutoWidth={false}
        showBorders={true}
        showColumnLines={true}
        width={"100%"}
        paging={false}
        onExporting={(e) => {
          if (
            e.component.getSelectedRowKeys().length === 0 &&
            e.component.getController("export")._selectionOnly
          ) {
            toast.error("Please select rows");
            e.cancel = true;
            return;
          }
          exportGrid(e, "Custom Templates");
        }}
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
        <Toolbar>
          <Item location="after">
            <button className="btn btn-link clear-filter" onClick={clearFilter}>
              Reset
            </button>
          </Item>
          <Item location="after">
            <Dropdown
              options={options}
              styles={customStyles}
              defaultValue={options[0]}
              value={options.value}
              onChange={SelectedFilter}
              className={`d-none d-md-block drop-table ${
                options.length > 0 ? "show" : "hide"
              } `}
              arrowClassName={styles.dropdownArrow}
              placeholder="Bulk actions"
              controlClassName={styles.dropdownControl}
              menuClassName={styles.dropdownMenu}
            />
          </Item>

          <Item
            name="columnChooserButton"
            locateInMenu="auto"
            location="after"
          />
          <Item name="exportButton" />
          <Item name="searchPanel" />
          <Item name="groupPanel" location="before" />
        </Toolbar>
        <HeaderFilter visible={true} filter allowSearch={true} />
        {/* <Scrolling
                useNative={false}         
                scrollByContent={true}         
                scrollByThumb={true}         
                showScrollbar="onHover" 
              /> */}
        <GroupPanel visible={true} />
        <Paging defaultPageSize={10} />

        <Scrolling mode="infinite" rowRenderingMode="virtual" />
        <Selection
          mode="multiple"
          selectAllMode={allMode}
          showCheckBoxesMode={checkBoxesMode}
        />
        <ColumnChooser
          enabled={true}
          mode="select"

          // onSelectionChanged={handleColumnChange}
          // onClick={handleColumnChange}
          // onColumnsChange={(e)=>console.log(e)}
          // onColumnsChange=
        />
        {/* <SearchPanel visible={true} /> */}
        {/* <Grouping autoExpandAll={true} /> */}
        {/* <Paging defaultPageSize={10} />   */}
        {/* width={'20%'} */}
        {/* defaultVisibleColumns.includes('subject') */}
        <Column
          dataField="subject"
          caption="Task Name"
          dataType="string"
          cellRender={RenderTaskName}
          minWidth={200}
          visible={
            defaultVisibleColumns.find((e) => e.title === "subject").is_visible
          }
        />

        <Column
          dataField="customerName"
          width={"160px"}
          caption="Company Name"
          dataType="string"
          visible={
            defaultVisibleColumns.find((e) => e.title === "customerName")
              .is_visible
          }
          cellRender={renderCompanyName}
        />
        <Column
          dataField="status"
          width={"120px"}
          caption="Status"
          dataType="string"
          cellRender={RenderTaskStatus}
          visible={
            defaultVisibleColumns.find((e) => e.title === "status").is_visible
          }
        />
        {/* This is testing from gautam to Check the company name dynamic withc */}
        <Column
          dataField="licenseDisplay"
          width={"90px"}
          caption="License"
          dataType="string"
          cellRender={RenderTask}
          visible={
            defaultVisibleColumns.find((e) => e.title === "licenseDisplay")
              .is_visible
          }
        />
        <Column
          dataField="assignedToName"
          width={"150px"}
          caption="Assigned To"
          dataType="string"
          cellRender={RenderAsignTo}
          visible={
            defaultVisibleColumns.find((e) => e.title === "assignedToName")
              .is_visible
          }
        />

        <Column
          dataField="frequency"
          width={"120px"}
          caption="Frequency"
          dataType="string"
          cellRender={renderFreqency}
          visible={
            defaultVisibleColumns.find((e) => e.title === "frequency")
              .is_visible
          }
        />

        <Column
          dataField="dueDate"
          width={"160px"}
          caption="Internal Deadline"
          dataType="string"
          cellRender={RenderData}
          visible={
            defaultVisibleColumns.find((e) => e.title === "dueDate").is_visible
          }
        />

        <Column
          width={"60px"}
          dataField="impactFlag"
          caption="Impact"
          dataType="string"
          cellRender={RenderImpect}
          allowFiltering={false}
          visible={
            defaultVisibleColumns.find((e) => e.title === "impactFlag")
              .is_visible
          }
        />
        {/* impactFlag */}

        {/* <Scrolling mode="infinite" /> */}
        {/* <Column dataField="customerName" caption="Customer Name" dataType="string" /> */}
      </DataGrid>

      <BulkReAssignTasksModal
        openModal={openAsignModal}
        setShowModal={setOpenAsignModal}
        memberList={AsingUserList}
        recallMemberList={getRegisteredUserList}
        tab={tab}
        userType={"assignTo"}
        isSingleTask={true} // true for 2nd step and false for no 2nd step
        isTeamMember={true}
        taskId={""}
        user={"cc"}
        company={""}
        inviteUser={""}
        handleDeleteMember={""}
        userId="anjalimahalle+859@trakiot.in"
        userKey="assignTo"
        setSelectedUser={setSelectedUser}
        handleAction={handleConfirmAction}
      />
      <AddBulkComment
        openModal={openCommentModal}
        closeModal={setOpenCommentModal}
        tab={tab}
        handleAction={handleConfirmAction}
        setComment={setComment}
        comment={comment}
      />

      <BulkUploadFile
        openModal={openFileModal}
        closeModal={setOpenFileModal}
        selectedList={selectedList}
      />
      <ConfirmModal
        openModal={openConfirmModal}
        closeModal={setOpenConfirmModal}
        handleAction={handleConfirmAction}
        tab={tab}
        title={tab}
      />

      {/* <BulkReAssignTasksToUserModal
           recallMemberList={getRegisteredUserList}
           openModal={taskAsignUserModal}
           setShowModal={setTaskAsignUserModal}
           userId={''}
           memberList={AsingUserList}
           user={'CC'}
           deactivateUser={''}
           userType={'assign_to'}
           userKey="cc"
           isSingleTask={false}
        /> */}
    </div>
  );
};

export default AnalyticsTbl;
