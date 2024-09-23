import {
  DataGrid,
  Column,
  SearchPanel,
  Selection,
  Export,
  FilterRow,
  Toolbar,
  Item,
} from "devextreme-react/data-grid";
import React, { useState, useEffect } from "react";
import { MdAdd, MdTextsms, MdInfo } from "react-icons/md";
import IconButton from "../../../../components/Buttons/IconButton";
import { Input } from "../../../../components/Inputs/Input";
import styles from "./style.module.scss";
import { useHistory, useRouteMatch } from "react-router";
import CommentSection from "../../../../components/CommentsSection";
import axiosInstance from "../../../../../../apiServices";
import { toast } from "react-toastify";
import ProjectManagementModal from "../../../../../ProjectManagement/components/ProjectManagementModal";
import BackDrop from "../../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import AttachmentTypeCustomCell from "../../../../components/CustomCells/AttachmentTypeCell";
import SubmitedDocs from "../../../../components/CustomCells/SubmittedDocs";
import { useSelector } from "react-redux";
import { getFileExtensions } from "Components/Audit/components/Helpers/string.helpers";
import auditApi from "Components/Audit/api";
import useFileUpload from "SharedComponents/Hooks/FileUpload.hook";
import NotCompliedConfirmation from "Components/Audit/components/Modal/NotCompiledConfirmation";
import {
  CompliedNotCompliedFunction,
  customHeaderCell,
  docsReliedUponCell,
  exportGrid,
} from "Components/Audit/constants/CommonFunction";
import AuditReferenceModal from "Components/Audit/components/ReferenceComponent";

