/* eslint-disable react-hooks/rules-of-hooks */
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import moment from "moment";
// import { v4 as uuidv4 } from "uuid";

import PivotGrid, { FieldChooser } from "devextreme-react/pivot-grid";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import assignIconRound from "../../../../../../../../assets/Icons/assignIconCircle.png";
import { createStore } from "devextreme-aspnet-data-nojquery";
import { MdInfo } from "react-icons/md";
import Dropdown from "react-dropdown";
import styles from "./style.module.scss";
import { exportGrid } from "Components/Audit/constants/CommonFunction";
import api from "../../../../../../../../apiServices/index";
import apis from "SharedComponents/Dashboard/apis";
import { DASHBOARD_SEARCH_KEY } from "CommonModules/sharedComponents/constants/constant";

// const LoaderGIF = require('../../../../../../../../assets/Images/loader-gif.gif');
import LoaderGIF from "../../../../../../../../assets/Images/loader-gif.gif";
import CustomColumnChooser from "./CustomColumnChooser";

import { actions as taskReportActions } from "Components/OnBoarding/SubModules/DashBoardCO/redux/actions.js";

import DataGrid, {
  Column,
  Button,
  HeaderFilter,
  Grouping,
  LoadPanel,
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
  StateStoring,
} from "devextreme-react/data-grid";
import { getInitialName } from "CommonModules/helpers/GetIntialName.helper";
import { useDispatch, useSelector } from "react-redux";
import "./table.scss";
import {
  bulkMarkCompleteValidate,
  CheckBulkApprovalPending,
  CheckWorkPermission,
  getTaskListItemBackgroundColor,
} from "CommonModules/helpers/tasks.helper";
import {
  fetchAnalyticsTasksRequest,
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
import {
  useDebounce,
  useGetTaskPermissions,
} from "CommonModules/helpers/custom.hooks";
// useGetTaskPermissions
import BackDrop from "CommonModules/sharedComponents/Loader/BackDrop";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import BulkFileUpload from "./BulkActions/BulkFileUpload";
import { SelectBox } from "devextreme-react";
// import { LoadPanel } from 'devextreme-react';
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

function reducer(state, changes) {
  if (Object.keys(changes).length === 0) return state;

  var newState = [...state];
  changes.forEach((change) => {
    var column = newState.find((c) => c.dataField === change.dataField);
    Object.keys(change).forEach((key) => {
      column[key] = change[key];
    });
  });
  return newState;
}

const FinalDevExTbl = ({
  TableData,
  currentAnalyticsKey,
  rowCount,
  reCallfetchTaskList,
  setDefaultVisibleColumns,
  defaultVisibleColumns,
  isLoading,
  setLoading,
  is_teamperformance = false,
}) => {
  const dispatch = useDispatch();
  const tableRef = useRef();
  const state = useSelector((state) => state);
  const userEmail = useSelector((state) => state.auth.loginInfo.email);
  const userName = useSelector((state) => state.auth.loginInfo.UserName);
  const userType = useSelector((state) => state.auth.loginInfo.UserType);
  const userDetails = state && state.auth && state.auth.loginInfo;
  const selectedMenu = state && state.adminMenu && state.adminMenu.currentMenu;
  const DefaultFilterValue = [
    ["subject", "=", "rewre"],
    "and",
    ["status", "Assigned"],
  ];

  const [columns, setColumnsState] = useReducer(reducer, defaultVisibleColumns);

  const [visible, setVisible] = useState(false);

  const onToolbarPreparing = useCallback(
    (e) => {
      e.toolbarOptions.items.push({
        widget: "dxButton",
        location: "after",
        options: {
          icon: "columnchooser",
          elementAttr: {
            id: "myColumnChooser",
          },
          onClick: () => setVisible(true),
        },
      });
    },
    [setVisible]
  );

  const onHiding = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onApply = useCallback(
    (changes) => {
      setColumnsState(changes);
      // setVisible(false);
    },
    [setColumnsState, setVisible]
  );

  const takeActionActiveTab = useSelector(
    (state) => state?.adminMenu?.takeActionActiveTab
  );
  let { isPaymentPlanActive, activeLicenses } = useSelector(
    (state) => state?.DashboardState?.taskDetailById
  );
  const { loader, devExFilterData } = state.taskReport;
  const [checkBoxesMode, setcheckBoxesMode] = useState("onClick");
  const [allMode, setallMode] = useState("allPages");
  const [rowData, setRowData] = useState([]);
  const [tblCount, setTblCount] = useState(6);
  const [searchValue, setSearchValue] = useState(
    localStorage.getItem(DASHBOARD_SEARCH_KEY) || ""
  );
  const searchQuery = useDebounce(searchValue, 500);
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
  const [selectedTaskId, setSelectedTaskId] = useState([]);
  const [comment, setComment] = useState("");
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const CheckAsignHook = useGetTaskPermissions();
  const [isBtnLoading, setisButtonLoading] = useState(false);

  /* ======================================== Custom Store CReated ============================================ /
  const CustomDataStore = new CustomStore({
    key: "taskId",
    load: async(loadOptions)=>{

      let sendObj  = {
        key:    takeActionActiveTab?.key,
        filter: takeActionActiveTab?.filter === "completedTask" ? "completed" : takeActionActiveTab.filter,
        search: searchQuery || '',
        search_filter: { subject: '', license: '', assign_to: '', company: '', dueDate: '', status: '', frequency: '', },
        inside_filter_search: [],
      };

      let is_filter_listing = false;
      let individual_filter_list = {
        subject: [],
        licenseDisplay: [],
        assignedToName: [],
        customerName: [],
        dueDate: [],
        status: [],
        frequency: [],
      };
      let filterObjkey = {
        subject: "subject",
        licenseDisplay: "license",
        assignedToName: "assign_to",
        customerName: "company",
        dueDate: "dueDate",
        status: "status",
        frequency: "frequency",
      };
      let params = "?";
      [
        "skip",
        "take",
        // "requireTotalCount",
        "requireGroupCount",
        "sort",
        "filter",
        "totalSummary",
        "group",
        "groupSummary"
      ].forEach((i) => {
        if (i in loadOptions && isNotEmpty(loadOptions[i])) {
          params += `${i}=${JSON.stringify(loadOptions[i])}&`;

          if(i==='filter'){
            
            loadOptions[i]?.map((lp)=>{
              if(Array.isArray(lp)){
                if(lp[1]==="contains"){
                  let colType = filterObjkey[lp[0]];
                    // if(selectorObj[lp[0]] ==='task_name'){
                    //   colType = 'task_list';
                    // }
                    // if(selectorObj[lp[0]]==='assign_to'){
                    //   colType = 'team_member';
                    // } 
                  // insideFilterSearch.type     = colType || ''; 
                  // insideFilterSearch.contains = lp[2] || ''; 
                  sendObj.inside_filter_search = lp;
                }
                if(lp.filterValue){
                  lp?.map((itm)=>{
                    if(Array.isArray(itm)){
                      individual_filter_list?.[itm[0]].push(itm.filterValue);
                    }
                  });
                }
                if(individual_filter_list?.[lp[0]]){
                  individual_filter_list?.[lp[0]].push(lp.filterValue);
                } 
              }
            });
          }else{
            sendObj[i] = loadOptions[i];
            if(i==='group' && isNotEmpty(loadOptions[i]) ){
              let gpArray  = [];
              loadOptions[i].forEach((Gitm)=>{
                let obj  = {
                  ...Gitm,
                  selector:filterObjkey[Gitm.selector],
                }
                gpArray.push(obj)
              });
              sendObj[i] = gpArray;
              is_filter_listing = true;
            }
          }
        }
      });
      params = params.slice(0, -1);
      Object.keys(individual_filter_list).map((item)=>{
        sendObj.search_filter[filterObjkey[item]] = individual_filter_list[item].toString();
      }); 
      let resultObj  = {
            data: [],
            totalCount: 0,
            summary: 0,
            groupCount: 0
      }

      let resultResponse = await apis.getDevExDataListing(sendObj)

      if(is_filter_listing){
        let FilterObj  = resultResponse?.data?.data?.task_filter_options.map((item)=>({ count:  0, items: null, key :  item }));
        return FilterObj;
      }
      resultObj.data       = resultResponse?.data?.data?.tasks || [];
      resultObj.totalCount = resultResponse?.data?.data?.count || 0;

      return resultObj;


      // return fetch(
      //   `https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/orders${params}`
      // )
      //   .then((response) => response.json())
      //   .then((data) => ({
      //     data: data.data,
      //     totalCount: data.totalCount,
      //     summary: data.summary,
      //     groupCount: data.groupCount
      //   }))
      //   .catch(() => {
      //     throw new Error("Data Loading Error");
      //   });
    }
  })
  /* ======================================== Custom Store CReated ============================================ */

  // const disableList = ["ccTask", "rejectedTask", "completedTask"];
  const handleBtnClick = (e) => {
    console.log(e);
  };

  let disableList = ["ccTask", "rejectedTask", "completedTask"];
  // const checkBulkFn = () => {

  // let disableList = ["ccTask", "rejectedTask", "completedTask"];
  const HandleRow = (e, uEmail) => {
    let assignTo = e?.data?.assignTo;
    if (e.rowType == "header") {
      e.rowElement.style.fontSize = "14px";
    }

    if (e.rowType == "data") {
      e.rowElement.style.backgroundColor = getTaskListItemBackgroundColor(
        uEmail,
        assignTo
      );
      e.rowElement.style.cursor = "pointer";
    }
  };

  const checkBulkFn = () => {
    // let sendArr = [
    //   { value: "Assign To", label: "Assign To" },
    //   { value: "Approver", label: "Approver" },
    //   { value: "CC", label: "CC" },
    //   { value: "Comment", label: "Comment" },
    //   { value: "Mark Complete", label: "Mark Complete" },
    //   { value: "Upload File", label: "Upload File" },
    // ];
    // let type2Arr = [
    //   { value: "Assign To", label: "Assign To" },
    //   { value: "Approver", label: "Approver" },
    //   { value: "Approve", label: "Approve" },
    //   { value: "CC", label: "CC" },
    //   { value: "Reject", label: "Reject" },
    //   // { value: "Mark Complete",label: "Mark Complete" },
    //   { value: "Comment", label: "Comment" },
    //   { value: "Upload File", label: "Upload File" },
    // ];

    let sendArr = [
      "Assign To",

      "Approver",

      "CC",

      "Comment",

      "Mark Complete",

      "Upload File",
    ];

    let type2Arr = [
      "Assign To",

      "Approver",

      "Approve",

      "CC",

      "Reject",

      // { value: "Mark Complete",label: "Mark Complete" },

      "Comment",

      "Upload File",
    ];

    // const onlyComment = [{ value: "Comment", label: "Comment" }];
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
                {data?.value.length > 12
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

  const SetFilter = () => {
    // , 'and', ['status', 'Task Assigned']
    dispatch(
      taskReportActions.devexFilterRequest(
        // {...devExFilterData, filterData:  [['assignedToName', '=', 'CO Forty']]}
        { filterData: [["assignedToName", "=", "CO Forty"]] }
      )
    );
  };
  const clearFilter = () => {
    const dataGrid = tableRef.current.instance;
    setSelectedTaskId([]);
    let vCol = [...defaultVisibleColumns];
    let DVCArr = vCol.map((itm) => ({ ...itm, filter_value: [] }));
    setDefaultVisibleColumns(DVCArr);
    dataGrid.clearSelection();
    dataGrid.clearFilter();
  };
  const resetSelectCol = () => {
    setSelectedTaskId([]);
  };

  const handleSelectAllGrid = (e) => {
    if (e.selectedRowKeys > 0) {
      setSelectedTaskId([]);
    }
  };

  const SelectedFilter = (e) => {
    let SelectedData = GetSelectedTask();
    setSelectedList(SelectedData.rowData);
    if (SelectedData.rowData.length === 0) {
      toast.error("Please select any task");
      return false;
    }
    // if (SelectedData.rowData.length > 100) {
    //   toast.error("Cannot select more then 100 Task.");
    //   return false;
    // }

    if (e?.value === "Upload File" && SelectedData.rowData.length > 25) {
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
      case "Approver":
        setOpenAsignModal(true);
        break;
      case "CC":
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
    setisButtonLoading(true);
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
    setisButtonLoading(false);
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
    setLoading(true);

    setOpenConfirmModal(false);
    setOpenAsignModal(false);
    setOpenCommentModal(false);

    if (response === "confirm") {
      if (tab === "Mark Complete") {
        await markCompleted();
      }

      if (tab === "CC") {
        await AsignCC(uEmail);
      }

      if (tab === "Assign To") {
        await AsignAsignee(uEmail);
      }

      if (tab === "Approver") {
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
      // reCallfetchTaskList();
    } else if (response === "cancel") {
      if (tab === "Comment") {
        setComment("");
      }
    }

    // fetchTaskList();
    setLoading(false);
  };

  const handleOptionChange = (e) => {
    if (e.fullName === "selectedRowKeys") {
      setSelectedList(e.value);
    }
  };

  const AsignCC = async (assign_user) => {
    let uEmail = assign_user?.email || assign_user;
    let TaskIDlist = [];
    let validatedList = [];
    //  check if user invited;
    // activeLicenses, UserDetails
    for (let index = 0; index < selectedList.length; index++) {
      const element = selectedList[index];

      let Permission = CheckWorkPermission(
        activeLicenses,
        element,
        userDetails,
        1,
        assign_user
      );
      if (Permission.editPermission) {
        TaskIDlist.push(element.taskId);
      } else {
        toast.error(
          `Action cannot be performed on the task ${element.subject}`
        );
      }
    }

    if (TaskIDlist.length > 0 && uEmail) {
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
    for (let index = 0; index < selectedList.length; index++) {
      const element = selectedList[index];
      let Permission = CheckWorkPermission(
        activeLicenses,
        element,
        userDetails,
        3,
        uEmail
      );
      if (Permission.editPermission) {
        TaskIDlist.push(element.taskId);
      } else {
        toast.error(
          `Action cannot be performed on the task ${element.subject}`
        );
      }
    }
    // validate
    if (TaskIDlist.length > 0) {
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
    }
  };

  const AsignApprover = async (assign_user) => {
    let uEmail = assign_user?.email || assign_user;
    let TaskIDlist = [];
    for (let index = 0; index < selectedList.length; index++) {
      const element = selectedList[index];
      let Permission = CheckWorkPermission(
        activeLicenses,
        element,
        userDetails,
        2,
        assign_user
      );
      if (Permission.editPermission) {
        TaskIDlist.push(element.taskId);
      } else {
        toast.error(
          `Action cannot be performed on the task ${element.subject}`
        );
      }
    }
    if (TaskIDlist.length > 0) {
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
    }
  };
  const markCompleted = async () => {
    let TaskIDlist = [];

    for (let index = 0; index < selectedList.length; index++) {
      const element = selectedList[index];
      let customer = element?.customer || element?.customerName;
      let fetchSubDate = activeLicenses.find(
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
              ? userDetails.email === element.approver ||
                userDetails.email === element.taskOwner
              : userDetails.UserType === 3 ||
                userDetails.email === element.approver
          )
            ? { status: "Approved" }
            : { status: "Approval Pending" }),
        };
        TaskIDlist.push(obj);
      } else {
        // let obj =
        toast.error(
          `Action cannot be performed on the task ${element.subject}`
        );
      }
    }
    if (TaskIDlist.length > 0) {
      let task_details = TaskIDlist;
      dispatch(
        taskReportActions.changeBulkTaskMarkCompleteRequest({ task_details })
      );
    }
  };

  const ApproveRejectask = async (status) => {
    let TaskIDlist = [];
    for (let index = 0; index < selectedList.length; index++) {
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
      // let Permission = CheckWorkPermission(
      //   activeLicenses,
      //   element,
      //   userDetails
      // );
      if (isAbleToComplete) {
        TaskIDlist.push(obj);
      } else {
        toast.error(
          `Action cannot be performed on the task ${element.subject}`
        );
      }
    }
    if (TaskIDlist.length > 0) {
      let task_details = TaskIDlist;
      dispatch(
        taskReportActions.changeBulkTaskMarkCompleteRequest({ task_details })
      );
    }
  };

  const SaveBulkComment = async () => {
    let TaskIDlist = "";
    for (let index = 0; index < selectedList.length; index++) {
      const element = selectedList[index];
      // TaskIDlist += element.taskId + ",";
      // let Permission = CheckWorkPermission(
      //   activeLicenses,
      //   element,
      //   userDetails
      // );
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

  const HandleRowSelection = (e) => {
    if (e.selectedRowsData) {
      setSelectedTaskId(e.selectedRowKeys);
      setSelectedList(e.selectedRowsData);
    }
  };

  const handleColumnChange = (e) => {
    if (e.value) {
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
        vCol[foundIndex].filter_value = e.value;
        setDefaultVisibleColumns(vCol);
      }
    }

    if (e.name === "columns") {
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
    console.log(tableRef?.current?.instance);
    console.log(tableRef?.current?.instance?.refresh());
    tableRef?.current?.instance?.refresh();
  };

  const fetchTaskList = () => {
    dispatch(
      fetchAnalyticsTasksRequest({
        key: currentAnalyticsKey || "",
        filter:
          takeActionActiveTab.filter === "completedTask"
            ? "completed"
            : takeActionActiveTab.filter,
        search: searchQuery ? searchQuery : "",
        ...{ offset: 0, limit: 2000 },
      })
    );
  };

  const onCustomizeHeaderFilter = (e) => {
    if (e?.target === "age") {
    }
  };

  useEffect(() => {
    let checkAction = checkBulkFn();
    setOptions(checkAction);
    getRegisteredUserList();
    // fetchTblData()
    handleDataChange();
    // if(TableData?.load){
    //   TableData?.load();
    // }
  }, [currentAnalyticsKey]);

  useEffect(() => {
    if (tableRef?.instance?.clearFilter?.length > 0) {
      setShowClearBtn(true);
    } else {
      setShowClearBtn(false);
    }
  }, [tableRef]);
  // const

  return (
    <div id="dashboard-task-table-GP1001" style={{ maxHeight: "500px" }}>
      {/* || TableData?.length */}
      {console.log({ rowCount })}
      {/* {isLoading && <Dots height={rowCount !== 0 && "40px"} />}
      {!isLoading && (
        <> */}
      {/* {loader && <Dots height={rowCount !== 0 && "40px"} />} */}
      {/* {TableData?.length} */}
      {!loader && TableData && (
        <DataGrid
          keyExpr={"taskId"}
          dataSource={TableData}
          remoteOperations={true}
          noDataText={"No Task Found"}
          ref={tableRef}
          height={`${rowCount < 8 ? "auto" : "68vh"}`}
          // height={'480px'}
          // defaultFilterValue={devExFilterData?.filterData}
          // filterValue={devExFilterData?.filterData}
          // defaultFilterValue={DefaultFilterValue}

          onRowPrepared={(e) => HandleRow(e, userEmail)}
          // onRowClick={HandleClick}
          onOptionChanged={handleColumnChange}
          // selectedRowKeys={selectedTaskId}
          // onSelectionChanged={HandleRowSelection}
          // onSelectionChanged={handleSelectionChanged}
          // selectedRowKeys={props.selectedRowKeys}

          // onSelectionAllChanged={handleSelectAllGrid}
          allowColumnReordering={false}
          wordWrapEnabled={true}
          columnAutoWidth={false}
          showBorders={true}
          showColumnLines={true}
          width={"100%"}
          onDataChange={handleDataChange}
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
          onToolbarPreparing={onToolbarPreparing}
          // filterData={onCustomizeHeaderFilter}
          // paging={false}
        >
          <Toolbar>
            <Item location="after">
              <button
                className="btn btn-link clear-filter"
                onClick={clearFilter}
              >
                Reset Filters
              </button>
            </Item>

            <Item>
              <SelectBox
                items={options}
                placeholder="Bulk actions"
                onChange={SelectedFilter}
                onValueChanged={SelectedFilter}
                className={`drop-table ${
                  options.length > 0 ? "show" : "hide"
                } `}
              />
            </Item>

            {/* <Item location="after">
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
              </Item> */}

            <Item
              name="columnChooserButton"
              locateInMenu="auto"
              location="after"
            />
            {/* <Item location="after">
            <button className="btn btn-link clear-filter" onClick={SaveDefaultColview} 
            disabled={isBtnLoading}
            >
              {isBtnLoading ? "Loading..." : "Save as default view" }
            </button>
          </Item> */}
            <Item name="exportButton" />
            <Item name="searchPanel" />
            <Item name="groupPanel" location="before" />
          </Toolbar>
          <HeaderFilter visible={true} filter allowSearch={true} />

          <LoadPanel height={100} width={250} indicatorSrc={LoaderGIF} />
          {/* <StateStoring enabled={true} type="localStorage" storageKey="task_list_data" /> */}

          <Paging defaultPageSize={12} />
          {/* <Scrolling mode="infinite" /> */}
          <LoadPanel enabled={false} />
          <Scrolling mode="infinite" rowRenderingMode="virtual" />

          <Selection
            mode="multiple"
            selectAllMode={allMode}
            showCheckBoxesMode={checkBoxesMode}
          />

          {/* <Column
          dataField="taskId"
          caption="Task ID"
          dataType="string"
          allowSorting={false}
          minWidth={200}
        />  */}

          <Column
            dataField="subject"
            caption="Task Name"
            dataType="string"
            allowSorting={false}
            cellRender={RenderTaskName}
            minWidth={200}
            visible={
              defaultVisibleColumns.find((e) => e.title === "subject")
                .is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "subject")
                .filter_value
            }
            // onFilterValueChange={onCustomizeHeaderFilter}
            // customizeHeaderFilter={onCustomizeHeaderFilter}
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
            allowSorting={false}
            cellRender={renderCompanyName}
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "customerName")
                .filter_value
            }
          />
          <Column
            dataField="status"
            width={"120px"}
            caption="Status"
            dataType="string"
            cellRender={RenderTaskStatus}
            allowSorting={false}
            visible={
              defaultVisibleColumns.find((e) => e.title === "status").is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "status")
                .filter_value
            }
          />
          {/* This is testing from gautam to Check the company name dynamic withc */}
          <Column
            dataField="licenseDisplay"
            width={"90px"}
            caption="License"
            dataType="string"
            allowSorting={false}
            cellRender={RenderTask}
            visible={
              defaultVisibleColumns.find((e) => e.title === "licenseDisplay")
                .is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "licenseDisplay")
                .filter_value
            }
          />
          <Column
            dataField="assignedToName"
            width={"150px"}
            caption="Assigned To"
            allowSorting={false}
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
          />

          <Column
            dataField="frequency"
            width={"120px"}
            caption="Frequency"
            dataType="string"
            allowSorting={false}
            cellRender={renderFreqency}
            visible={
              defaultVisibleColumns.find((e) => e.title === "frequency")
                .is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "frequency")
                .filter_value
            }
          />
          {/* add internal Deadline according to deadline date  */}
          <Column
            dataField="due_date"
            width={"160px"}
            caption="Internal Deadline"
            dataType="string"
            allowSorting={false}
            cellRender={RenderData}
            visible={
              defaultVisibleColumns.find((e) => e.title === "due_date")
                .is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "due_date")
                .filter_value
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
            allowSorting={false}
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
          />
        </DataGrid>
      )}

      <CustomColumnChooser
        container="#dashboard-task-table-GP1001"
        button="#myColumnChooser"
        visible={visible}
        onHiding={onHiding}
        columns={defaultVisibleColumns}
        onApply={onApply}
        SaveDefaultColview={SaveDefaultColview}
      />

      {/* </>
      )} */}

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
        setSelectedUser={setSelectedUser}
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
      {/* <BulkFileUpload
        openModal={openFileModal}
        closeModal={setOpenFileModal}
        selectedList={selectedList}
      /> */}

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
  //};
};

export default FinalDevExTbl;
