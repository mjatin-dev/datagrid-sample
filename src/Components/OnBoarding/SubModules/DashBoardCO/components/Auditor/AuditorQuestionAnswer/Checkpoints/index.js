/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { MdTextsms, MdAdd, MdInfo } from "react-icons/md";
import { useHistory } from "react-router";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import { toast } from "react-toastify";
import styles from "../style.module.scss";
import ProjectManagementModal from "../../../../../../../ProjectManagement/components/ProjectManagementModal";
import { Input } from "../../../../../../../Audit/components/Inputs/Input";
import IconButton from "../../../../../../../Audit/components/Buttons/IconButton";
import CommentSection from "../../../../../../../Audit/components/CommentsSection";
import axiosInstance from "../../../../../../../../apiServices";
import BackDrop from "../../../../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import SubmitedDocs from "../../../../../../../Audit/components/CustomCells/SubmittedDocs";
import { useDispatch, useSelector } from "react-redux";
import auditApi from "../../../../../../../Audit/api";
import {
  getAssignmentCheckpoints,
  setLongTextPoup,
} from "../../../../../../../Audit/redux/actions";
import {
  getFileExtensions,
  getTruncatedString,
} from "Components/Audit/components/Helpers/string.helpers";
import useFileUpload from "SharedComponents/Hooks/FileUpload.hook";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import NotCompliedConfirmation from "Components/Audit/components/Modal/NotCompiledConfirmation";
import {
  CompliedNotCompliedFunction,
  auditTableCell,
  customHeaderCell,
  dashBoardFileExportName,
  docsReliedUponCell,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
import { auditDateFormater } from "CommonModules/Utils/helperfunctions";
import SubmittedDocsByAuditeeModal from "Components/Audit/components/Modal/submittedDocsAuditeeModal/SumbitedDocsByAuditeeModal";
import AuditReferenceModal from "Components/Audit/components/ReferenceComponent";
import DevExtremeComponents from "Components/Audit/constants/DevEx/commonExports";

//devex column chooser imports
import AuditColumnChooser from "Components/Audit/components/AuditColumnChooser/AuditColumnChooser";
import { dashboardChecklistColumns } from "Components/Audit/components/AuditColumnChooser/ColumnChooserConstants";
import { getSavedColumn } from "Components/Audit/components/AuditColumnChooser/AuditColumnChooserAPI";
import { dashboard_checklist_initialState } from "Components/Audit/components/AuditColumnChooser/initialsStatesForColumnChooser";

// devex filter imports
import {
  auditDashboardChecklistObjKey,
  dashboard_assignment_checklist_search_filter_list,
  dashboar_assignment_checklist_indivisual_filter_list,
} from "Components/Audit/components/AuditFilters/filterConstants";
import { createCustomAuditDataGridStore } from "Components/Audit/components/AuditFilters/filter";
import { handleColumnChange } from "Components/Audit/components/AuditFilters/columnChange";

import RequiredDocPopup from "Components/Audit/components/CustomCells/RequiredDocPopup";
import useCustomFilter from "Components/Audit/components/AuditFilters/customHook";
import { isAuditFiltersApplied } from "Components/Audit/components/AuditFilters/commonFunctions";
import { remoteOperations } from "Components/Audit/constants/datagrid.config";

const {
  DataGrid,
  ColumnFixing,
  Column,
  RequiredRule,
  FilterRow,
  SearchPanel,
  Export,
  Toolbar,
  Item,
  GroupPanel,
  Selection,
  Grouping,
  HeaderFilter,
  ColumnChooser,
} = DevExtremeComponents;

function Checkpoints({ assignmentName }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const loggedInUserEmail = useSelector(
    (state) => state?.auth?.loginInfo?.email
  );
  const assignmentId = history?.location?.state?.assignmentId || "";
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isShowComments, setIsShowComments] = useState(false);
  const [commentsData, setCommentsData] = useState([]);
  const [isFileUploadInProgress, uploadFile] = useFileUpload();

  const [notCompliedModal, setNotCompliedModal] = useState(false);
  const [notCompliedModalData, setNotCompliedModalData] = useState(null);

  const [showSubmittedDocsByAuditee, setShowSubmittedDocsByAuditee] =
    useState(false);
  const [submittedDocsByAuditeeData, setSubmittedDocsByAuditeeData] = useState(
    []
  );
  const [references, setReferences] = useState([]);
  const userTypeNo = useSelector(
    (state) => state?.auth?.loginInfo?.auditUserType
  );
  const [currentOpenedCheckpointsComment, setCurrentOpenedCheckpointsComment] =
    useState("");
  const [isShowReferenceData, setShowReferenceData] = useState({
    isShowReference: false,
    question_id: "",
  });
  const tableRef = useRef();
  const devExRef = useRef();

  const tableScrollableHeight = useScrollableHeight(tableRef, 48, [
    tableRef,
    dataSource,
  ]);

  const [requiredDocPopup, setRequiredDocPopup] = useState({
    show: false,
    data: {},
  });

  const [visible, setVisible] = useState(false);
  const [defaultVisibleColumns, setDefaultVisibleColumns] = useState(
    JSON.parse(JSON.stringify(dashboard_checklist_initialState))
  );

  const customClearFilter = useCustomFilter(
    devExRef,
    setDefaultVisibleColumns,
    defaultVisibleColumns
  );

  const onHiding = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onApply = useCallback(
    (changes) => {
      setDefaultVisibleColumns(changes);
    },
    [setDefaultVisibleColumns]
  );

  const openNotCompliedModal = (data) => {
    setNotCompliedModal(true);
    setNotCompliedModalData(data);
  };
  const closeNotCompliedModal = () => {
    setNotCompliedModal(false);
  };

  useEffect(() => {
    fetchTblData();
  }, []);

  //Devex function to fetch data
  const fetchTblData = useCallback(async () => {
    const payload = { assignment_id: assignmentId };
    const CustomDataStore = createCustomAuditDataGridStore(
      "audit.api.getChecklistBasedonAssignmentAndUser",
      auditDashboardChecklistObjKey,
      dashboard_assignment_checklist_search_filter_list,
      dashboar_assignment_checklist_indivisual_filter_list,
      payload,
      "check_point_id"
    );
    setDataSource(CustomDataStore);
  }, [assignmentId]);

  const SubmitedDocsFunction = (data) =>
    SubmitedDocs(data, fetchTblData, "checkpoints");

  const handleStatusApi = (e, assignment_id, check_point_id, data) => {
    if (
      e.target.value === "Not Complied" &&
      data?.data?.submitted_doc.length === 0
    ) {
      openNotCompliedModal(data);
    } else {
      CompliedNotCompliedFunction(
        e.target.value,
        assignment_id,
        check_point_id,
        fetchTblData
      );
    }
  };

  const handleSaverityApi = (e, id) => {
    try {
      axiosInstance
        .post("audit.api.UpdateChecklistSeverity", {
          check_point_id: id,
          severity: e.target.value,
        })
        .then((res) => {
          if (res?.data?.message?.status) {
            fetchTblData();
          } else {
            toast.error(res?.data?.message?.status_response);
          }
        });
    } catch (err) {}
  };

  // function to get Comments
  const getCheckpointsComments = async (checkpoint_id, assignment_id) => {
    const resp = await axiosInstance.post("audit.api.GetChecklistComments", {
      check_point_id: checkpoint_id || currentOpenedCheckpointsComment,
      assignment_id: assignment_id || assignmentId,
    });
    if (resp) {
      const { data, status } = resp;
      if (data && status === 200 && data?.message?.status === true) {
        setCommentsData(data?.message?.comment_list || []);
      }
    }
  };

  //function to set Comment
  const setCheckpointsComment = async (content) => {
    const resp = await axiosInstance.post("audit.api.SetChecklistComments", {
      check_point_id: currentOpenedCheckpointsComment,
      content,
      assignment_id: assignmentId,
    });
    if (resp) {
      const { data, status } = resp;
      if (data && status === 200 && data?.message?.status === true) {
        getCheckpointsComments();
      }
    }
  };

  const companyFieldCell = (data) => {
    const value = data?.value;
    return (
      <span title={value} className={styles.customDataCell}>
        {getTruncatedString(value) || "-"}
      </span>
    );
  };

  const SubmitedDocsByAuditeeQuestions = (data) => {
    const { value } = data.data;
    return (
      <>
        {value?.length > 0 &&
          value?.slice(0, 2).map((item, index) => {
            const { question, question_id } = item;
            return (
              <span
                title={question}
                onClick={() => {
                  setShowSubmittedDocsByAuditee(true);
                  setSubmittedDocsByAuditeeData([item]);
                }}
                className={`${styles.customDataCell} ${styles.customDataCellLinkColor} mr-2`}
              >
                {`${index + 1})${question}` || "-"}
              </span>
            );
          })}
        {value?.length > 2 && (
          <p
            className={styles.docsSubmittedByAuditee__viewMoreBtn}
            onClick={() => {
              setShowSubmittedDocsByAuditee(true);
              setSubmittedDocsByAuditeeData([...value]);
            }}
          >
            More Results
          </p>
        )}
        {(!value || value?.length <= 0) && (
          <span
            className={styles.customDataCell}
            style={{ textAlign: "center" }}
          >
            -
          </span>
        )}
      </>
    );
  };

  const dropdownStatusAction = (data) => {
    const { status, check_point_id, assignment_id } = data.data;
    return (
      <div className="d-flex align-items-center">
        <Input
          value={status || "-"}
          type="select"
          variant="tableDataSelectInput"
          placeholder={"select"}
          disabled={userTypeNo === 8 || userTypeNo === 14 || userTypeNo === 3}
          selectEnabled={true}
          valueForDropDown={["Complied", "Not Complied", "Not Applicable"]}
          onChange={(e) =>
            handleStatusApi(e, assignment_id, check_point_id, data)
          }
        />
      </div>
    );
  };

  const dropdownSaverityAction = (data) => {
    const { severity, check_point_id, owner } = data.data;
    return (
      <div className="d-flex align-items-center">
        <Input
          value={severity || "select"}
          type="select"
          disabled={
            owner !== loggedInUserEmail ||
            userTypeNo === 8 ||
            userTypeNo === 14 ||
            userTypeNo === 3
          }
          variant="tableDataSelectInput"
          placeholder={severity || "select"}
          valueForDropDown={["Low", "Medium", "High"]}
          onChange={(e) => handleSaverityApi(e, check_point_id)}
        />
      </div>
    );
  };

  const CommentAction = (data) => {
    const { check_point_id, assignment_id } = data?.data;
    return (
      <div className="d-flex align-items-center justify-center">
        <IconButton
          variant="iconButtonPrimary"
          className={`${styles.tableIconButton} mr-2`}
          disabled={userTypeNo === 8 || userTypeNo === 14 || userTypeNo === 3}
          description={<MdTextsms />}
          size="none"
          onClick={() => {
            setCurrentOpenedCheckpointsComment(check_point_id);
            setIsShowComments(!isShowComments);
            getCheckpointsComments(check_point_id, assignment_id);
          }}
          disabledVariant="iconButtonPrimaryDisabled"
        />
      </div>
    );
  };

  const AssignToComponent = (data) => {
    const { assigned_to, assigned_to_email } = data?.data?.data;
    return (
      <span title={assigned_to_email} className={styles.customDataCell}>
        {assigned_to || "-"}
      </span>
    );
  };

  const AddTemplateAction = (data) => {
    const { check_point_id, attachment_format, status } = data.data;
    return (
      <div className={styles.fileInput}>
        <label
          className={`${
            status === "Complied" ||
            userTypeNo === 8 ||
            userTypeNo === 14 ||
            userTypeNo === 3
              ? styles.addIconButtonDisabled
              : styles.addIconButton
          }`}
        >
          <input
            type="file"
            multiple
            disabled={
              status === "Complied" ||
              userTypeNo === 8 ||
              userTypeNo === 14 ||
              userTypeNo === 3
            }
            onChange={(e) => handleAddDocs(e, check_point_id)}
            accept={getFileExtensions(attachment_format)}
          />
          <MdAdd />
        </label>
      </div>
    );
  };

  const auditPopupCell = (_data, type) => {
    const value = _data?.value;
    return (
      <div className="audit__columna__auto">
        <p
          title={value}
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.preventDefault();
            dispatch(
              setLongTextPoup({
                isOpen: true,
                data: value,
                heading: type,
              })
            );
          }}
        >
          {value?.toString() || "-"}
        </p>
      </div>
    );
  };

  const closeRequiredPopup = () => {
    setRequiredDocPopup({
      show: false,
      data: {},
    });
  };

  const viewRequirements = (data) => {
    return (
      <div className="d-flex align-items-center justify-content-center">
        {data?.value?.length > 0 ? (
          <IconButton
            variant="iconButtonPrimary"
            description={<MdInfo />}
            size="none"
            onClick={() =>
              setRequiredDocPopup({
                show: true,
                data: data,
              })
            }
          />
        ) : (
          <span className={`${styles.customDataCell} text-center`}>-</span>
        )}
      </div>
    );
  };

  const onToolbarPreparing = useCallback(
    (e) => {
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
    },
    [setVisible]
  );

  const handleAddDocs = async (e, check_point_id) => {
    const isFileUploaded = await uploadFile(e, auditApi.addDocsInChecklist, {
      check_point_id,
      assignment_id: assignmentId,
    });
    if (isFileUploaded) {
      fetchTblData();
      dispatch(getAssignmentCheckpoints(assignmentId));
    }
  };

  useEffect(() => {
    getSavedColumn(
      defaultVisibleColumns,
      setDefaultVisibleColumns,
      "Checklist"
    );
  }, []);

  return (
    <>
      <BackDrop isLoading={isLoading} />
      <SubmittedDocsByAuditeeModal
        open={showSubmittedDocsByAuditee}
        setShowSubmittedDocsByAuditee={setShowSubmittedDocsByAuditee}
        data={submittedDocsByAuditeeData}
        setSubmittedDocsByAuditeeData={setSubmittedDocsByAuditeeData}
        getCheckpoints={fetchTblData}
      />
      <NotCompliedConfirmation
        handleClose={closeNotCompliedModal}
        open={notCompliedModal}
        data={notCompliedModalData}
        onSubmitFunction={fetchTblData}
      />
      <CommentSection
        isVisible={isShowComments}
        QuestionCanExist={true}
        onClose={() => {
          setIsShowComments(false);
          setCommentsData([]);
          setCurrentOpenedCheckpointsComment("");
        }}
        comments={commentsData}
        onSend={setCheckpointsComment}
      />
      <ProjectManagementModal
        title="Required attachment format"
        visible={requiredDocPopup.show}
        onClose={closeRequiredPopup}
      >
        <RequiredDocPopup data={requiredDocPopup.data} />
      </ProjectManagementModal>

      <ProjectManagementModal
        visible={isShowReferenceData.isShowReference}
        onClose={() => {
          setShowReferenceData({
            isShowReference: false,
            question_id: "",
          });
          setReferences([]);
        }}
      >
        <AuditReferenceModal
          isShowReferenceData={isShowReferenceData}
          references={references}
          setReferences={setReferences}
        />
      </ProjectManagementModal>
      <div className="table-cell auditDevexCustomizations" ref={tableRef}>
        <DataGrid
          keyExpr={"check_point_id"}
          id="dataGrid"
          dataSource={dataSource}
          columnAutoWidth={false}
          ref={devExRef}
          allowColumnReordering={true}
          onExporting={(e) =>
            exportValidation(dataSource?.length, e, dashBoardFileExportName())
          }
          export={{
            allowExportSelectedData: true,
            enabled: true,
          }}
          showColumnLines={false}
          showBorders={false}
          showRowLines={false}
          wordWrapEnabled={true}
          selection={{
            mode: "multiple",
            showCheckBoxesMode: "always",
          }}
          height={tableScrollableHeight}
          width="100%"
          remoteOperations={remoteOperations}
          onOptionChanged={(e) =>
            handleColumnChange(
              e,
              defaultVisibleColumns,
              setDefaultVisibleColumns,
              devExRef
            )
          }
          scrolling={{
            columnRenderingMode: "virtual",
            mode: "infinite",
            preloadEnabled: false,
            renderAsync: undefined,
            rowRenderingMode: "virtual",
            scrollByContent: true,
            scrollByThumb: true,
            showScrollbar: "always",
            useNative: "auto",
          }}
          columnChooser={{
            enabled: false,
          }}
          sorting={{
            mode: "multiple",
          }}
          onToolbarPreparing={onToolbarPreparing}
        >
          <Toolbar>
            <Item
              widget="dxButton"
              options={{
                text: "Reset Filters",
                type: "normal",
                hint: "Reset Filters",
                stylingMode: "outlined",
                onClick: customClearFilter,
              }}
              name="resetFiltersButton"
              location="after"
              visible={isAuditFiltersApplied(defaultVisibleColumns)}
            />
            <Item name="exportButton" />
            <Item name="searchPanel" />
            <Item
              name="columnChooserButton"
              locateInMenu="auto"
              location="after"
            />
            <Item name="groupPanel" location="before" />
          </Toolbar>
          <HeaderFilter visible={true} filter allowSearch={true} />
          <ColumnChooser enabled={false} />
          <Column
            dataField="assignment_name"
            caption="Assignment Name"
            cellRender={auditTableCell}
            headerCellRender={customHeaderCell}
            alignment="left"
            allowExporting={false}
            allowSorting={true}
            minWidth={200}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "assignment_name")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "assignment_name")
                .filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "assignment_name")
                .filterType
            }
          >
            <RequiredRule />
          </Column>
          <Column
            dataField="checklist_section"
            caption="Section Name"
            cellRender={auditTableCell}
            minWidth={200}
            allowSorting={true}
            headerCellRender={customHeaderCell}
            visible={
              defaultVisibleColumns?.find(
                (e) => e.title === "checklist_section"
              )?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "checklist_section")
                .filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "checklist_section")
                .filterType
            }
          >
            <RequiredRule />
          </Column>
          <Column
            dataField="check_point"
            caption="Checkpoints"
            allowSorting={true}
            headerCellRender={customHeaderCell}
            cellRender={(e) => auditPopupCell(e, "CheckPoint")}
            alignment="left"
            minWidth={150}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "check_point")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "check_point")
                .filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "check_point")
                .filterType
            }
          />
          <Column
            dataField="assigned_to"
            caption="Assign To"
            allowSorting={false}
            headerCellRender={customHeaderCell}
            cellComponent={AssignToComponent}
            alignment="left"
            width={150}
            allowExporting={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "assigned_to")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "assigned_to")
                .filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "assigned_to")
                .filterType
            }
          />
          <Column
            dataField="documents_relied_upon"
            caption="Docs Relied Upon"
            allowSorting={false}
            width={200}
            headerCellRender={customHeaderCell}
            cellRender={(data) =>
              docsReliedUponCell(data, setShowReferenceData)
            }
            alignment="left"
            visible={
              defaultVisibleColumns?.find(
                (e) => e.title === "documents_relied_upon"
              )?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find(
                (e) => e.title === "documents_relied_upon"
              ).filter_value
            }
            filterType={
              defaultVisibleColumns.find(
                (e) => e.title === "documents_relied_upon"
              ).filterType
            }
          />
          <Column
            dataField="attachment_format"
            allowSorting={false}
            caption="Required Docs."
            headerCellRender={customHeaderCell}
            cellRender={viewRequirements}
            alignment={"center"}
            allowExporting={false}
            width={"70px"}
            allowHeaderFiltering={false}
            visible={
              defaultVisibleColumns?.find(
                (e) => e.title === "attachment_format"
              )?.is_visible
            }
          />
          <Column
            dataField="submitted_doc"
            allowSorting={false}
            caption="Auditor Annexure"
            headerCellRender={customHeaderCell}
            cellComponent={SubmitedDocsFunction}
            alignment="center"
            width={"120px"}
            allowExporting={false}
            allowHeaderFiltering={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "submitted_doc")
                ?.is_visible
            }
          />
          <Column
            dataField="checkpoint_reference_list"
            allowSorting={false}
            caption="Reg Reference"
            headerCellRender={customHeaderCell}
            cellComponent={SubmitedDocsFunction}
            alignment="center"
            width={"120px"}
            allowExporting={false}
            allowHeaderFiltering={false}
            visible={
              defaultVisibleColumns?.find(
                (e) => e.title === "checkpoint_reference_list"
              )?.is_visible
            }
          />

          <Column
            dataField="submitted_doc_by_auditee"
            caption="Submitted By Auditee"
            allowSorting={false}
            headerCellRender={customHeaderCell}
            // cellComponent={SubmitedDocsByAuditee}
            cellComponent={SubmitedDocsByAuditeeQuestions}
            alignment="center"
            allowExporting={false}
            width={200}
            visible={
              defaultVisibleColumns?.find(
                (e) => e.title === "submitted_doc_by_auditee"
              )?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find(
                (e) => e.title === "submitted_doc_by_auditee"
              ).filter_value
            }
            filterType={
              defaultVisibleColumns.find(
                (e) => e.title === "submitted_doc_by_auditee"
              ).filterType
            }
          />
          <Column
            dataField="status"
            caption="Status"
            allowSorting={false}
            cellRender={dropdownStatusAction}
            headerCellRender={customHeaderCell}
            width={"130px"}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "status")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "status")
                .filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "status").filterType
            }
          />
          <Column
            dataField="severity"
            allowSorting={false}
            caption="Severity"
            cellRender={dropdownSaverityAction}
            headerCellRender={customHeaderCell}
            width={"130px"}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "severity")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "severity")
                .filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "severity")
                .filterType
            }
          />
          <Column
            caption="Add Docs."
            allowSorting={false}
            cellRender={AddTemplateAction}
            headerCellRender={customHeaderCell}
            alignment="center"
            width={"90px"}
            allowExporting={false}
            allowHeaderFiltering={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "Add_Docs")
                ?.is_visible
            }
          />
          <Column
            caption="Comments"
            allowSorting={false}
            headerCellRender={customHeaderCell}
            cellRender={CommentAction}
            alignment="center"
            width={"90px"}
            allowExporting={false}
            allowHeaderFiltering={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "Comments")
                ?.is_visible
            }
          />
          <Column
            dataField="start_date"
            allowSorting={true}
            caption="Start Date"
            headerCellRender={customHeaderCell}
            cellRender={auditDateFormater}
            alignment="left"
            width={"100px"}
            allowExporting={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "start_date")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "start_date")
                .filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "start_date")
                .filterType
            }
          />
          <Column
            dataField="to_be_completed"
            allowSorting={true}
            caption="End Date"
            headerCellRender={customHeaderCell}
            cellRender={auditDateFormater}
            alignment="left"
            width={"100px"}
            allowExporting={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "to_be_completed")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "to_be_completed")
                .filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "to_be_completed")
                .filterType
            }
          />
          <Column
            dataField="penalty"
            allowSorting={false}
            caption="Penalty"
            headerCellRender={customHeaderCell}
            cellRender={companyFieldCell}
            alignment="left"
            width={"100px"}
            allowExporting={false}
            allowHeaderFiltering={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "penalty")
                ?.is_visible
            }
          />
          <ColumnFixing enabled={true} />
          <FilterRow visible={true} />
          <SearchPanel visible={true} id={234} />
          <Grouping contextMenuEnabled={true} />
          <GroupPanel visible={true} allowColumnDragging={true} />
          <Export enabled={true} />
          <Selection mode="single" />
        </DataGrid>
        <AuditColumnChooser
          container="#dataGrid"
          button="#myColumnChooser"
          visible={visible}
          onHiding={onHiding}
          columns={defaultVisibleColumns}
          onApply={onApply}
          defaultColumns={dashboardChecklistColumns}
          view="Checklist"
        />
      </div>
    </>
  );
}

export default Checkpoints;
