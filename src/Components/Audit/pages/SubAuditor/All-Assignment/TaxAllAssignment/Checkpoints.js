/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import { MdTextsms } from "react-icons/md";
import IconButton from "Components/Audit/components/Buttons/IconButton";
import { Input } from "Components/Audit/components/Inputs/Input";
import styles from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { subAuditorModuleActions } from "Components/Audit/redux/subAuditorModuleActions";
import auditApis from "../../../../api";
import { toast } from "react-toastify";
import CommentSection from "Components/Audit/components/CommentsSection";
import axiosInstance from "apiServices";
import AttachmentTypeCustomCell from "Components/Audit/components/CustomCells/AttachmentTypeCell";
import SubmitedDocs from "Components/Audit/components/CustomCells/SubmittedDocs";
import { auditDateFormater } from "CommonModules/Utils/helperfunctions";
import {
  customHeaderCell,
  docsReliedUponCell,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";
import AuditReferenceModal from "Components/Audit/components/ReferenceComponent";
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
  GroupPanel,
} = DevExtremeComponents;

function Checkpoints({ assignment_id }) {
  const [isShowComments, setIsShowComments] = useState(false);
  const [commentsData, setCommentsData] = useState([]);
  const [currentOpenedQuestionComment, setCurrentOpenedQuestionComment] =
    useState("");
  const [isShowReferenceData, setShowReferenceData] = useState({
    isShowReference: false,
    question_id: "",
  });
  const [references, setReferences] = useState([]);
  const tableRef = useRef();

  const currentStatusTab = useSelector(
    (state) => state?.AuditReducer?.subAuditorModule?.currentStatusTab
  );
  const assignmentChecklist = useSelector(
    (state) => state?.AuditReducer?.subAuditorModule?.assignmentChecklist
  );

  const loggedInUserEmail = useSelector(
    (state) => state?.auth?.loginInfo?.email
  );

  const tableScrollableHeight = useScrollableHeight(tableRef, 48, [
    tableRef,
    assignmentChecklist,
  ]);

  const dispatch = useDispatch();
  const customDataCell = (option) => {
    const { value } = option;
    return (
      <span title={value} className={styles.customDataCell}>
        {value || "-"}
      </span>
    );
  };

  const CommentsTemplateAction = (data) => {
    const { check_point_id } = data.data;
    return (
      <IconButton
        variant="iconButtonPrimary"
        description={<MdTextsms />}
        size="none"
        onClick={() => {
          setIsShowComments(!isShowComments);
          setCurrentOpenedQuestionComment(check_point_id);
          getQuestionComments(check_point_id);
        }}
        disabledVariant="iconButtonPrimaryDisabled"
      />
    );
  };

  const CustomStatusCell = (data) => {
    const { severity, check_point_id, owner } = data.data;
    return (
      <div className="d-flex align-items-center">
        <Input
          type="select"
          placeholder="Select status"
          variant="tableDataSelectInput"
          value={severity || null}
          onChange={(e) => onSeverityUpdate(e, check_point_id)}
          disabled={owner !== loggedInUserEmail}
          valueForDropDown={["Low", "Medium", "High"]}
        />
      </div>
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

  const onSeverityUpdate = async (e, check_point_id) => {
    const severity = e.target.value;
    // setIsLoading(true);
    try {
      const { data, status } = await auditApis.updateSeverityInCheckList({
        check_point_id,
        severity,
      });
      if (status === 200 && data && data?.message?.status) {
        if (assignment_id) {
          dispatch(
            subAuditorModuleActions.fetchAssignmentChecklist(assignment_id)
          );
        }
        toast.success("Severity successfully updated.");
        // setIsLoading(false);
      } else {
        toast.error(
          data?.message?.status_response || "Unable to update severity"
        );
        // setIsLoading(false);
      }
    } catch (error) {
      // setIsLoading(false);
      toast.error("Something went wrong");
    }
  };

  const SubmitedDocsFunction = (data) => SubmitedDocs(data, getCheckpoints);
  const getQuestionComments = async (check_point_id) => {
    const { data, status } = await axiosInstance.post(
      "audit.api.GetChecklistComments",
      {
        check_point_id: check_point_id || currentOpenedQuestionComment,
      }
    );
    if (data && status === 200 && data?.message?.status === true) {
      setCommentsData(data?.message?.comment_list || []);
    }
  };

  const setQuestionComment = async (content) => {
    const { data, status } = await axiosInstance.post(
      "audit.api.SetChecklistComments",
      {
        check_point_id: currentOpenedQuestionComment,
        content,
      }
    );
    if (data && status === 200 && data?.message?.status === true) {
      getQuestionComments();
    }
  };

  const dropdownStatusAction = (data) => {
    const { complied, check_point_id, assignment_id } = data.data;
    return (
      <div className="d-flex align-items-center">
        <Input
          value={complied || "select"}
          type="select"
          variant="tableDataSelectInput"
          placeholder={"select"}
          disabled={true}
          selectEnabled={true}
          valueForDropDown={["Complied", "Not Complied", "Not Applicable"]}
        />
      </div>
    );
  };


  const getCheckpoints = () =>
    dispatch(subAuditorModuleActions.fetchAssignmentChecklist(assignment_id));
  useEffect(() => {
    if (assignment_id) {
      getCheckpoints();
    }
  }, [assignment_id, currentStatusTab]);

  return (
    <div>
      <CommentSection
        isVisible={isShowComments}
        onClose={() => {
          setIsShowComments(false);
          setCommentsData([]);
        }}
        comments={commentsData}
        onSend={setQuestionComment}
      />
      <ProjectManagementModal
        visible={isShowReferenceData.isShowReference}
        onClose={() => {
          setShowReferenceData({
            isShowReference: false,
            question_id: "",
          });
          setReferences([]);
        }}
      >
        <AuditReferenceModal
          isShowReferenceData={isShowReferenceData}
          references={references}
          setReferences={setReferences}
        />
      </ProjectManagementModal>
      <div className="table-cell" ref={tableRef}>
        <DataGrid
          id="dataGrid"
          dataSource={assignmentChecklist}
          columnAutoWidth={true}
          // allowColumnReordering={true}
          paging={false}
          height={tableScrollableHeight}
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
            exportValidation(assignmentChecklist?.length, e, `Checklist`)
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
          <SearchPanel visible={true} width={200} />
          <Column
            dataField="checklist_section"
            caption="Section Name"
            cellRender={customDataCell}
            headerCellRender={customHeaderCell}
          />
          <Column
            dataField="check_point"
            caption="Checkpoint"
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
            dataField="assigned_to"
            caption="Assigned To"
            cellRender={AssignToComponent}
            headerCellRender={customHeaderCell}
            allowExporting={false}
          />
          <Column
            dataField="attachment_format"
            caption="Required Doc."
            cellRender={AttachmentTypeCustomCell}
            headerCellRender={customHeaderCell}
            alignment="center"
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
            dataField="documents_relied_upon"
            cellRender={(data) =>
              docsReliedUponCell(data, setShowReferenceData)
            }
            headerCellRender={customHeaderCell}
          />
          <Column
            dataField="status"
            caption="Status"
            cellRender={dropdownStatusAction}
            headerCellRender={customHeaderCell}
          />
          <Column
            dataField="severity"
            caption="Severity"
            cellRender={CustomStatusCell}
            headerCellRender={customHeaderCell}
          />
          <GroupPanel visible={true} allowColumnDragging={true} />

          <Export enabled={true} />
          <Selection mode="single" />
        </DataGrid>
      </div>
    </div>
  );
}

export default Checkpoints;
