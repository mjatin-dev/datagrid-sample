import React, { useEffect, useState } from "react";
import { MdAdd, MdTextsms } from "react-icons/md";
import IconButton from "../../../../../../components/Buttons/IconButton";
import styles from "./style.module.scss";
import { useHistory } from "react-router";
import axiosInstance from "../../../../../../../../apiServices";
import { toast } from "react-toastify";
import AttachmentTypeCustomCell from "../../../../../../components/CustomCells/AttachmentTypeCell";
import { submitAnswerModalActions } from "../../../../../../redux/submitAnswersModalActions";
import { useDispatch, useSelector } from "react-redux";
import SubmitedDocs from "../../../../../../components/CustomCells/SubmittedDocs";
import SubmitAnswerModal from "../../../../../../components/SubmitAnswerModal";
import { v4 as uuidv4 } from "uuid";
import auditApi from "../../../../../../api";
import { getFileExtensions } from "Components/Audit/components/Helpers/string.helpers";
import useFileUpload from "SharedComponents/Hooks/FileUpload.hook";
import { auditDateFormater } from "CommonModules/Utils/helperfunctions";
import {
  customHeaderCell,
  exportValidation,
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
  const [questionnarieData, setQuestionnarieData] = useState([]);
  const history = useHistory();
  const [isFileUploadInProgress, uploadFile] = useFileUpload();
  const email = history.location.state?.email || "";
  const userTypeNo = useSelector(
    (state) => state?.auth?.loginInfo?.auditUserType
  );

  const dispatch = useDispatch();

  const customDataCell = (option) => {
    const { value } = option;
    return (
      <span title={value} className={styles.customDataCell}>
        {value}
      </span>
    );
  };

  const getQuestionnarie = async () => {
    try {
      const { data, status } = await axiosInstance.post(
        "audit.api.getUserWiseQQ",
        {
          user: email,
          completed: 0,
        }
      );
      if (status === 200 && data?.message?.status) {
        let questions = data?.message?.question_list || [];
        questions = [...questions].map((element) => ({
          ID: uuidv4(),
          ...element,
        }));
        setQuestionnarieData(questions);
      } else {
        toast.error("something went wrong");
      }
    } catch (error) {
      toast.error("something went wrong");
    }
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

  const handleAddDocs = async (e, question_id, assignment_id) => {
    const isFileUploaded = await uploadFile(
      e,
      auditApi.addDocsInQuestionnarie,
      {
        question_id,
        assignment_id: assignment_id,
      }
    );
    if (isFileUploaded) {
      getQuestionnarie();
    }
  };

  const AddTemplateAction = (data) => {
    const {
      question_id,
      attachment_type,
      assignment_id,
      complied,
      field_type,
    } = data.data;
    return (
      <div className={styles.fileInput}>
        <label
          className={`${
            complied === "Complied" ||
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
              complied === "Complied" ||
              field_type !== "attachment" ||
              userTypeNo === 9 ||
              userTypeNo === 16 ||
              userTypeNo === 13
            }
            onChange={(e) => handleAddDocs(e, question_id, assignment_id)}
            accept={getFileExtensions(attachment_type)}
          />
          <MdAdd />
        </label>
      </div>
    );
  };

  const SubmitedDocsFunction = (data) => SubmitedDocs(data, getQuestionnarie);

  useEffect(() => {
    getQuestionnarie();
  }, []);

  return (
    <div>
      <SubmitAnswerModal />
      <DataGrid
        id="dataGrid"
        dataSource={questionnarieData}
        columnAutoWidth={true}
        allowColumnReordering={true}
        paging={{ pageSize: 6 }}
        showColumnLines={false}
        showBorders={false}
        showRowLines={false}
        wordWrapEnabled={true}
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
          exportValidation(questionnarieData?.length, e, `Questionnaire`)
        }
        export={{
          allowExportSelectedData: true,
          enabled: true,
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
          allowExporting={false}
        />
        <Column
          dataField="audit_name"
          caption="Assignment Name"
          cellRender={customDataCell}
          headerCellRender={customHeaderCell}
          allowExporting={false}
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
          allowExporting={false}
        />
        <Column
          dataField="end_date"
          caption="End Date"
          cellRender={auditDateFormater}
          headerCellRender={customHeaderCell}
          allowExporting={false}
        />

        <Column
          dataField="attachment_type"
          caption="Required Doc."
          cellRender={AttachmentTypeCustomCell}
          headerCellRender={customHeaderCell}
          allowExporting={false}
        />
        <Column
          dataField="submitted_doc"
          caption="Submitted Docs."
          cellComponent={SubmitedDocsFunction}
          headerCellRender={customHeaderCell}
          allowExporting={false}
        />
        <Column
          caption="Add Docs"
          cellRender={AddTemplateAction}
          headerCellRender={customHeaderCell}
          alignment="center"
          allowExporting={false}
        />
        <Column
          caption="Comment"
          cellRender={CommentsTemplateAction}
          headerCellRender={customHeaderCell}
          alignment="left"
          allowExporting={false}
        />
        <Export enabled={true} />
        <FilterRow visible={true} />
        <Selection mode="single" />
      </DataGrid>
    </div>
  );
};
export default Questionnaire;
