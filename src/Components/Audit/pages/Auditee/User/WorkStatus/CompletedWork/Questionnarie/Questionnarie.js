import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";

import IconButton from "../../../../../../components/Buttons/IconButton";
import { MdTextsms } from "react-icons/md";
import { useHistory, useRouteMatch } from "react-router";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import axiosInstance from "../../../../../../../../apiServices";
import { toast } from "react-toastify";
import AttachmentTypeCustomCell from "../../../../../../components/CustomCells/AttachmentTypeCell";
import SubmitedDocs from "../../../../../../components/CustomCells/SubmittedDocs";
import { submitAnswerModalActions } from "../../../../../../redux/submitAnswersModalActions";
import { useDispatch } from "react-redux";
import SubmitAnswerModal from "../../../../../../components/SubmitAnswerModal";
import { auditDateFormater } from "CommonModules/Utils/helperfunctions";
import {
  customHeaderCell,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
import { getSubstring } from "CommonModules/helpers/string.helpers";
import DevExtremeComponents from "Components/Audit/constants/DevEx/commonExports";
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
} = DevExtremeComponents;

function Questionnaire() {
  const [auditTemplatesData, setAuditTemplatesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const email = history.location?.state?.email || "";
  const dispatch = useDispatch();
  const companyFieldCell = (data) => {
    const value = data?.value;
    return (
      <span className={styles.balckTextCell} title={value}>
        {(value && getSubstring(value)) || "-"}
      </span>
    );
  };

  const CommentsTemplateAction = (data) => {
    const {
      question_id,
      field_type,
      answer_option,
      question,
      assignment_id,
      questionare_answer_id,
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

  const getQuestionnarie = async () => {
    try {
      setIsLoading(true);
      const { data, status } = await axiosInstance.post(
        "audit.api.getUserWiseQQ",
        {
          user: email,
          completed: 1,
        }
      );
      if (status === 200 && data?.message?.status) {
        const questions = data?.message?.question_list || [];
        setAuditTemplatesData(questions);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        toast.error("something went wrong");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("something went wrong");
    }
  };

  const SubmitedDocsFunction = (data) => SubmitedDocs(data, getQuestionnarie);

  useEffect(() => {
    getQuestionnarie();
  }, []);

  return (
    <>
      <SubmitAnswerModal />
      <DataGrid
        id="dataGrid"
        dataSource={auditTemplatesData}
        columnAutoWidth={true}
        allowColumnReordering={true}
        paging={{ pageSize: 6 }}
        showColumnLines={false}
        showBorders={false}
        showRowLines={false}
        wordWrapEnabled={true}
        selection={{
          mode: "multiple",
          showCheckBoxesMode: "always",
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
        onExporting={(e) =>
          exportValidation(auditTemplatesData?.length, e, `Questionnaire`)
        }
        export={{
          allowExportSelectedData: true,
          enabled: true,
        }}
      >
        <Toolbar>
          <Item name="exportButton" />
          <Item name="searchPanel" />
          <Item name="groupPanel" location="before" />
        </Toolbar>
        <Column
          dataField="audit_template_name"
          caption="Template Name"
          headerCellRender={customHeaderCell}
          cellRender={companyFieldCell}
          allowExporting={false}
        >
          <RequiredRule />
        </Column>
        <Column
          dataField="audit_name"
          caption="Assignment Name"
          cellRender={companyFieldCell}
          headerCellRender={customHeaderCell}
          alignment="left"
          allowExporting={false}
        >
          <RequiredRule />
        </Column>
        <Column
          dataField="questionnaire_section"
          caption="Section Name"
          cellRender={companyFieldCell}
          headerCellRender={customHeaderCell}
        >
          <RequiredRule />
        </Column>
        <Column
          dataField="question"
          caption="Questions"
          headerCellRender={customHeaderCell}
          cellRender={companyFieldCell}
          alignment="left"
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
          dataField="end_date"
          caption="End Date"
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
          alignment="left"
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
    </>
  );
}

export default Questionnaire;
