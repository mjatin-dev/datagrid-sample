import React, { useEffect, useRef, useState } from "react";
import styles from "../../WorkStatus/style.module.scss";
import IconButton from "../../../../components/Buttons/IconButton";
import { MdTextsms } from "react-icons/md";
import { useHistory } from "react-router";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import axiosInstance from "../../../../../../apiServices";
import BackDrop from "../../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import SubmitedDocs from "../../../../components/CustomCells/SubmittedDocs";
import AttachmentTypeCustomCell from "../../../../components/CustomCells/AttachmentTypeCell";
import { submitAnswerModalActions } from "../../../../redux/submitAnswersModalActions";
import { useDispatch, useSelector } from "react-redux";
import SubmitAnswerModal from "../../../../components/SubmitAnswerModal";
import { auditDateFormater } from "CommonModules/Utils/helperfunctions";
import {
  customHeaderCell,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
import { getTruncatedString } from "Components/Audit/components/Helpers/string.helpers";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import DevExtremeComponents from "Components/Audit/constants/DevEx/commonExports";
const {
  DataGrid,
  ColumnFixing,
  Column,
  FilterRow,
  SearchPanel,
  Export,
  Toolbar,
  Item,
  GroupPanel,
  Selection,
  Grouping,
} = DevExtremeComponents;

function Questionnaire() {
  const history = useHistory();
  const companyId = history?.location?.state?.company || "";
  const assignment_id = history?.location?.state?.assignment_id || "";
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setdataSource] = useState([]);
  const dispatch = useDispatch();
  const { isSuccess } = useSelector(
    (state) => state?.AuditReducer?.submitAnswerModalStatus
  );
  const tableRef = useRef();
  const tableScrollableHeight = useScrollableHeight(tableRef, 48, [
    tableRef,
    dataSource,
  ]);

  useEffect(() => {
    getQuestionnaire();
  }, []);

  //function to get branch list
  const getQuestionnaire = async () => {
    try {
      const resp = await axiosInstance.post(
        "audit.api.getCompanyWiseQuestion",
        { completed: 1, company: companyId, assignment_id: assignment_id }
      );
      if (resp) {
        const { data } = resp;
        if (data?.message) {
          setdataSource(data.message);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      setIsLoading(false);
    }
  };

  const companyFieldCell = (data) => {
    const value = data?.value;
    return (
      <span className={styles.balckTextCell} title={value}>
        {getTruncatedString(value) || "-"}
      </span>
    );
  };

  const assignedTo = (data) => {
    const { assigned_to, assigned_to_name } = data?.data;
    return (
      <span className={styles.balckTextCell} title={assigned_to}>
        {getTruncatedString(assigned_to_name) || "-"}
      </span>
    );
  };

  const CommentsTemplateAction = (data) => {
    const {
      question_id,
      field_type,
      answer_option,
      question,
      questionare_answer_id,
      assignment_id,
    } = data?.data;
    return (
      <div className="d-flex align-items-center justify-content-center">
        <IconButton
          variant="iconButtonPrimary"
          description={<MdTextsms />}
          size="none"
          disabled={field_type === "attachment"}
          onClick={() => {
            dispatch(
              submitAnswerModalActions.openModal({
                questionId: question_id,
                fieldType: field_type,
                status: "Complied",
                assignmentId: assignment_id,
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

  const SubmitedDocsFunction = (data) => SubmitedDocs(data, getQuestionnaire);

  useEffect(() => {
    getQuestionnaire();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      getQuestionnaire();
    }
  }, [isSuccess]);

  return (
    <>
      <BackDrop isLoading={isLoading} />
      <SubmitAnswerModal />

      <div class="table-cell" ref={tableRef}>
        <DataGrid
          id="dataGrid"
          dataSource={dataSource}
          height={tableScrollableHeight}
          columnAutoWidth={true}
          allowColumnReordering={true}
          paging={false}
          showColumnLines={false}
          showBorders={false}
          showRowLines={false}
          wordWrapEnabled={true}
          selection={{
            mode: "multiple",
            showCheckBoxesMode: "always",
          }}
          onExporting={(e) =>
            exportValidation(
              dataSource?.length,
              e,
              `Completed Work Questionnaire`
            )
          }
          export={{
            allowExportSelectedData: true,
            enabled: true,
          }}
          width="100%"
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
        >
          <Toolbar>
            <Item name="groupPanel" />
            <Item name="exportButton" />
            <Item name="searchPanel" />
          </Toolbar>
          <Column
            dataField="audit_template_name"
            caption="Template Name"
            headerCellRender={customHeaderCell}
            cellRender={companyFieldCell}
            allowExporting={false}
          />
          <Column
            dataField="questionnaire_section"
            caption="Section Name"
            cellRender={companyFieldCell}
            headerCellRender={customHeaderCell}
          />
          <Column
            dataField="question"
            caption="Questions"
            headerCellRender={customHeaderCell}
            cellRender={companyFieldCell}
            alignment="left"
          />
          <Column
            dataField="assigned_to"
            caption="Assign To"
            headerCellRender={customHeaderCell}
            cellRender={assignedTo}
            alignment="center"
          />
          <Column
            dataField="start_date"
            caption="Start Date"
            headerCellRender={customHeaderCell}
            cellRender={auditDateFormater}
            alignment="left"
            allowExporting={false}
          />
          <Column
            dataField="to_be_completed"
            caption="end Date"
            headerCellRender={customHeaderCell}
            cellRender={auditDateFormater}
            alignment="left"
            allowExporting={false}
          />
          <Column
            dataField="attachment_type"
            caption="Required Document"
            headerCellRender={customHeaderCell}
            cellRender={AttachmentTypeCustomCell}
            alignment="left"
            allowExporting={false}
          />
          <Column
            dataField="submitted_doc"
            caption="Submited Doc"
            headerCellRender={customHeaderCell}
            cellComponent={SubmitedDocsFunction}
            alignment="left"
            allowExporting={false}
          />
          <Column
            caption="Answers"
            headerCellRender={customHeaderCell}
            cellRender={CommentsTemplateAction}
            alignment="center"
            allowExporting={false}
          />

          <ColumnFixing enabled={true} />
          <FilterRow visible={true} />
          <SearchPanel visible={true} />
          <Grouping contextMenuEnabled={true} />

          <GroupPanel visible={true} allowColumnDragging={true} />
          <Export enabled={true} />
          <Selection mode="single" />
        </DataGrid>
      </div>
    </>
  );
}

export default Questionnaire;
