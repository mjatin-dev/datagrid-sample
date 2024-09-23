/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { MdAdd, MdTextsms } from "react-icons/md";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { Input } from "Components/Audit/components/Inputs/Input";
import styles from "./style.module.scss";
import BackDrop from "CommonModules/sharedComponents/Loader/BackDrop";
import axiosInstance from "apiServices";
import AttachmentTypeCustomCell from "Components/Audit/components/CustomCells/AttachmentTypeCell";
import SubmitedDocs from "Components/Audit/components/CustomCells/SubmittedDocs";
import { useDispatch, useSelector } from "react-redux";
import { submitAnswerModalActions } from "Components/Audit/redux/submitAnswersModalActions";
import IconButton from "Components/Audit/components/Buttons/IconButton";
import SubmitAnswerModal from "Components/Audit/components/SubmitAnswerModal";
import { getFileExtensions } from "Components/Audit/components/Helpers/string.helpers";
import useFileUpload from "SharedComponents/Hooks/FileUpload.hook";
import auditApi from "Components/Audit/api";
import { auditDateFormater } from "CommonModules/Utils/helperfunctions";
import {
  customHeaderCell,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
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
  GroupPanel,
} = DevExtremeComponents;

const Questionnaire = () => {
  const history = useHistory();
  const { assignment_id } = history.location.state;
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [isFileUploadInProgress, uploadFile] = useFileUpload();
  const tableRef = useRef();
  const tableScrollableHeight = useScrollableHeight(tableRef, 48, [
    tableRef,
    dataSource,
  ]);

  const dispatch = useDispatch();

  const userTypeNo = useSelector(
    (state) => state?.auth?.loginInfo?.auditUserType
  );

  //function to get branch list
  const getUserQuestions = async () => {
    const payload = { assignment_id: assignment_id };
    try {
      const resp = await axiosInstance.post(
        "audit.api.getTemplateWiseUserQuestionnaire",
        payload
      );
      if (resp) {
        const { data } = resp;
        if (data?.message?.status) {
          setDataSource(data.message.data);
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleAddDocs = async (e, question_id, assignmentId) => {
    const isFileUploaded = await uploadFile(
      e,
      auditApi.addDocsInQuestionnarie,
      {
        question_id,
        assignment_id: assignment_id,
      }
    );
    if (isFileUploaded) {
      getUserQuestions();
    }
  };

  const updateStatusApi = async (e, assignmentId, question_id) => {
    const formData = new FormData();
    formData.append("assignment_id", assignment_id);
    formData.append("question_id", question_id);
    formData.append("complied", e.target.value);
    try {
      const resp = await axiosInstance.post(
        "audit.api.AnswerQuestionnaire",
        formData
      );
      if (resp?.data?.message?.status) {
        toast.success(resp?.data?.message?.status_response);
        getUserQuestions();
      } else {
        toast.warning(resp?.data?.message?.status_response);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const customDataCell = (option) => {
    const { value } = option;
    return (
      <span title={value} className={styles.customDataCell}>
        {value}
      </span>
    );
  };

  const AddTemplateAction = (data) => {
    const {
      question_id,
      attachment_type,
      field_type,
      complied,
      assignment_id,
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

  const statusAction = (data) => {
    const { assignment_id, question_id, complied } = data?.data;
    return (
      <div className="d-flex align-items-center">
        <Input
          type="select"
          variant="tableDataSelectInput"
          disabled={userTypeNo === 9 || userTypeNo === 16 || userTypeNo === 13}
          value={complied || "select"}
          valueForDropDown={["Complied", "Not Complied", "Not Applicable"]}
          onChange={(e) => updateStatusApi(e, assignment_id, question_id)}
        />
      </div>
    );
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

  const SubmitedDocsFunction = (data) => SubmitedDocs(data, getUserQuestions);

  useEffect(() => {
    getUserQuestions();
  }, []);

  return (
    <>
      <BackDrop isLoading={isLoading} />
      <SubmitAnswerModal />
      <div class="table-cell" ref={tableRef}>
        <DataGrid
          id="dataGrid"
          dataSource={dataSource}
          columnAutoWidth={true}
          height={tableScrollableHeight}
          allowColumnReordering={true}
          paging={false}
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
          onExporting={(e) =>
            exportValidation(dataSource?.length, e, `Questionnaire`)
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
            allowExporting={false}
          />
          <Column
            dataField="to_be_completed"
            caption="End Date"
            cellRender={auditDateFormater}
            headerCellRender={customHeaderCell}
            allowExporting={false}
          />

          <Column
            dataField="attachment_type"
            caption="Required Docs."
            cellRender={AttachmentTypeCustomCell}
            headerCellRender={customHeaderCell}
            allowExporting={false}
          />
          <Column
            caption="Submitted Docs"
            dataField="submited_doc"
            cellComponent={SubmitedDocsFunction}
            headerCellRender={customHeaderCell}
            allowExporting={false}
          />
          <Column
            caption="Add Docs"
            cellRender={AddTemplateAction}
            headerCellRender={customHeaderCell}
            alignment="left"
            allowExporting={false}
          />
          <Column
            dataField="Comment"
            caption="Comments"
            cellRender={CommentsTemplateAction}
            headerCellRender={customHeaderCell}
            allowExporting={false}
          />
          <Column
            caption="Status"
            dataField="complied"
            cellRender={statusAction}
            alignment="left"
            allowExporting={false}
          />
          <Export enabled={true} />
          <FilterRow visible={true} />
          <Selection mode="single" />
          <GroupPanel visible={true} allowColumnDragging={true} />
        </DataGrid>
      </div>
    </>
  );
};
export default Questionnaire;
