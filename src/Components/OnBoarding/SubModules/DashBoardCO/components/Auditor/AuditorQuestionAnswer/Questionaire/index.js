/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  MdTextsms,
  MdAdd,
  MdOutlineQuestionAnswer,
  MdInfo,
} from "react-icons/md";
import { useHistory } from "react-router";
import SubmitedDocs, {
  SubmitedDocsForQuestionarie,
  SubmitedDocsQuestionReferences,
} from "../../../../../../../Audit/components/CustomCells/SubmittedDocs";
import SubmitAnswerModal from "../../../../../../../Audit/components/QuestionnaireAnswer";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import { AiFillCheckCircle } from "react-icons/ai";
import styles from "../style.module.scss";
import IconButton from "../../../../../../../Audit/components/Buttons/IconButton";
import axiosInstance from "../../../../../../../../apiServices";
import BackDrop from "../../../../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import { submitAnswerModalActions } from "../../../../../../../Audit/redux/submitAnswersModalActions";
import {
  setLongTextPoup,
  setMarkAsCompleteModalOpen,
} from "../../../../../../../Audit/redux/actions";
import { useDispatch, useSelector } from "react-redux";
import auditApi from "../../../../../../../Audit/api";
import { getFileExtensions } from "Components/Audit/components/Helpers/string.helpers";
import MarkAsComplete from "Components/Audit/components/MarkAsCompleteModal/markAsComplete";
import useFileUpload from "SharedComponents/Hooks/FileUpload.hook";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import { auditDateFormater } from "CommonModules/Utils/helperfunctions";
import {
  auditTableCell,
  customHeaderCell,
  dashBoardFileExportName,
  docsReliedUponCell,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
import CommentSection from "Components/Audit/components/CommentsSection";
import DevExtremeComponents from "Components/Audit/constants/DevEx/commonExports";

// devex column chooser exports
import { dashboard_questions_initialState } from "Components/Audit/components/AuditColumnChooser/initialsStatesForColumnChooser";
import { getSavedColumn } from "Components/Audit/components/AuditColumnChooser/AuditColumnChooserAPI";
import AuditColumnChooser from "Components/Audit/components/AuditColumnChooser/AuditColumnChooser";
import { dashboardQuestionColumns } from "Components/Audit/components/AuditColumnChooser/ColumnChooserConstants";

// devex filter imports
import {
  auditDashboardQuestionObjKey,
  dashboard_assignment_question_search_filter_list,
  dashboar_assignment_question_indivisual_filter_list,
} from "Components/Audit/components/AuditFilters/filterConstants";
import { createCustomAuditDataGridStore } from "Components/Audit/components/AuditFilters/filter";
import { handleColumnChange } from "Components/Audit/components/AuditFilters/columnChange";

import RequiredDocPopup from "Components/Audit/components/CustomCells/RequiredDocPopup";
import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";
import { isAuditFiltersApplied } from "Components/Audit/components/AuditFilters/commonFunctions";
import useCustomFilter from "Components/Audit/components/AuditFilters/customHook";
import { remoteOperations } from "Components/Audit/constants/datagrid.config";
const {
  DataGrid,
  ColumnFixing,
  Column,
  RequiredRule,
  SearchPanel,
  Export,
  Toolbar,
  Item,
  GroupPanel,
  Selection,
  Grouping,
  ColumnChooser,
  HeaderFilter,
} = DevExtremeComponents;

function Questionnaire({ assignmentName }) {
  const history = useHistory();
  const userTypeNo = useSelector(
    (state) => state?.auth?.loginInfo?.auditUserType
  );
  const assignmentId = history?.location?.state?.assignmentId || "";
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isFileUploadInProgress, uploadFile] = useFileUpload();
  const [isShowComments, setIsShowComments] = useState(false);
  const [commentsData, setCommentsData] = useState([]);
  const [currentOpenedQuestionComment, setCurrentOpenedQuestionComment] =
    useState("");
  const dispatch = useDispatch();
  const isSuccess = useSelector(
    (state) => state?.AuditReducer?.submitAnswerModalStatus?.isSuccess
  );
  const tableRef = useRef();
  const devexRef = useRef();
  const tableScrollableHeight = useScrollableHeight(tableRef, 48, [
    tableRef,
    dataSource,
  ]);

  const markAsCompleteSuccess = useSelector(
    (state) => state?.AuditReducer?.markAsCompleteModal?.isSuccess
  );

  const [requiredDocPopup, setRequiredDocPopup] = useState({
    show: false,
    data: {},
  });

  const [visible, setVisible] = useState(false);
  const [defaultVisibleColumns, setDefaultVisibleColumns] = useState(
    JSON.parse(JSON.stringify(dashboard_questions_initialState))
  );

  const customClearFilter = useCustomFilter(
    devexRef,
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

  const fetchTblData = useCallback(async () => {
    const payload = { assignment_id: assignmentId };
    const CustomDataStore = createCustomAuditDataGridStore(
      "audit.api.getQuestionBasedonAssignmentAndUser",
      auditDashboardQuestionObjKey,
      dashboard_assignment_question_search_filter_list,
      dashboar_assignment_question_indivisual_filter_list,
      payload,
      "question_id"
    );
    setDataSource(CustomDataStore);
  }, [assignmentId]);

  const AssignToComponent = (data) => {
    const { assigned_to, assigned_to_email } = data?.data?.data;
    return (
      <span title={assigned_to_email} className={styles.customDataCell}>
        {assigned_to || "-"}
      </span>
    );
  };

  const CommentsTemplateAction = (data) => {
    const {
      question_id,
      field_type,
      answer_option,
      question,
      status,
      questionare_answer_id,
    } = data?.data;
    return (
      <div className="d-flex align-items-center justify-content-center">
        <IconButton
          variant="iconButtonPrimary"
          disabledVariant="iconButtonPrimaryDisabled"
          description={<MdOutlineQuestionAnswer />}
          size="none"
          disabled={
            field_type === "attachment" ||
            userTypeNo === 9 ||
            userTypeNo === 16 ||
            userTypeNo === 13
          }
          onClick={() => {
            dispatch(
              submitAnswerModalActions.openModal({
                questionId: question_id,
                fieldType: field_type,
                status: status,
                assignmentId: assignmentId,
                answer_option:
                  typeof answer_option === "string"
                    ? JSON.parse(answer_option)
                    : answer_option,
                question,
                isOpen: true,
                // evalString: getAssignmentQuestionnarie,
              })
            );
            if (questionare_answer_id)
              dispatch(
                submitAnswerModalActions.getSubmitedAnwer(questionare_answer_id)
              );
          }}
        />
      </div>
    );
  };
  const AddTemplateAction = (data) => {
    const { question_id, attachment_type, field_type, status } = data.data;
    return (
      <div className={styles.fileInput}>
        <label
          className={`${
            status === "Complied" ||
            field_type !== "attachment" ||
            userTypeNo === 9 ||
            userTypeNo === 16 ||
            userTypeNo === 13
              ? styles.addIconButtonDisabled
              : styles.addIconButton
          }`}
        >
          <input
            type="file"
            multiple
            disabled={
              status === "Complied" ||
              field_type !== "attachment" ||
              userTypeNo === 9 ||
              userTypeNo === 16 ||
              userTypeNo === 13
            }
            onChange={(e) => handleAddDocs(e, question_id)}
            accept={getFileExtensions(attachment_type)}
          />
          <MdAdd />
        </label>
      </div>
    );
  };
  const handleAddDocs = async (e, question_id) => {
    const isFileUploaded = await uploadFile(
      e,
      auditApi.addDocsInQuestionnarie,
      {
        question_id,
        assignment_id: assignmentId,
      }
    );
    if (isFileUploaded) {
      fetchTblData();
    }
  };

  const markAsComplete = (data) => {
    const { question_id, status, question, is_answer_submitted } = data?.data;
    return (
      <div className="d-flex align-items-center justify-content-center">
        <IconButton
          variant="iconButtonPrimary"
          disabledVariant={
            status === "Complied"
              ? "iconButtonPrimaryFinish"
              : "iconButtonPrimaryDisabled"
          }
          disabled={
            !is_answer_submitted ||
            status === "Complied" ||
            userTypeNo === 9 ||
            userTypeNo === 16 ||
            userTypeNo === 13
          }
          className={`${styles.tableIconButton} mr-2 ${styles.messageNotificationDot} mr-2`}
          description={<AiFillCheckCircle />}
          onClick={() => {
            dispatch(
              setMarkAsCompleteModalOpen({
                isOpen: true,
                status: "Complied",
                questionId: question_id,
                assignmentId: assignmentId,
                question: question,
                section: "",
                heading: "Do you want To Mark As Complete",
                isSuccess: false,
              })
            );
          }}
          size="none"
        />
      </div>
    );
  };

  // function to fire comment
  const questionComments = (data) => {
    const { question_id, assignment_id } = data?.data;
    return (
      <div className="d-flex align-items-center justify-center">
        <IconButton
          variant="iconButtonPrimary"
          className={`${styles.tableIconButton} mr-2`}
          description={<MdTextsms />}
          size="none"
          onClick={() => {
            setCurrentOpenedQuestionComment(question_id);
            setIsShowComments(!isShowComments);
            getQuestionComments(question_id, assignment_id);
          }}
          disabledVariant="iconButtonPrimaryDisabled"
        />
      </div>
    );
  };
  //function to set Comment
  const setQuestionComment = async (content) => {
    const resp = await axiosInstance.post(
      "audit.api.SetQuestionQuestionnaireComment",
      {
        assignment_id: assignmentId,
        question_id: currentOpenedQuestionComment,
        content,
      }
    );
    if (resp) {
      const { data, status } = resp;
      if (data && status === 200 && data?.message?.status === true) {
        getQuestionComments();
      }
    }
  };

  // function to get Comments
  const getQuestionComments = async (question_id, assignment_id) => {
    setIsLoading(true);
    const resp = await axiosInstance.post("audit.api.GetQuestionComments", {
      question_id: question_id || currentOpenedQuestionComment,
      assignment_id: assignment_id || assignmentId,
    });
    if (resp?.status === 200 && resp?.data?.message?.status === true) {
      setCommentsData(resp?.data?.message?.comment_list || []);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const SubmitedDocsFunction = (data) => SubmitedDocs(data, fetchTblData);
  const QuestionReference = (data) =>
    SubmitedDocsQuestionReferences(data, fetchTblData);

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

  useEffect(() => {
    fetchTblData();
    getSavedColumn(
      defaultVisibleColumns,
      setDefaultVisibleColumns,
      "Questions"
    );
  }, []);

  useEffect(() => {
    if (isSuccess || markAsCompleteSuccess) {
      fetchTblData();
    }
  }, [isSuccess, markAsCompleteSuccess]);

  return (
    <>
      <BackDrop isLoading={isLoading} />
      {/* <Container variant="container"> */}
      <div ref={tableRef} className="auditDevexCustomizations">
        <DataGrid
          keyExpr={"question_id"}
          id="dataGrid"
          dataSource={dataSource}
          repaintChangesOnly={true}
          ref={devexRef}
          remoteOperations={remoteOperations}
          columnAutoWidth={false}
          allowColumnReordering={true}
          wordWrapEnabled={true}
          paging={false}
          onExporting={(e) =>
            exportValidation(dataSource?.length, e, dashBoardFileExportName())
          }
          onOptionChanged={(e) =>
            handleColumnChange(
              e,
              defaultVisibleColumns,
              setDefaultVisibleColumns,
              devexRef
            )
          }
          export={{
            allowExportSelectedData: true,
            enabled: true,
          }}
          showColumnLines={false}
          showBorders={false}
          showRowLines={false}
          selection={{
            mode: "multiple",
            showCheckBoxesMode: "always",
          }}
          height={tableScrollableHeight}
          width="100%"
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
            minWidth={150}
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
            dataField="questionnaire_section"
            caption="Section Name"
            minWidth={200}
            cellRender={auditTableCell}
            headerCellRender={customHeaderCell}
            allowSorting={true}
            visible={
              defaultVisibleColumns?.find(
                (e) => e.title === "questionnaire_section"
              )?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find(
                (e) => e.title === "questionnaire_section"
              ).filter_value
            }
            filterType={
              defaultVisibleColumns.find(
                (e) => e.title === "questionnaire_section"
              ).filterType
            }
          >
            <RequiredRule />
          </Column>
          <Column
            dataField="question"
            caption="Questions"
            minWidth={200}
            headerCellRender={customHeaderCell}
            cellRender={(e) => auditPopupCell(e, "Question")}
            alignment="left"
            allowSorting={true}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "question")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "question")
                .filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "question")
                .filterType
            }
          />
          <Column
            dataField="reference_document"
            caption="Reference"
            minWidth={150}
            headerCellRender={customHeaderCell}
            cellComponent={QuestionReference}
            alignment="left"
            allowHeaderFiltering={false}
            allowSorting={false}
            visible={
              defaultVisibleColumns?.find(
                (e) => e.title === "reference_document"
              )?.is_visible
            }
          />
          <Column
            dataField="assigned_to_email"
            caption="Assigned To"
            allowSorting={false}
            headerCellRender={customHeaderCell}
            cellComponent={AssignToComponent}
            alignment="left"
            minWidth={150}
            visible={
              defaultVisibleColumns?.find(
                (e) => e.title === "assigned_to_email"
              )?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "assigned_to_email")
                .filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "assigned_to_email")
                .filterType
            }
          />
          <Column
            dataField="attachment_type"
            caption="Required Docs."
            allowSorting={false}
            headerCellRender={customHeaderCell}
            cellRender={viewRequirements}
            alignment={"center"}
            width={"80px"}
            allowExporting={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "attachment_type")
                ?.is_visible
            }
            allowHeaderFiltering={false}
          />
          <Column
            dataField="submitted_doc"
            caption="Submitted Docs."
            allowSorting={false}
            headerCellRender={customHeaderCell}
            // cellRender={requireDocument}
            cellComponent={SubmitedDocsFunction}
            alignment="center"
            width={"140px"}
            allowExporting={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "submitted_doc")
                ?.is_visible
            }
            allowHeaderFiltering={false}
          />
          <Column
            caption="Add Docs."
            cellRender={AddTemplateAction}
            allowSorting={false}
            headerCellRender={customHeaderCell}
            alignment="center"
            width={"80px"}
            allowExporting={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "Add_Docs")
                ?.is_visible
            }
            allowHeaderFiltering={false}
          />
          <Column
            dataField="mark_as_complete"
            caption="Mark As Complete"
            allowSorting={true}
            headerCellRender={customHeaderCell}
            cellRender={markAsComplete}
            alignment="left"
            width={"80px"}
            allowExporting={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "mark_as_complete")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "mark_as_complete")
                .filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "mark_as_complete")
                .filterType
            }
          />
          <Column
            caption="Answers"
            headerCellRender={customHeaderCell}
            cellRender={CommentsTemplateAction}
            alignment="center"
            allowSorting={false}
            width={"80px"}
            allowExporting={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "Answers")
                ?.is_visible
            }
            allowHeaderFiltering={false}
          />
          <Column
            caption="Comments"
            headerCellRender={customHeaderCell}
            cellRender={questionComments}
            alignment="center"
            allowSorting={false}
            width={"100px"}
            allowExporting={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "Comments")
                ?.is_visible
            }
            allowHeaderFiltering={false}
          />

          <Column
            dataField="start_date"
            caption="Start Date"
            allowSorting={true}
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
            caption="End Date"
            allowSorting={true}
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
          <ColumnFixing enabled={true} />
          <SearchPanel visible={true} />
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
          defaultColumns={dashboardQuestionColumns}
          view="Questions"
        />
        <MarkAsComplete />
        <SubmitAnswerModal />
        <CommentSection
          isVisible={isShowComments}
          onClose={() => {
            setIsShowComments(false);
            setCommentsData([]);
            setCurrentOpenedQuestionComment("");
          }}
          comments={commentsData}
          onSend={setQuestionComment}
        />
        <ProjectManagementModal
          title="Required attachment format"
          visible={requiredDocPopup.show}
          onClose={closeRequiredPopup}
        >
          <RequiredDocPopup data={requiredDocPopup.data} />
        </ProjectManagementModal>
      </div>
    </>
  );
}

export default Questionnaire;
