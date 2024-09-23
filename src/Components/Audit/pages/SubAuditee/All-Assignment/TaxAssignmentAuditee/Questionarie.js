import React, { useState, useEffect, useRef } from "react";
import IconButton from "Components/Audit/components/Buttons/IconButton";
import styles from "./style.module.scss";
import { useHistory } from "react-router";
import axiosInstance from "apiServices";
import { toast } from "react-toastify";

import BackDrop from "CommonModules/sharedComponents/Loader/BackDrop";
import { v4 as uuidv4 } from "uuid";
import SubmitedDocs from "Components/Audit/components/CustomCells/SubmittedDocs";
import AttachmentTypeCustomCell from "Components/Audit/components/CustomCells/AttachmentTypeCell";
import { submitAnswerModalActions } from "Components/Audit/redux/submitAnswersModalActions";
import { useDispatch } from "react-redux";
import SubmitAnswerModal from "Components/Audit/components/SubmitAnswerModal";
import { auditDateFormater } from "CommonModules/Utils/helperfunctions";
import {
  customHeaderCell,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import DevExtremeComponents from "Components/Audit/constants/DevEx/commonExports";
const {
  DataGrid,
  Column,
  SearchPanel,
  Selection,
  Export,
  Toolbar,
  Item,
  ColumnFixing,
  FilterRow,
} = DevExtremeComponents;

function Questionarie() {
  const history = useHistory();
  const assignment_id = history?.location?.state?.assignment_id || "";
  const status = history?.location?.state?.status;
  const [questionData, setQuestionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const tableRef = useRef();
  const tableScrollableHeight = useScrollableHeight(tableRef, 48, [
    tableRef,
    questionData,
  ]);

  const questionarieList = () => {
    try {
      axiosInstance
        .post("audit.api.getAssignmentQuestionare", {
          status: status,
          assignment_id: assignment_id,
        })
        .then((res) => {
          if (res?.data?.message?.status) {
            let list = res?.data?.message?.data || [];
            list = [...list].map((element) => ({ ID: uuidv4(), ...element }));
            setQuestionData(list || []);
          } else {
            toast.error(res?.data?.message?.status_response);
          }
        });
    } catch (err) {
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

  const AssignToComponent = (data) => {
    const { assigned_to, assigned_to_email } = data?.data;
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
      questionare_answer_id,
      attachment_type,
    } = data?.data;
    return (
      <div className="d-flex align-items-center justify-content-center">
        <IconButton
          variant="iconButtonPrimary"
          description={<MdOutlineQuestionAnswer/>}
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

  const SubmitedDocsFunction = (data) => SubmitedDocs(data, questionarieList);

  useEffect(() => {
    questionarieList();
  }, []);
  return (
    <>
      <BackDrop isLoading={isLoading} />
      <SubmitAnswerModal />
      <div className="table-cell" ref={tableRef}>
        <DataGrid
          id="dataGrid"
          dataSource={questionData}
          columnAutoWidth={true}
          height={tableScrollableHeight}
          allowColumnReordering={false}
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
            rowRenderingMode: "undefined",
            scrollByContent: false,
            scrollByThumb: true,
            showScrollbar: "onHover",
            useNative: "auto",
          }}
          onExporting={(e) =>
            exportValidation(questionData?.length, e, `Questionnaire`)
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
            dataField="assigned_to_email"
            caption="Assign To"
            cellRender={AssignToComponent}
            headerCellRender={customHeaderCell}
          />
          <Column
            caption="Required Doc"
            dataField="attachment_type"
            cellRender={AttachmentTypeCustomCell}
            headerCellRender={customHeaderCell}
            width={100}
            allowExporting={false}
          />
          <Column
            dataField="submitted_doc"
            caption="Submited Doc"
            cellComponent={SubmitedDocsFunction}
            headerCellRender={customHeaderCell}
            allowExporting={false}
          />
          <Column
            caption="Answer"
            headerCellRender={customHeaderCell}
            cellRender={CommentsTemplateAction}
            alignment="center"
            allowExporting={false}
          />
          <ColumnFixing enabled={true} />
          <FilterRow visible={true} />
          <Export enabled={true} />
          <Selection mode="single" />
        </DataGrid>
      </div>
    </>
  );
}

export default Questionarie;
