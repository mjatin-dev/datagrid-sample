/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useEffect, useRef, useState } from "react";
import moment from "moment";
import { MdInfo } from "react-icons/md";
import styles from "./style.module.scss";
import { exportAllGrid } from "Components/Audit/constants/CommonFunction";
import api from "../../../../../../../../apiServices/index";
import LoaderGIF from "../../../../../../../../assets/Images/loader-gif.gif";
import CustomColumnChooser from "./CustomColumnChooser";
import { actions as taskReportActions } from "Components/OnBoarding/SubModules/DashBoardCO/redux/actions.js";
import DataGrid, {
  Column,
  HeaderFilter,
  LoadPanel,
  Paging,
  Selection,
  Scrolling,
  Item,
  Toolbar,
  ColumnChooser,
} from "devextreme-react/data-grid";
import { useDispatch, useSelector } from "react-redux";
import "./table.scss";
import {
  bulkMarkCompleteValidate,
  CheckBulkApprovalPending,
  CheckWorkPermission,
  getTaskListItemBackgroundColor,
} from "CommonModules/helpers/tasks.helper";
import {
  fetchImpactDetailsByTaskId,
  fetchTaskDetailRequest,
} from "SharedComponents/Dashboard/redux/actions";
import { IconButton } from "@mui/material";
import { toast } from "react-toastify";
import BulkReAssignTasksModal from "./BulkActions/BulkReAssignTasksModal";
import AddBulkComment from "./BulkActions/AddBulkComment";
import BulkUploadFile from "./BulkActions/BulkUploadFiles";
import ConfirmModal from "./BulkActions/ConfirmModal";

import BackDrop from "CommonModules/sharedComponents/Loader/BackDrop";
import { SelectBox } from "devextreme-react";
import { checkIsInternalTask } from "CommonModules/helpers/string.helpers";

