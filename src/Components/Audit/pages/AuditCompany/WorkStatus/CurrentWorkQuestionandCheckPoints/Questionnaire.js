import React, { useState, useEffect, useRef } from "react";
import { MdAdd, MdTextsms } from "react-icons/md";
import IconButton from "../../../../components/Buttons/IconButton";
import { Input } from "../../../../components/Inputs/Input";
import styles from "./style.module.scss";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import axiosInstance from "../../../../../../apiServices";
import BackDrop from "../../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import SubmitedDocs from "../../../../components/CustomCells/SubmittedDocs";
import AttachmentTypeCustomCell from "../../../../components/CustomCells/AttachmentTypeCell";
import { submitAnswerModalActions } from "../../../../redux/submitAnswersModalActions";
import { useDispatch, useSelector } from "react-redux";
import SubmitAnswerModal from "../../../../components/SubmitAnswerModal";
import auditApi from "../../../../api";
import {
  getFileExtensions,
  getTruncatedString,
} from "Components/Audit/components/Helpers/string.helpers";
import useFileUpload from "SharedComponents/Hooks/FileUpload.hook";
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
  FilterRow,
  Item,
  GroupPanel,
} = DevExtremeComponents;

const Questionnaire = () => {
  const history = useHistory();
  const companyId = history?.location?.state?.company || "";
  const assignment_id = history?.location?.state?.assignment_id || "";
  const [isLoading, setIsLoading] = useState(true);
  const [isFileUploadInProgress, uploadFile] = useFileUpload();
  const [dataSource, setdataSource] = useState([]);

  const tableRef = useRef();
  const tableScrollableHeight = useScrollableHeight(tableRef, 48, [
    tableRef,
    dataSource,
  ]);

  const { isSuccess } = useSelector(
    (state) => state?.AuditReducer?.submitAnswerModalStatus
  );
  const userTypeNo = useSelector(
    (state) => state?.auth?.loginInfo?.auditUserType
  );

  const dispatch = useDispatch();

  //function to get branch list
  const getQuestionnaire = async () => {
    try {
      const resp = await axiosInstance.post(
        "audit.api.getCompanyWiseQuestion",
        { completed: 0, company: companyId, assignment_id: assignment_id }
      );
      if (resp) {
        const { data } = resp;
        if (data?.message) {
          setdataSource(data.message);
        }
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
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
      getQuestionnaire();
    }
  };

  const AddTemplateAction = (data) => {
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
            getQuestionnaire();
          } else {
            toast.warning(res?.data?.message?.status_response);
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    } catch (err) {}
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

  const statusAction = (data) => {
    const { assignment_id, question_id, complied } = data?.data;
    return (
      <div className="d-flex align-items-center">
        <Input
          placeholder={complied || "select"}
          type="select"
          disabled={userTypeNo === 9 || userTypeNo === 16 || userTypeNo === 13}
          variant="tableDataSelectInput"
          valueForDropDown={["Complied", "Not Complied", "Not Applicable"]}
          onChange={(e) => compliedNotComplied(e, assignment_id, question_id)}
        />
      </div>
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
          columnAutoWidth={true}
          allowColumnReordering={true}
          paging={false}
          showColumnLines={false}
          height={tableScrollableHeight}
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
            exportValidation(
              dataSource?.length,
              e,
              `Current Work Questionnaire`
            )
          }
          export={{
            allowExportSelectedData: true,
            enabled: true,
          }}
        >
          <Toolbar>
            <Item name="groupPanel" />
            <Item name="exportButton" />
            <Item name="searchPanel" />
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
            dataField="assigned_to"
            caption="Assign To"
            cellRender={assignedTo}
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
            caption="Required Document"
            cellRender={AttachmentTypeCustomCell}
            headerCellRender={customHeaderCell}
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
            caption="Add Docs"
            cellRender={AddTemplateAction}
            headerCellRender={customHeaderCell}
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

          <Column
            caption="Status"
            dataField="complied"
            cellRender={statusAction}
            alignment="left"
          />
          <Export enabled={true} />
          <GroupPanel visible={true} allowColumnDragging={true} />
          <Selection mode="single" />
          <FilterRow visible={true} />
        </DataGrid>
      </div>
    </>
  );
};
export default Questionnaire;