const Checkpoints = () => {
  const history = useHistory();
  const { path } = useRouteMatch();
  const [isFileUploadInProgress, uploadFile] = useFileUpload();
  const email = history?.location?.state?.email || "";
  const isCompleted =
    history?.location?.pathname?.includes("complete-work") || false;
  const [isShowReferenceData, setShowReferenceData] = useState({
    isShowReference: false,
    question_id: "",
  });
  const [references, setReferences] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowComments, setIsShowComments] = useState(false);
  const [CheckListData, setCheckListData] = useState([]);
  const [commentsData, setCommentsData] = useState([]);
  const [notCompliedModal, setNotCompliedModal] = useState(false);
  const [notCompliedModalData, setNotCompliedModalData] = useState(null);

  const [currentOpenedChecklistComment, setCurrentOpenedChecklistComment] =
    useState("");

  const userTypeNo = useSelector(
    (state) => state?.auth?.loginInfo?.auditUserType
  );
  const loggedInUserEmail = useSelector(
    (state) => state?.auth?.loginInfo?.email
  );

  const openNotCompliedModal = (data) => {
    setNotCompliedModal(true);
    setNotCompliedModalData(data);
  };
  const closeNotCompliedModal = () => {
    setNotCompliedModal(false);
  };

  // function to get Comments
  const getChecklistComments = async (val) => {
    const { data, status } = await axiosInstance.post(
      "audit.api.GetChecklistComments",
      {
        check_point_id: val || currentOpenedChecklistComment,
      }
    );
    if (data && status === 200 && data?.message?.status === true) {
      setCommentsData(data?.message?.comment_list || []);
    }
  };

  //function to set Comment
  const setChecklistComment = async (content) => {
    const { data, status } = await axiosInstance.post(
      "audit.api.SetChecklistComments",
      {
        check_point_id: currentOpenedChecklistComment,
        content,
      }
    );
    if (data && status === 200 && data?.message?.status === true) {
      getChecklistComments();
    }
  };

  const getCheckList = async () => {
    try {
      setIsLoading(true);
      const { data, status } = await axiosInstance.post(
        "audit.api.getUserWiseCL",
        {
          user: email,
          completed: isCompleted ? 1 : 0,
        }
      );
      if (status === 200 && data?.message?.status) {
        const questions = data?.message?.check_list || [];
        setCheckListData(questions);
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

  const commentAction = (data) => {
    return (
      <div className="d-flex align-items-center justify-content-center">
        <IconButton
          variant="iconButtonPrimary"
          className={`${styles.tableIconButton} mr-2 ${styles.messageNotificationDot} mr-2`}
          disabled={userTypeNo === 8 || userTypeNo === 14 || userTypeNo === 3}
          description={<MdTextsms />}
          size="none"
          onClick={() => {
            setCurrentOpenedChecklistComment(data?.data?.check_point_id);
            setIsShowComments(!isShowComments);
            getChecklistComments(data?.data?.check_point_id);
          }}
          disabledVariant="iconButtonPrimaryDisabled"
        />
      </div>
    );
  };
  const infoAction = (data) => {
    return (
      <div className="d-flex align-items-center">
        <IconButton
          variant="iconButtonPrimary"
          className={`${styles.tableIconButton} mr-2 ${styles.messageNotificationDot} mr-2`}
          description={<MdInfo />}
          size="none"
          onClick={() =>
            history.push({
              pathname: `${path}/remark`,
              state: {
                checkPointId: data.data?.check_point_id,
              },
            })
          }
        />
      </div>
    );
  };
  const dropdownAction = (data) => {
    const { severity, check_point_id, owner } = data.data;
    return (
      <div className="d-flex align-items-center">
        <Input
          value={severity || "-"}
          type="select"
          disabled={
            owner !== loggedInUserEmail ||
            userTypeNo === 8 ||
            userTypeNo === 14 ||
            userTypeNo === 3
          }
          variant="tableDataSelectInput"
          valueForDropDown={["Low", "Medium", "High"]}
          onChange={(e) => severityChange(e, check_point_id)}
        />
      </div>
    );
  };

  const severityChange = (e, id) => {
    try {
      axiosInstance
        .post("audit.api.UpdateChecklistSeverity", {
          check_point_id: id,
          severity: e.target.value,
        })
        .then((res) => {
          if (res?.data?.message?.status) {
            getCheckList();
          } else {
            toast.error(res?.data?.message?.status_response);
          }
        });
    } catch (err) {}
  };

  const compliedNotComplied = (e, assignment_id, check_point_id, data) => {
    if (
      e.target.value === "Not Complied" &&
      data?.data?.submitted_doc.length === 0
    ) {
      openNotCompliedModal(data);
    } else {
      CompliedNotCompliedFunction(
        e.target.value,
        assignment_id,
        check_point_id,
        getCheckList
      );
    }
  };

  const dropdownStatusAction = (data) => {
    const { check_point_id, assignment_id, complied } = data?.data;
    return (
      <div className="d-flex align-items-center">
        <Input
          placeholder={complied || "select"}
          type="select"
          variant="tableDataSelectInput"
          disabled={userTypeNo === 8 || userTypeNo === 14 || userTypeNo === 3}
          onChange={(e) =>
            compliedNotComplied(e, assignment_id, check_point_id, data)
          }
          valueForDropDown={["Complied", "Not Complied", "Not Applicable"]}
        />
      </div>
    );
  };
  const AddTemplateAction = (data) => {
    const { check_point_id, assignment_id, complied, attachment_type } =
      data.data;
    return (
      <div className={styles.fileInput}>
        <label
          className={`${
            complied === "Complied" ||
            userTypeNo === 8 ||
            userTypeNo === 14 ||
            userTypeNo === 3
              ? styles.addIconButtonDisabled
              : styles.addIconButton
          }`}
        >
          <input
            type="file"
            multiple
            disabled={
              complied === "Complied" ||
              userTypeNo === 8 ||
              userTypeNo === 14 ||
              userTypeNo === 3
            }
            onChange={(e) => handleAddDocs(e, check_point_id, assignment_id)}
            accept={getFileExtensions(attachment_type)}
          />
          <MdAdd />
        </label>
      </div>
    );
  };

  const handleAddDocs = async (e, check_point_id, assignment_id) => {
    const isFileUploaded = await uploadFile(e, auditApi.addDocsInChecklist, {
      check_point_id,
      assignment_id: assignment_id,
    });
    if (isFileUploaded) {
      getCheckList();
    }
  };

  useEffect(() => {
    getCheckList();
  }, []);

  return (
    <div>
      <BackDrop isLoading={isLoading} />
      <NotCompliedConfirmation
        handleClose={closeNotCompliedModal}
        open={notCompliedModal}
        data={notCompliedModalData}
        onSubmitFunction={getCheckList}
      />
      <CommentSection
        isVisible={isShowComments}
        onClose={() => {
          setIsShowComments(false);
          setCommentsData([]);
          setCurrentOpenedChecklistComment("");
        }}
        comments={commentsData}
        onSend={setChecklistComment}
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
      <DataGrid
        id="dataGrid"
        dataSource={CheckListData}
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
          dataField="assignment_name"
          caption="Assignment Name"
          cellRender={customDataCell}
          headerCellRender={customHeaderCell}
        />
        <Column
          dataField="check_list_section_name"
          caption="Section Name"
          cellRender={customDataCell}
          headerCellRender={customHeaderCell}
        />
        <Column
          dataField="check_point"
          caption="Checkpoints"
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
          dataField="required_docs"
          cellRender={AttachmentTypeCustomCell}
          headerCellRender={customHeaderCell}
        />
        <Column
          caption="Submitted Docs"
          cellComponent={SubmitedDocs}
          headerCellRender={customHeaderCell}
          dataField="submitted_doc"
          alignment="center"
        />
        <Column
          dataField="documents_relied_upon"
          caption="Docs. Relied Upon"
          cellRender={(data) => docsReliedUponCell(data, setShowReferenceData)}
          headerCellRender={customHeaderCell}
        />
        <Column
          caption="Add Docs"
          cellRender={AddTemplateAction}
          headerCellRender={customHeaderCell}
          alignment="center"
        />
        <Column
          caption="Comment"
          cellRender={commentAction}
          headerCellRender={customHeaderCell}
          alignment="center"
        />
        <Column
          caption="Info"
          cellRender={infoAction}
          headerCellRender={customHeaderCell}
        />
        <Column
          caption="Severity"
          cellRender={dropdownAction}
          headerCellRender={customHeaderCell}
        />
        <Column
          caption="status"
          cellRender={dropdownStatusAction}
          headerCellRender={customHeaderCell}
        />
        <Export enabled={true} />
        <FilterRow visible={true} />
        <Selection mode="single" />
      </DataGrid>
    </div>
  );
};

export default Checkpoints;