const CheckTable = ({
  TableData,
  currentAnalyticsKey,
  rowCount,
  setDefaultVisibleColumns,
  defaultVisibleColumns,
  is_teamperformance = false,
}) => {
  const dispatch = useDispatch();
  const tableRef = useRef();
  const state = useSelector((state) => state);
  const userEmail = useSelector((state) => state.auth.loginInfo.email);
  const userDetails = state && state.auth && state.auth.loginInfo;
  const [visible, setVisible] = useState(false);

  const onHiding = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onApply = useCallback(
    (changes) => {
      setDefaultVisibleColumns(changes);
    },
    [setDefaultVisibleColumns]
  );

  let { activeLicenses } = useSelector(
    (state) => state?.DashboardState?.taskDetailById
  );
  const { loader } = state.taskReport;

  const [openAsignModal, setOpenAsignModal] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [openFileModal, setOpenFileModal] = useState(false);
  const [tab, setTab] = useState("");
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [options, setOptions] = useState([]);
  // Fetch Team Members
  const [AsingUserList, setAsignUserList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [comment, setComment] = useState("");

  let disableList = ["ccTask", "rejectedTask", "completedTask"];

  const HandleRow = (e, uEmail) => {
    let assignTo = e?.data?.assignTo;
    if (e?.rowType === "header") {
      e.rowElement.style.fontSize = "14px";
    }

    if (e?.rowType === "data") {
      e.rowElement.style.backgroundColor = getTaskListItemBackgroundColor(
        uEmail,
        assignTo
      );
      e.rowElement.style.cursor = "pointer";
    }
  };

  const checkBulkFn = () => {
    let sendArr = [
      "Assign To",
      "Add Approver",
      "Add CC",
      "Comment",
      "Mark Complete",
      "Upload File",
    ];

    let type2Arr = [
      "Assign To",
      "Add Approver",
      "Approve",
      "Add CC",
      "Reject",
      "Comment",
      "Upload File",
    ];
    const onlyComment = ["Comment"];
    if (is_teamperformance) {
      return sendArr;
    }
    if (currentAnalyticsKey.key === "CC") {
      if (currentAnalyticsKey.filter === "completedTask") {
        return [];
      } else {
        return onlyComment;
      }
    } else if (currentAnalyticsKey.filter === "approvalPending") {
      return type2Arr;
    } else if (currentAnalyticsKey.filter === "rejectedTask") {
      return sendArr;
    } else {
      if (disableList.includes(currentAnalyticsKey.filter)) {
        return [];
      }
      return sendArr;
    }
  };

  const GetSelectedTask = () => {
    let intanceData = tableRef.current?.instance;
    return {
      rowKeys: intanceData?.getSelectedRowKeys() || [],
      rowData: intanceData?.getSelectedRowsData() || [],
    };
  };
  const RenderData = (data) => {
    return (
      <>
        <div className="" onClick={() => HandleClick(data)}>
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
        <div
          className="cursor-pointer d-none d-md-flex"
          onClick={() => HandleClick(data)}
        >
          {data?.data?.status !== "Not Assigned" && data?.value ? (
            <>
              <p title={data?.value} className={`mb-0 ${styles.tr_text}`}>
                {data?.value?.length > 12
                  ? data?.value.slice(0, 12) + "..."
                  : data?.value}
              </p>
            </>
          ) : (
            <>
              <p
                className={`mb-0 ${styles.tr_text} `}
                onClick={() => HandleClick(data)}
              >
                {" "}
                Assign
              </p>
            </>
          )}
        </div>
      </>
    );
  };

  const RenderRiskRating = (data) => {
    const st = { fontWeight: 700 };
    if (!data.value) {
      return (
        <span
          onClick={() => HandleClick(data)}
          style={{ ...st, color: "green" }}
        >
          Low
        </span>
      );
    }
    if (data?.value === "Low") {
      return (
        <span
          onClick={() => HandleClick(data)}
          style={{ ...st, color: "green" }}
        >
          {data?.value}
        </span>
      );
    }

    if (data?.value === "Medium") {
      return (
        <span
          onClick={() => HandleClick(data)}
          style={{ ...st, color: "orange" }}
        >
          {data?.value}
        </span>
      );
    }

    if (data?.value === "High") {
      return (
        <span onClick={() => HandleClick(data)} style={{ ...st, color: "red" }}>
          {data?.value}
        </span>
      );
    }
  };

  const RenderTask = (e) => {
    return (
      <>
        <div className="" onClick={() => HandleClick(e)}>
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
        <div className="class-name" onClick={() => HandleClick(e)}>
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

  const HandleClick = (e) => {
    if (e?.data?.taskId) {
      dispatch(fetchTaskDetailRequest(e?.data?.taskId));
    }
  };

  const RenderTaskName = (e) => {
    if (e?.value) {
      return (
        <>
          <div className="class-name" onClick={() => HandleClick(e)}>
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

  const clearFilter = useCallback(() => {
    const dataGrid = tableRef.current.instance;
    let vCol = [...defaultVisibleColumns];
    let DVCArr = vCol.map((itm) => ({ ...itm, filter_value: [] }));
    setDefaultVisibleColumns(DVCArr);
    dataGrid.clearSelection();
    dataGrid.clearFilter();
  }, [tableRef, setDefaultVisibleColumns, defaultVisibleColumns]);

  const onToolbarPreparing = useCallback(
    (e) => {
      const hasFilters = Boolean(e.component?.getCombinedFilter());
      e.toolbarOptions.items.push({
        widget: "dxButton",
        location: "after",
        visible: true,
        options: {
          icon: "columnchooser",
          hint: "Column Chooser",
          elementAttr: {
            id: "myColumnChooser",
          },
          onClick: () => setVisible(true),
        },
      });
      e.toolbarOptions.items.push({
        widget: "dxButton",
        location: "after",
        visible: hasFilters,
        options: {
          text: "Reset Filters",
          hint: "Reset Filters",
          elementAttr: {
            id: "resetFiltersButton",
          },
          onClick: () => clearFilter(),
        },
      });
    },
    [setVisible, clearFilter]
  );
  const resetSelectCol = () => {};

  const SelectedFilter = (e) => {
    let SelectedData = GetSelectedTask();
    setSelectedList(SelectedData.rowData);
    if (SelectedData?.rowData?.length === 0) {
      toast.error("Please select any task");
      return false;
    }
    if (e?.value !== "Upload File" && SelectedData.rowData.length > 100) {
      toast.error("Cannot select more then 100 Task.");
      return false;
    }

    if (e?.value === "Upload File" && SelectedData?.rowData?.length > 25) {
      toast.error("Cannot select more then 25 Task for file uploading.");
      return false;
    }
    setTab(e.value);
    switch (e?.value) {
      case "Upload File":
        setOpenFileModal(true);
        break;
      case "Comment":
        setOpenCommentModal(true);
        break;
      case "Mark Complete":
        setOpenConfirmModal(true);
        break;
      case "Approve":
        setOpenConfirmModal(true);
        break;
      case "Reject":
        setOpenConfirmModal(true);
        break;
      case "Assign To":
        setOpenAsignModal(true);
        break;
      case "Add Approver":
        setOpenAsignModal(true);
        break;
      case "Add CC":
        setOpenAsignModal(true);
        break;
      default:
        return;
    }
  };

  const getRegisteredUserList = async () => {
    let result = await api.get("compliance.api.getUserList", {
      params: { isFromAssignPage: true },
    });
    if (result?.data?.message) {
      setAsignUserList(result?.data?.message);
      let DFCol = result?.data?.message.find(
        (item) => item.email === userDetails.email
      );
      if (DFCol?.data_for_default_column) {
        let vCOl = [...defaultVisibleColumns];
        DFCol?.data_for_default_column.map((item, i) => {
          let FindIndex = vCOl.findIndex((it) => it?.title === item?.title);
          if (FindIndex !== -1) {
            vCOl[FindIndex].is_visible = item?.is_visible;
          }
        });
        setDefaultVisibleColumns(vCOl);
      }
    }
  };

  const SaveDefaultColview = async () => {
    let sendObj = defaultVisibleColumns.map((item) => {
      let obj = {
        is_visible: item.is_visible,
        column_index: item.col,
        title: item.title,
      };
      return obj;
    });
    let result = await api.post(
      "compliance.api.CreateUserDefaultORColumnRecords",
      {
        data: sendObj,
      }
    );

    if (result?.data?.message?.status) {
      toast.success("Saved Successfully");
    } else {
      toast.error("Something went Wrong Please Try Again");
    }
  };
  const renderCompanyName = (e) => {
    return (
      <div className="class-name" onClick={() => HandleClick(e)}>
        <p className={styles.tr_text}>{e?.value}</p>
      </div>
    );
  };

  const renderFreqency = (e) => {
    return (
      <div className="class-name" onClick={() => HandleClick(e)}>
        <p className={styles.tr_text}>{e?.value}</p>
      </div>
    );
  };
  const handleConfirmAction = async (response, uEmail = "") => {
    setOpenConfirmModal(false);
    setOpenAsignModal(false);
    setOpenCommentModal(false);

    if (response === "confirm") {
      if (tab === "Mark Complete") {
        await markCompleted();
      }

      if (tab === "Add CC") {
        await AsignCC(uEmail);
      }

      if (tab === "Assign To") {
        await AsignAsignee(uEmail);
      }

      if (tab === "Add Approver") {
        await AsignApprover(uEmail);
      }

      if (tab === "Approve") {
        await ApproveRejectask("Approved");
      }

      if (tab === "Reject") {
        await ApproveRejectask("Rejected");
      }

      if (tab === "Comment") {
        await SaveBulkComment();
        setComment("");
      }
    } else if (response === "cancel") {
      if (tab === "Comment") {
        setComment("");
      }
    }
  };

  const AsignCC = async (assign_user) => {
    let uEmail = assign_user?.email || assign_user;
    let TaskIDlist = [];
    //  check if user invited;
    // activeLicenses, UserDetails
    for (let index = 0; index < selectedList?.length; index++) {
      const element = selectedList[index];
      let Permission = CheckWorkPermission(
        activeLicenses,
        element,
        userDetails,
        1,
        assign_user
      );
      if (Permission.editPermission) {
        TaskIDlist?.push(element.taskId);
      } else {
        toast.error(
          `Action cannot be performed on the task ${element.subject}`
        );
      }
    }

    if (TaskIDlist?.length > 0 && uEmail) {
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
    } else {
      // toast.error(`Something went wrong please try again.`);
    }
  };

  const AsignAsignee = async (assign_user) => {
    let uEmail = assign_user?.email || assign_user;
    let TaskIDlist = [];
    for (let index = 0; index < selectedList?.length; index++) {
      const element = selectedList[index];
      let Permission = CheckWorkPermission(
        activeLicenses,
        element,
        userDetails,
        3,
        uEmail
      );
      if (
        Permission.editPermission ||
        (element?.status !== "Approved" &&
          element.approver === userDetails.email)
      ) {
        TaskIDlist?.push(element.taskId);
      } else {
        toast.error(
          `Action cannot be performed on the task ${element.subject}`
        );
      }
    }
    // validate
    if (TaskIDlist?.length > 0) {
      dispatch(
        taskReportActions.changeBulkTaskAsignRequest({
          task_details: [
            {
              name: TaskIDlist,
              assign_to: uEmail,
              assigned_by: userDetails.email,
              // approver: "",
            },
          ],
        })
      );
    }
  };

  const AsignApprover = async (assign_user) => {
    let uEmail = assign_user?.email || assign_user;
    let TaskIDlist = [];
    for (let index = 0; index < selectedList?.length; index++) {
      const element = selectedList[index];
      let Permission = CheckWorkPermission(
        activeLicenses,
        element,
        userDetails,
        2,
        assign_user
      );
      if (Permission.editPermission) {
        TaskIDlist?.push(element.taskId);
      } else {
        toast.error(
          `Action cannot be performed on the task ${element.subject}`
        );
      }
    }
    if (TaskIDlist?.length > 0) {
      dispatch(
        taskReportActions.changeBulkTaskAsignRequest({
          task_details: [
            {
              name: TaskIDlist,
              // assign_to: "",
              assigned_by: userDetails.email,
              approver: uEmail,
            },
          ],
        })
      );
    }
  };
  const markCompleted = async () => {
    let TaskIDlist = [];

    for (let index = 0; index < selectedList?.length; index++) {
      const element = selectedList[index];
      let customer = element?.customer || element?.customerName;
      let fetchSubDate = [...(activeLicenses || [])].find(
        (it) => it.company_id === customer && it.license === element?.license
      );
      let isAbleToComplete = bulkMarkCompleteValidate(
        element,
        userDetails,
        fetchSubDate?.subscription_end_date
      );
      if (isAbleToComplete) {
        let obj = {
          task_id: element.taskId,
          ...((
            element.customerName === "Internal Task"
              ? userDetails.email === element.assignTo &&
                userDetails.email === element.taskOwner
                ? !element.approver
                  ? true
                  : userDetails.email === element.approver
                : userDetails.email === element.approver ||
                  userDetails.email === element.taskOwner
              : userDetails.UserType === 3 ||
                userDetails.email === element.approver
          )
            ? { status: "Approved" }
            : { status: "Approval Pending" }),
        };
        TaskIDlist?.push(obj);
      } else {
        // let obj =
        toast.error(
          `Action cannot be performed on the task ${element.subject}`
        );
      }
    }
    if (TaskIDlist?.length > 0) {
      let task_details = TaskIDlist;
      dispatch(
        taskReportActions.changeBulkTaskMarkCompleteRequest({ task_details })
      );
    }
  };

  const ApproveRejectask = async (status) => {
    let TaskIDlist = [];
    for (let index = 0; index < selectedList?.length; index++) {
      const element = selectedList[index];
      // let fetchSubDate = activeLicenses.find(
      //   (it) => it.company_id === element.customer
      // );
      let obj = {
        task_id: element.taskId,
        status,
      };
      // TaskIDlist.push(obj);
      let isAbleToComplete = CheckBulkApprovalPending(element, userDetails);
      if (isAbleToComplete) {
        TaskIDlist?.push(obj);
      } else {
        toast.error(
          `Action cannot be performed on the task ${element.subject}`
        );
      }
    }
    if (TaskIDlist?.length > 0) {
      let task_details = TaskIDlist;
      dispatch(
        taskReportActions.changeBulkTaskMarkCompleteRequest({ task_details })
      );
    }
  };

  const SaveBulkComment = async () => {
    let TaskIDlist = "";
    for (let index = 0; index < selectedList?.length; index++) {
      const element = selectedList[index];
      if (element.status !== "Approved") {
        TaskIDlist += element.taskId + ",";
      } else {
        toast.error(
          `Action cannot be performed on the task ${element.subject}`
        );
      }
    }
    if (TaskIDlist) {
      TaskIDlist = TaskIDlist.slice(0, -1);
      dispatch(
        taskReportActions.postBulkTaskCommentByTaskID({
          task_name: TaskIDlist,
          content: comment,
        })
      );
    }
  };

  const handleColumnChange = (e) => {
    let vCol = [...defaultVisibleColumns];
    let foundIndex = defaultVisibleColumns.findIndex((x) => {
      if (!e?.fullName) {
        return false;
      }
      let fnameIndx = e?.fullName?.match(/\d+/g)?.[0];
      let colIndx = x?.col?.match(/\d+/g)?.[0];
      return fnameIndx === colIndx;
    });
    if (foundIndex !== -1) {
      if (e.fullName?.split(".")?.pop() === "filterValues") {
        vCol[foundIndex].filter_value = e.value;
      }
      if (e.fullName?.split(".")?.pop() === "filterType") {
        vCol[foundIndex].filterType = e.value;
      }
      setDefaultVisibleColumns(vCol);
    }

    if (e?.name === "columns") {
      let vCol = [...defaultVisibleColumns];
      let foundIndex = defaultVisibleColumns.findIndex(
        (x) => x.col === e.fullName
      );
      if (foundIndex !== -1) {
        vCol[foundIndex].is_visible = e.value;
        setDefaultVisibleColumns(vCol);
        tableRef?.current?.instance?.showColumnChooser();
      }
    }
  };
  const handleDataChange = () => {
    tableRef?.current?.instance?.getScrollable()?.scrollTop(0);
    tableRef?.current?.instance?.refresh();
  };
  useEffect(() => {
    let checkAction = checkBulkFn();
    setOptions(checkAction);
    getRegisteredUserList();
    handleDataChange();
  }, [currentAnalyticsKey]);

  return (
    <div id="dashboard-task-table-GP1001" style={{ height: "100%" }}>
      <BackDrop isLoading={loader} />
      <DataGrid
        keyExpr={"taskId"}
        dataSource={TableData}
        remoteOperations={true}
        noDataText={"No Task Found"}
        ref={tableRef}
        height={`${rowCount < 8 ? "auto" : "100%"}`}
        onRowPrepared={(e) => HandleRow(e, userEmail)}
        onOptionChanged={handleColumnChange}
        allowColumnReordering={true}
        wordWrapEnabled={true}
        columnAutoWidth={false}
        showBorders={true}
        showColumnLines={true}
        width={"100%"}
        onDataChange={handleDataChange}
        columnChooser={{
          enabled: false,
        }}
        onExporting={(e) => {
          const selectionOnly =
            e.component.getController("export")._selectionOnly;
          if (
            e.component.getSelectedRowKeys()?.length === 0 &&
            e.component.getController("export")._selectionOnly
          ) {
            toast.error("Please select rows");
            e.cancel = true;
            return;
          }
          const ds = e.component.getDataSource();
          const loadOptions = ds.loadOptions();
          if (selectionOnly) {
            const rows = e.component.getSelectedRowsData();
            exportAllGrid(e, rows);
          } else {
            if (typeof ds?._store?._loadFunc === "function") {
              ds?._store?._loadFunc(loadOptions).then((value) => {
                const rows = value?.data || [];
                exportAllGrid(e, rows);
              });
            } else {
              e.cancel = true;
            }
          }
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
        onToolbarPreparing={onToolbarPreparing}
        loadPanel={{
          enabled: true,
          shading: true,
        }}
        sorting={{
          mode: "multiple",
        }}
      >
        <Toolbar>
          {/* <Item location="after">
            <button className="btn btn-link clear-filter" onClick={clearFilter}>
              Reset Filters
            </button>
          </Item> */}

          <Item name="resetFiltersButton" location="after" />
          <Item>
            <SelectBox
              items={options}
              placeholder="Bulk actions"
              onChange={SelectedFilter}
              onValueChanged={SelectedFilter}
              className={`drop-table ${options?.length > 0 ? "show" : "hide"} `}
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
        <ColumnChooser enabled={false} />
        <LoadPanel height={100} width={250} indicatorSrc={LoaderGIF} />
        {/* <StateStoring enabled={true} type="localStorage" storageKey="task_list_data" /> */}

        <Paging defaultPageSize={12} />
        {/* <Scrolling mode="infinite" /> */}
        <LoadPanel enabled={false} />
        <Scrolling mode="infinite" rowRenderingMode="virtual" />
        <Selection
          mode="multiple"
          selectAllMode="allPages"
          showCheckBoxesMode="onClick"
        />
        <Column
          dataField="subject"
          caption="Task Name"
          dataType="string"
          allowSorting={true}
          cellRender={RenderTaskName}
          minWidth={200}
          // visible={
          //   defaultVisibleColumns.find((e) => e.title === "subject")?.is_visible
          // }
          filterType={
            defaultVisibleColumns.find((e) => e.title === "subject").filterType
          }
          filterValues={
            defaultVisibleColumns.find((e) => e.title === "subject")
              .filter_value
          }
        />
        <Column
          dataField="customerName"
          width={"160px"}
          caption="Company Name"
          dataType="string"
          allowExporting={true}
          visible={
            defaultVisibleColumns.find((e) => e.title === "customerName")
              .is_visible
          }
          allowSorting={true}
          cellRender={renderCompanyName}
          filterValues={
            defaultVisibleColumns.find((e) => e.title === "customerName")
              .filter_value
          }
          filterType={
            defaultVisibleColumns.find((e) => e.title === "customerName")
              .filterType
          }
        />
        <Column
          dataField="status"
          width={"120px"}
          caption="Status"
          dataType="string"
          cellRender={RenderTaskStatus}
          allowSorting={true}
          visible={
            defaultVisibleColumns.find((e) => e.title === "status").is_visible
          }
          filterValues={
            defaultVisibleColumns.find((e) => e.title === "status").filter_value
          }
          filterType={
            defaultVisibleColumns.find((e) => e.title === "status").filterType
          }
        />
        {/* This is testing from gautam to Check the company name dynamic withc */}
        <Column
          dataField="licenseDisplay"
          width={"120px"}
          caption="License"
          dataType="string"
          allowSorting={true}
          cellRender={RenderTask}
          visible={
            defaultVisibleColumns.find((e) => e.title === "licenseDisplay")
              .is_visible
          }
          filterValues={
            defaultVisibleColumns.find((e) => e.title === "licenseDisplay")
              .filter_value
          }
          filterType={
            defaultVisibleColumns.find((e) => e.title === "licenseDisplay")
              .filterType
          }
        />
        <Column
          dataField="assignedToName"
          width={"150px"}
          caption="Assigned To"
          allowSorting={true}
          dataType="string"
          cellRender={RenderAsignTo}
          visible={
            defaultVisibleColumns.find((e) => e.title === "assignedToName")
              .is_visible
          }
          filterValues={
            defaultVisibleColumns.find((e) => e.title === "assignedToName")
              .filter_value
          }
          filterType={
            defaultVisibleColumns.find((e) => e.title === "assignedToName")
              .filterType
          }
        />

        <Column
          dataField="frequency"
          width={"120px"}
          caption="Frequency"
          dataType="string"
          allowSorting={true}
          cellRender={renderFreqency}
          visible={
            defaultVisibleColumns.find((e) => e.title === "frequency")
              .is_visible
          }
          filterValues={
            defaultVisibleColumns.find((e) => e.title === "frequency")
              .filter_value
          }
          filterType={
            defaultVisibleColumns.find((e) => e.title === "frequency")
              .filterType
          }
        />
        {/* add internal Deadline according to deadline date  */}
        <Column
          dataField="due_date"
          width={"160px"}
          caption="Internal Deadline"
          dataType="string"
          allowSorting={true}
          cellRender={RenderData}
          visible={
            defaultVisibleColumns.find((e) => e.title === "due_date").is_visible
          }
          filterValues={
            defaultVisibleColumns.find((e) => e.title === "due_date")
              .filter_value
          }
          filterType={
            defaultVisibleColumns.find((e) => e.title === "due_date").filterType
          }
        />

        <Column
          width={"60px"}
          dataField="impactFlag"
          caption="Impact"
          dataType="string"
          allowSorting={false}
          cellRender={RenderImpect}
          allowFiltering={false}
          visible={
            defaultVisibleColumns.find((e) => e.title === "impactFlag")
              .is_visible
          }
        />

        <Column
          dataField="riskRating"
          width={"120px"}
          caption="Risk Rating"
          allowSorting={true}
          dataType="string"
          cellRender={RenderRiskRating}
          visible={
            defaultVisibleColumns.find((e) => e.title === "riskRating")
              .is_visible
          }
          filterValues={
            defaultVisibleColumns.find((e) => e.title === "riskRating")
              .filter_value
          }
          filterType={
            defaultVisibleColumns.find((e) => e.title === "riskRating")
              .filterType
          }
        />
        <Column
          dataField="deadline_date"
          width={"120px"}
          caption="Due Date"
          allowSorting={true}
          dataType="string"
          cellRender={RenderData}
          visible={
            defaultVisibleColumns.find((e) => e.title === "deadline_date")
              .is_visible
          }
          filterValues={
            defaultVisibleColumns.find((e) => e.title === "deadline_date")
              .filter_value
          }
          filterType={
            defaultVisibleColumns.find((e) => e.title === "deadline_date")
              .filterType
          }
        />
      </DataGrid>
      <CustomColumnChooser
        container="#dashboard-task-table-GP1001"
        button="#myColumnChooser"
        visible={visible}
        onHiding={onHiding}
        columns={defaultVisibleColumns}
        onApply={onApply}
        SaveDefaultColview={SaveDefaultColview}
      />
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
        user={"CC"}
        company={""}
        inviteUser={""}
        handleDeleteMember={""}
        userId={userEmail}
        userKey="assignTo"
        handleAction={handleConfirmAction}
        resetSelectCol={resetSelectCol}
      />
      <AddBulkComment
        openModal={openCommentModal}
        closeModal={setOpenCommentModal}
        tab={tab}
        handleAction={handleConfirmAction}
        setComment={setComment}
        comment={comment}
        resetSelectCol={resetSelectCol}
      />
      <BulkUploadFile
        openModal={openFileModal}
        closeModal={setOpenFileModal}
        selectedList={selectedList}
        resetSelectCol={resetSelectCol}
      />
      <ConfirmModal
        openModal={openConfirmModal}
        closeModal={setOpenConfirmModal}
        handleAction={handleConfirmAction}
        tab={tab}
        title={tab}
      />
    </div>
  );
};

export default CheckTable;
