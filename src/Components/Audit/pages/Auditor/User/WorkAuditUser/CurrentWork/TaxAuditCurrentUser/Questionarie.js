import {
  DataGrid,
  Column,
  SearchPanel,
  Selection,
  Export,
  Toolbar,
  Item,
  FilterRow,
} from "devextreme-react/data-grid";
import React, { useState, useEffect } from "react";
import { MdAdd, MdTextsms } from "react-icons/md";
import IconButton from "../../../../../../components/Buttons/IconButton";
import { Input } from "../../../../../../components/Inputs/Input";
import styles from "./style.module.scss";
import { useHistory } from "react-router";
import axiosInstance from "../../../../../../../../apiServices";
import { toast } from "react-toastify";
import BackDrop from "../../../../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import AttachmentTypeCustomCell from "../../../../../../components/CustomCells/AttachmentTypeCell";
import SubmitedDocs from "../../../../../../components/CustomCells/SubmittedDocs";
import { submitAnswerModalActions } from "../../../../../../redux/submitAnswersModalActions";
import { useDispatch, useSelector } from "react-redux";
import SubmitAnswerModal from "../../../../../../components/SubmitAnswerModal";
import { getFileExtensions } from "Components/Audit/components/Helpers/string.helpers";
import useFileUpload from "SharedComponents/Hooks/FileUpload.hook";
import auditApi from "Components/Audit/api";
import { auditDateFormater } from "CommonModules/Utils/helperfunctions";
import { customHeaderCell, exportGrid } from "Components/Audit/constants/CommonFunction";

const Questionaire = () => {
  const history = useHistory();
  const email = history?.location?.state?.email || "";
  const [isLoading, setIsLoading] = useState(false);
  const [questionnarieData, setQuestionnarieData] = useState([]);
  const [isFileUploadInProgress, uploadFile] = useFileUpload();
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
          completed: 0,
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
  const { isSuccess } = useSelector(
    (state) => state?.AuditReducer?.submitAnswerModalStatus
  );
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

  const addAction = (data) => {
    const {
      question_id,
      attachment_type,
      assignment_id,
      field_type,
      complied,
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
            getQuestionnarie();
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
          type="select"
          variant="tableDataSelectInput"
          placeholder={complied || "select"}
          disabled={userTypeNo === 9 || userTypeNo === 16 || userTypeNo === 13}
          valueForDropDown={["Compiled", "Not Compiled", "Not Applicable"]}
          onChange={(e) => compliedNotComplied(e, assignment_id, question_id)}
        />
      </div>
    );
  };

  const SubmitedDocsFunction = (data) => SubmitedDocs(data, getQuestionnarie);

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
          caption="Questions"
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
          cellComponent={SubmitedDocsFunction}
          headerCellRender={customHeaderCell}
        />
        <Column
          caption="Add Docs"
          cellRender={addAction}
          headerCellRender={customHeaderCell}
          alignment="center"
        />
        <Column
          dataField="Comment"
          caption="Comments"
          cellRender={CommentsTemplateAction}
          headerCellRender={customHeaderCell}
          alignment="center"
        />
        <Column
          caption="Status"
          dataField="complied"
          alignment="center"
          cellRender={dropdownAction}
          headerCellRender={customHeaderCell}
        />
        <Export enabled={true} />
        <Selection mode="single" />
        <FilterRow visible={true} />
      </DataGrid>
    </div>
  );
};

export default Questionaire;
