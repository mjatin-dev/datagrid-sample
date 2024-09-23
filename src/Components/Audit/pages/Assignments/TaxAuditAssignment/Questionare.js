import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import { useParams, useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import SubmitedDocs, {
  SubmitedDocsQuestionReferences,
} from "../../../components/CustomCells/SubmittedDocs";
import BackDrop from "../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import SubmitAnswerModal from "../../../components/SubmitAnswerModal";
import Button from "Components/Audit/components/Buttons/Button";
import {
  AssignToComponentQuestions,
  auditTableCell,
  customHeaderCell,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
import { auditDateFormater } from "CommonModules/Utils/helperfunctions";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import axiosInstance from "apiServices";
import { BACKEND_BASE_URL } from "apiServices/baseurl";
import {
  setAssignmentDetail,
  setLongTextPoup,
} from "Components/Audit/redux/actions";
import DevExtremeComponents from "Components/Audit/constants/DevEx/commonExports";
import { MdInfo, MdOutlineQuestionAnswer } from "react-icons/md";
import { submitAnswerModalActions } from "Components/Audit/redux/submitAnswersModalActions";
import IconButton from "Components/Audit/components/Buttons/IconButton";
import AuditColumnChooser from "Components/Audit/components/AuditColumnChooser/AuditColumnChooser";
import { assignmentListViewQuestions } from "Components/Audit/components/AuditColumnChooser/ColumnChooserConstants";
import { getSavedColumn } from "Components/Audit/components/AuditColumnChooser/AuditColumnChooserAPI";
import { assignment_List_View_Questions } from "Components/Audit/components/AuditColumnChooser/initialsStatesForColumnChooser";
import RequiredDocPopup from "Components/Audit/components/CustomCells/RequiredDocPopup";
import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";

// devex filter imports
import {
  auditAssignmenQuestiontlistObjKey,
  assignment_question_list_search_filter_list,
  assignment_question_list_indivisual_filter_list,
} from "Components/Audit/components/AuditFilters/filterConstants";
import { createCustomAuditDataGridStore } from "Components/Audit/components/AuditFilters/filter";
import { handleColumnChange } from "Components/Audit/components/AuditFilters/columnChange";
import useCustomFilter from "Components/Audit/components/AuditFilters/customHook";
import { isAuditFiltersApplied } from "Components/Audit/components/AuditFilters/commonFunctions";
import { remoteOperations } from "Components/Audit/constants/datagrid.config";

const {
  DataGrid,
  Column,
  SearchPanel,
  Selection,
  Export,
  Toolbar,
  GroupPanel,
  Grouping,
  Item,
  FilterRow,
  ColumnChooser,
  HeaderFilter,
} = DevExtremeComponents;

const Questionnaire = ({ auditName }) => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const userTypeNp = useSelector(
    (state) => state?.auth?.loginInfo?.auditUserType
  );
  const assignmentQuestionnarie = useSelector(
    (state) => state?.AuditReducer?.assignmentData?.questionnarie
  );
  // const isLoading = useSelector(
  //   (state) => state?.AuditReducer?.assignmentData?.isLoading
  // );
  const dispatch = useDispatch();
  const { id } = useParams();

  const tableRef = useRef();
  const devExRef = useRef();
  const tableScrollableHeight = useScrollableHeight(tableRef, 48, [
    tableRef,
    data,
  ]);

  const [requiredDocPopup, setRequiredDocPopup] = useState({
    show: false,
    data: {},
  });

  const [visible, setVisible] = useState(false);
  const [defaultVisibleColumns, setDefaultVisibleColumns] = useState(
    JSON.parse(JSON.stringify(assignment_List_View_Questions))
  );

  //custom hook to clear filter
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

  const fetchTblData = async () => {
    const payload = { assignment_id: id };
    const CustomDataStore = createCustomAuditDataGridStore(
      "audit.api.getQuestionsBasedonAssignment",
      auditAssignmenQuestiontlistObjKey,
      assignment_question_list_search_filter_list,
      assignment_question_list_indivisual_filter_list,
      payload,
      "question_id"
    );
    setData(CustomDataStore);
  };

  const fetchAndSetAuditBasicDetail = async (id) => {
    const apiResponse = await axiosInstance.get(
      `${BACKEND_BASE_URL}audit.api.AssignmentDetails`,
      {
        params: {
          assignment_id: id,
        },
      }
    );
    if (apiResponse?.data?.message?.status === true) {
      dispatch(setAssignmentDetail(apiResponse?.data?.message?.data));
    }
  };

  const onAssign = () => {
    history.replace({
      pathname: `${history?.location?.pathname}/assignQuestionQuestionarie`,
      state: {
        id: id,
        path: history?.location?.pathname,
      },
    });
  };

  const CommentsTemplateAction = (data) => {
    const {
      question_id,
      field_type,
      answer_option,
      question,
      questionare_answer_id,
    } = data?.data;
    return (
      <div className="d-flex align-items-center justify-content-center">
        <IconButton
          variant="iconButtonPrimary"
          description={<MdOutlineQuestionAnswer />}
          size="none"
          disabled={field_type === "attachment"}
          onClick={() => {
            dispatch(
              submitAnswerModalActions.openModal({
                questionId: question_id,
                status: "Complied",
                fieldType: field_type,
                assignmentId: id,
                answer_option:
                  typeof answer_option === "string"
                    ? JSON.parse(answer_option)
                    : answer_option,
                question,
                isOpen: true,
              })
            );
            if (questionare_answer_id)
              dispatch(
                submitAnswerModalActions.getSubmitedAnwer(questionare_answer_id)
              );
          }}
          disabledVariant="iconButtonPrimaryDisabled"
        />
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
          <span className={`${styles.customDataCell} d-block w-100 `}>-</span>
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
    fetchAndSetAuditBasicDetail(id);
    getSavedColumn(
      defaultVisibleColumns,
      setDefaultVisibleColumns,
      "Assignment Questions"
    );
  }, []);

  // useEffect(() => {
  //   if (assignmentQuestionnarie && assignmentQuestionnarie.length > 0) {
  //     setData([...assignmentQuestionnarie]);
  //   }
  // }, [assignmentQuestionnarie]);

  return (
    <>
      {/* <BackDrop isLoading={isLoading} /> */}
      <SubmitAnswerModal />
      <ProjectManagementModal
        title="Required attachment format"
        visible={requiredDocPopup.show}
        onClose={closeRequiredPopup}
      >
        <RequiredDocPopup data={requiredDocPopup.data} />
      </ProjectManagementModal>
      <div className="table-cell auditDevexCustomizations" ref={tableRef}>
        <DataGrid
          id="dataGrid"
          keyExpr={"question_id"}
          dataSource={data}
          columnAutoWidth={false}
          allowColumnReordering={true}
          showColumnLines={false}
          showBorders={false}
          ref={devExRef}
          showRowLines={false}
          wordWrapEnabled={true}
          height={tableScrollableHeight}
          width="100%"
          padding="500px"
          selection={{
            mode: "multiple",
            showCheckBoxesMode: "always",
          }}
          scrolling={{
            columnRenderingMode: "standard",
            mode: "standard",
            preloadEnabled: false,
            renderAsync: undefined,
            rowRenderingMode: "virtual",
            scrollByContent: true,
            scrollByThumb: false,
            showScrollbar: "onHover",
            useNative: "auto",
          }}
          onExporting={(e) =>
            exportValidation(data?.length, e, `${auditName}(Questions)`)
          }
          export={{
            allowExportSelectedData: true,
            enabled: true,
          }}
          columnChooser={{
            enabled: false,
          }}
          sorting={{
            mode: "multiple",
          }}
          remoteOperations={remoteOperations}
          onOptionChanged={(e) =>
            handleColumnChange(
              e,
              defaultVisibleColumns,
              setDefaultVisibleColumns,
              devExRef
            )
          }
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
            <Item name="searchPanel" />
            <Item name="exportButton" />
            <Item
              name="columnChooserButton"
              locateInMenu="auto"
              location="after"
            />
            <Item name="groupPanel" location="before" />
            <Item>
              {(userTypeNp === 8 || userTypeNp === 3) && (
                <Button
                  variant="iconButtonPrimary"
                  className={`${styles.tableIconButton} mr-2 ${styles.messageNotificationDot} mr-2`}
                  description="Assign Questionnaire"
                  onClick={onAssign}
                  size="small"
                />
              )}
            </Item>
          </Toolbar>
          <SearchPanel visible={true} />
          <HeaderFilter visible={true} filter allowSearch={true} />
          <ColumnChooser enabled={false} />
          <Column
            dataField="questionnaire_section"
            caption="Section Name"
            allowSorting={true}
            cellRender={auditTableCell}
            minWidth={150}
            headerCellRender={customHeaderCell}
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
          />
          <Column
            dataField="question"
            caption="Questions"
            allowSorting={true}
            cellRender={(e) => auditPopupCell(e, "Question")}
            minWidth={150}
            headerCellRender={customHeaderCell}
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
            dataField="start_date"
            allowSorting={true}
            caption="Start Date"
            width={"100px"}
            cellRender={auditDateFormater}
            headerCellRender={customHeaderCell}
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
            width={"100px"}
            cellRender={auditDateFormater}
            headerCellRender={customHeaderCell}
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
            dataField="assigned_to_email"
            allowSorting={false}
            caption="Assign To"
            cellRender={AssignToComponentQuestions}
            minWidth={100}
            headerCellRender={customHeaderCell}
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
            allowSorting={false}
            caption="Required Doc"
            cellRender={viewRequirements}
            headerCellRender={customHeaderCell}
            alignment="center"
            allowExporting={false}
            width={"80px"}
            allowHeaderFiltering={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "attachment_type")
                ?.is_visible
            }
          />
          <Column
            caption="Submitted Docs"
            allowSorting={false}
            cellComponent={SubmitedDocs}
            headerCellRender={customHeaderCell}
            dataField="submitted_doc"
            width={"130px"}
            alignment="center"
            allowExporting={false}
            allowHeaderFiltering={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "submitted_doc")
                ?.is_visible
            }
          />
          <Column
            caption="Reference"
            allowSorting={false}
            cellComponent={SubmitedDocsQuestionReferences}
            headerCellRender={customHeaderCell}
            dataField="reference_document"
            width={"130px"}
            alignment="center"
            allowExporting={false}
            allowHeaderFiltering={false}
            visible={
              defaultVisibleColumns?.find(
                (e) => e.title === "reference_document"
              )?.is_visible
            }
          />
          <Column
            caption="Answer"
            allowSorting={false}
            headerCellRender={customHeaderCell}
            cellRender={CommentsTemplateAction}
            alignment="center"
            width={"80px"}
            allowHeaderFiltering={false}
            allowExporting={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "answers")
                ?.is_visible
            }
          />
          <Grouping contextMenuEnabled={true} />
          <GroupPanel visible={true} allowColumnDragging={true} />
          <Export enabled={true} />
          {/* <FilterRow visible={true} /> */}
          <Selection mode="single" />
        </DataGrid>
        <AuditColumnChooser
          container="#dataGrid"
          button="#myColumnChooser"
          visible={visible}
          onHiding={onHiding}
          columns={defaultVisibleColumns}
          onApply={onApply}
          defaultColumns={assignmentListViewQuestions}
          view="Assignment Questions"
        />
      </div>
    </>
  );
};
export default Questionnaire;
