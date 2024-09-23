import React, { useState, useEffect } from "react";
import { MdTextsms } from "react-icons/md";
import IconButton from "../../../../../../components/Buttons/IconButton";
import styles from "./style.module.scss";
import axiosInstance from "../../../../../../../../apiServices";
import { useHistory } from "react-router";
import BackDrop from "../../../../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import { toast } from "react-toastify";
import { submitAnswerModalActions } from "../../../../../../redux/submitAnswersModalActions";
import { useDispatch, useSelector } from "react-redux";
import SubmitedDocs from "../../../../../../components/CustomCells/SubmittedDocs";
import AttachmentTypeCustomCell from "../../../../../../components/CustomCells/AttachmentTypeCell";
import SubmitAnswerModal from "../../../../../../components/SubmitAnswerModal";
import { auditDateFormater } from "CommonModules/Utils/helperfunctions";
import {
  customHeaderCell,
  exportGrid,
} from "Components/Audit/constants/CommonFunction";
import DevExtremeComponents from "Components/Audit/constants/DevEx/commonExports";
const {
  DataGrid,
  Column,
  SearchPanel,
  Selection,
  Export,
  Toolbar,
  Item,
  FilterRow,
} = DevExtremeComponents;

const Questionnaire = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const email = history?.location?.state?.email || "";
  const [isLoading, setIsLoading] = useState(false);
  const [questionnarieData, setQuestionnarieData] = useState([]);

  const { isSuccess } = useSelector(
    (state) => state?.AuditReducer?.submitAnswerModalStatus
  );
  const userTypeNo = useSelector(
    (state) => state?.auth?.loginInfo?.auditUserType
  );

  // function to get list data for Questionarie
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
        setQuestionnarieData(questions);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        toast.error("something went wrong");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error("something went wrong");
    }
  };

  const customDataCell = (option) => {
    const { value } = option;
    return (
      <span title={value} className={styles.customDataCell}>
        {value || "-"}
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

  useEffect(() => {
    getQuestionnarie();
  }, []);
  useEffect(() => {
    if (isSuccess) getQuestionnarie();
  }, [isSuccess]);

  return (
    <div>
      <BackDrop isLoading={isLoading} />
      <SubmitAnswerModal />
      <DataGrid
        id="dataGrid"
        dataSource={questionnarieData}
        columnAutoWidth={true}
        onExporting={exportGrid}
        allowColumnReordering={true}
        paging={{ pageSize: 6 }}
        showColumnLines={false}
        showBorders={false}
        showRowLines={false}
        wordWrapEnabled={true}
        width="100%"
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
      >
        <Toolbar>
          <Item name="searchPanel" />
          <Item name="exportButton" />
          <Item name="groupPanel" location="before" />
        </Toolbar>
        <SearchPanel visible={true} width={250} />
        <Column
          dataField="audit_template_name"
          caption="Template Name"
          cellRender={customDataCell}
          headerCellRender={customHeaderCell}
        />
        <Column
          dataField="audit_name"
          caption="Assignment Name"
          cellRender={customDataCell}
          headerCellRender={customHeaderCell}
        />
        <Column
          dataField="questionnaire_section"
          caption="Section Name"
          cellRender={customDataCell}
          headerCellRender={customHeaderCell}
        />
        <Column
          dataField="question"
          caption="Question"
          cellRender={customDataCell}
          headerCellRender={customHeaderCell}
        />
        <Column
          dataField="start_date"
          caption="Start Date"
          cellRender={auditDateFormater}
          headerCellRender={customHeaderCell}
        />
        <Column
          dataField="end_date"
          caption="End Date"
          cellRender={auditDateFormater}
          headerCellRender={customHeaderCell}
        />
        <Column
          dataField="attachment_type"
          caption="Required Docs."
          cellRender={AttachmentTypeCustomCell}
          headerCellRender={customHeaderCell}
        />
        <Column
          caption="Submitted Docs"
          dataField="submitted_doc"
          cellComponent={SubmitedDocs}
          headerCellRender={customHeaderCell}
        />
        <Column
          dataField="Comment"
          caption="Comments"
          cellRender={CommentsTemplateAction}
          headerCellRender={customHeaderCell}
        />
        <Export enabled={true} />
        <FilterRow visible={true} />
        <Selection mode="single" />
      </DataGrid>
    </div>
  );
};

export default Questionnaire;
