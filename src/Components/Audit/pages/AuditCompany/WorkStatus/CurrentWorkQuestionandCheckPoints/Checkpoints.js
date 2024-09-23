/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { MdAdd, MdTextsms, MdInfo } from "react-icons/md";
import IconButton from "../../../../components/Buttons/IconButton";
import { Input } from "../../../../components/Inputs/Input";
import CommentSection from "../../../../components/CommentsSection";
import styles from "./style.module.scss";
import { useHistory, useRouteMatch } from "react-router";
import { toast } from "react-toastify";
import axiosInstance from "../../../../../../apiServices";
import BackDrop from "../../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import SubmitedDocs from "../../../../components/CustomCells/SubmittedDocs";
import AttachmentTypeCustomCell from "../../../../components/CustomCells/AttachmentTypeCell";
import auditApi from "../../../../api";
import { useSelector } from "react-redux";
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

const Checkpoints = () => {
  const history = useHistory();
  const { path } = useRouteMatch();
  const companyId = history?.location?.state?.company || "";
  const assignment_id = history?.location?.state?.assignment_id || "";
  const [isFileUploadInProgress, uploadFile] = useFileUpload();
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setdataSource] = useState([]);
  const [isShowComments, setIsShowComments] = useState(false);
  const [commentsData, setCommentsData] = useState([]);
  const [currentOpenedChecklistComment, setCurrentOpenedChecklistComment] =
    useState("");

  const tableRef = useRef();
  const tableScrollableHeight = useScrollableHeight(tableRef, 48, [
    tableRef,
    dataSource,
  ]);

  const userTypeNo = useSelector(
    (state) => state?.auth?.loginInfo?.auditUserType
  );
  const loggedInUserEmail = useSelector(
    (state) => state?.auth?.loginInfo?.email
  );

  useEffect(() => {
    getCheckpoints();
  }, []);

  //function to get branch list
  const getCheckpoints = async () => {
    try {
      const resp = await axiosInstance.post(
        "audit.api.getCompanyWiseChecklist",
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

  // function to get Comments
  const getChecklistComments = async (val) => {
    const resp = await axiosInstance.post("audit.api.GetChecklistComments", {
      check_point_id: val || currentOpenedChecklistComment,
    });
    if (resp) {
      const { data, status } = resp;
      if (data && status === 200 && data?.message?.status === true) {
        setCommentsData(data?.message?.comment_list || []);
      }
    }
  };

  //function to set Comment
  const setChecklistComment = async (content) => {
    const resp = await axiosInstance.post("audit.api.SetChecklistComments", {
      check_point_id: currentOpenedChecklistComment,
      content,
    });
    if (resp) {
      const { data, status } = resp;
      if (data && status === 200 && data?.message?.status === true) {
        getChecklistComments();
      }
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

  const handleAddDocs = async (e, check_point_id, assignment_id) => {
    const isFileUploaded = await uploadFile(e, auditApi.addDocsInChecklist, {
      check_point_id,
      assignment_id: assignment_id,
    });
    if (isFileUploaded) {
      getCheckpoints();
    }
  };

  const AddTemplateAction = (data) => {
    const { check_point_id, assignment_id, complied, attachment_format } =
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
            accept={getFileExtensions(attachment_format)}
          />
          <MdAdd />
        </label>
      </div>
    );
  };

  const CommentAction = (data) => {
    return (
      <div className="d-flex align-items-center">
        <IconButton
          variant="iconButtonPrimary"
          className={`${styles.tableIconButton} mr-2`}
          description={<MdTextsms />}
          disabled={userTypeNo === 8 || userTypeNo === 14 || userTypeNo === 3}
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
          className={`${styles.tableIconButton} mr-2`}
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
  const updateSeverityApi = async (e, check_point_id) => {
    const payload = {
      check_point_id: check_point_id,
      severity: e.target.value,
    };
    try {
      const resp = await axiosInstance.post(
        "audit.api.UpdateChecklistSeverity",
        payload
      );
      if (resp?.status === 200 && resp?.data) {
        toast.success(resp?.data?.message?.status_response);
        getCheckpoints();
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };
  const compliedNotComplied = (e, assignment_id, check_point_id) => {
    const formData = new FormData();
    formData.append("assignment_id", assignment_id);
    formData.append("check_point_id", check_point_id);
    formData.append("complied", e.target.value);
    try {
      axiosInstance
        .post("audit.api.AnswerCheckPoint", formData)
        .then((res) => {
          if (res?.data?.message?.status) {
            toast.success(res?.data?.message?.status_response);
            getCheckpoints();
          } else {
            toast.warning(res?.data?.message?.status_response);
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    } catch (err) {}
  };
  const severityAction = (data) => {
    const { severity, check_point_id, owner } = data?.data;
    return (
      <div className="d-flex align-items-center">
        <Input
          type="select"
          variant="tableDataSelectInput"
          value={severity}
          disabled={
            owner !== loggedInUserEmail ||
            userTypeNo === 8 ||
            userTypeNo === 14 ||
            userTypeNo === 3
          }
          valueForDropDown={["High", "Low", "Modrate"]}
          onChange={(e) => updateSeverityApi(e, check_point_id)}
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

  const statusAction = (data) => {
    const { check_point_id, assignment_id, complied } = data?.data;
    return (
      <div className="d-flex align-items-center">
        <Input
          placeholder={complied || "select"}
          type="select"
          variant="tableDataSelectInput"
          disabled={userTypeNo === 8 || userTypeNo === 14 || userTypeNo === 3}
          onChange={(e) =>
            compliedNotComplied(e, assignment_id, check_point_id)
          }
          valueForDropDown={["Complied", "Not Complied", "Not Applicable"]}
        />
      </div>
    );
  };

  const SubmitedDocsFunction = (data) =>
    SubmitedDocs(data, getCheckpoints, "checkpoints");

  return (
    <>
      <BackDrop isLoading={isLoading} />
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

      <div class="table-cell" ref={tableRef}>
        <DataGrid
          id="dataGrid"
          dataSource={dataSource}
          columnAutoWidth={true}
          allowColumnReordering={true}
          height={tableScrollableHeight}
          paging={false}
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
            exportValidation(dataSource?.length, e, `Current Work Checkpoints`)
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
            dataField="check_point"
            caption="Checkpoint"
            cellRender={customDataCell}
            headerCellRender={customHeaderCell}
          />
          <Column
            dataField="checklist_section"
            caption="Section Name"
            cellRender={customDataCell}
            headerCellRender={customHeaderCell}
          />
          <Column
            dataField="assigned_to"
            caption="Assign To"
            cellRender={assignedTo}
            headerCellRender={customHeaderCell}
            allowExporting={false}
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
            dataField="attachment_format"
            caption="Required Doc."
            cellRender={AttachmentTypeCustomCell}
            headerCellRender={customHeaderCell}
            allowExporting={false}
          />
          <Column
            dataField="submitted_doc"
            caption="Submitted Docs"
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
            caption="Comment"
            cellRender={CommentAction}
            headerCellRender={customHeaderCell}
            alignment="left"
            allowExporting={false}
          />
          <Column
            caption="Info"
            cellRender={infoAction}
            headerCellRender={customHeaderCell}
            alignment="left"
            allowExporting={false}
          />
          <Column
            caption="Severity"
            dataField="severity"
            cellRender={severityAction}
            alignment="left"
          />
          <Column
            caption="Status"
            dataField="complied"
            cellRender={statusAction}
            alignment="left"
          />
          <Export enabled={true} />
          <GroupPanel visible={true} allowColumnDragging={true} />
          <FilterRow visible={true} />
          <Selection mode="single" />
        </DataGrid>
      </div>
    </>
  );
};
export default Checkpoints;
