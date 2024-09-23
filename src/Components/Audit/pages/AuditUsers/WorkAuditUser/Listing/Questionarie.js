import {
  DataGrid,
  Column,
  SearchPanel,
  Selection,
  Export,
  Toolbar,
  FilterRow,
  Item,
} from "devextreme-react/data-grid";
import React, { useState, useEffect } from "react";
import { MdAdd, MdTextsms } from "react-icons/md";
import IconButton from "../../../../components/Buttons/IconButton";
import { Input } from "../../../../components/Inputs/Input";
import styles from "./style.module.scss";
import { useHistory } from "react-router";
import axiosInstance from "../../../../../../apiServices";
import { toast } from "react-toastify";
import BackDrop from "../../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import AttachmentTypeCustomCell from "../../../../components/CustomCells/AttachmentTypeCell";
import SubmitedDocs from "../../../../components/CustomCells/SubmittedDocs";
import { submitAnswerModalActions } from "../../../../redux/submitAnswersModalActions";
import { useDispatch, useSelector } from "react-redux";
import SubmitAnswerModal from "../../../../components/SubmitAnswerModal";
import { getFileExtensions } from "Components/Audit/components/Helpers/string.helpers";
import useFileUpload from "SharedComponents/Hooks/FileUpload.hook";
import auditApi from "Components/Audit/api";
import { customHeaderCell, exportGrid } from "Components/Audit/constants/CommonFunction";

const Questionaire = () => {
  const history = useHistory();
  const email = history?.location?.state?.email || "";
  const isCompleted =
    history?.location?.pathname?.includes("complete-work") || false;
  const [isLoading, setIsLoading] = useState(false);
  const [questionnarieData, setQuestionnarieData] = useState([]);
  const [isFileUploadInProgress, uploadFile] = useFileUpload();

  const { isSuccess } = useSelector(
    (state) => state?.AuditReducer?.submitAnswerModalStatus
  );
  const loggedInUserEmail = useSelector(
    (state) => state?.auth?.loginInfo?.email
  );
  const userTypeNo = useSelector((state) => state?.auth?.loginInfo?.auditUserType);

  const dispatch = useDispatch();

  // function to get list data for Questionarie
  const getQuestionnarie = async () => {
    try {
      setIsLoading(true);
      const { data, status } = await axiosInstance.post(
        "audit.api.getUserWiseQQ",
        {
          user: email,
          completed: isCompleted ? 1 : 0,
        }
      );
      if (status === 200 && data?.message?.status) {
        const questions = data?.message?.question_list || [];
        setQuestionnarieData(questions);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        toast.error(data?.message?.status_response || "something went wrong");
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
      questionare_answer_id,
      assignment_id,
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
                // evalString: getAssignmentQuestionnarie,
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

  const AddTemplateAction = (data) => {
    const {
      question_id,
      assignment_id,
      complied,
      field_type,
      attachment_type,
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

  const compliedNotComplied = (e, assignment_id, question_id) => {
    const formData = new FormData();
    formData.append("assignment_id", assignment_id);
    formData.append("question_id", question_id);
    formData.append("complied", e.target.value);
    try {
      axiosInstance
        .post("audit.api.AnswerQuestionnaire", formData)
        .then((res) => {
          if (res?.data?.message?.status) {
            toast.success(res?.data?.message?.status_response);
          } else {
            toast.warning(res?.data?.message?.status_response);
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    } catch (err) {}
  };

  const dropdownAction = (data) => {
    const { assignment_id, question_id, complied } = data?.data;
    return (
      <div className="d-flex align-items-center">
        <Input
          placeholder={complied || "select"}
          type="select"
          variant="tableDataSelectInput"
          onChange={(e) => compliedNotComplied(e, assignment_id, question_id)}
          valueForDropDown={["Complied", "Not Complied", "Not Applicable"]}
        />
      </div>
    );
  };

  const SubmitedDocsFunction = (data) => SubmitedDocs(data, getQuestionnarie);

  useEffect(() => {
    getQuestionnarie();
  }, []);
  useEffect(() => {
    if (isSuccess) {
      getQuestionnarie();
    }
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
          caption="Questions"
          cellRender={customDataCell}
          headerCellRender={customHeaderCell}
        />
        <Column
          dataField="start_date"
          caption="Start Date"
          cellRender={customDataCell}
          headerCellRender={customHeaderCell}
        />
        <Column
          dataField="end_date"
          cellRender={customDataCell}
          headerCellRender={customHeaderCell}
        />
        <Column
          caption="Required Doc."
          dataField="attachment_type"
          cellRender={AttachmentTypeCustomCell}
          headerCellRender={customHeaderCell}
        />
        <Column
          caption="Submitted Docs"
          cellComponent={SubmitedDocsFunction}
          headerCellRender={customHeaderCell}
          dataField="submitted_doc"
          alignment="center"
        />
        <Column
          caption="Add Docs"
          cellRender={AddTemplateAction}
          headerCellRender={customHeaderCell}
          alignment="left"
        />
        <Column
          dataField="Comment"
          caption="Comments"
          cellRender={CommentsTemplateAction}
          headerCellRender={customHeaderCell}
        />
        <Column cellRender={dropdownAction} caption="status" alignment="left" />
        <Export enabled={true} />
        <FilterRow visible={true} />
        <Selection mode="single" />
      </DataGrid>
    </div>
  );
};

export default Questionaire;
