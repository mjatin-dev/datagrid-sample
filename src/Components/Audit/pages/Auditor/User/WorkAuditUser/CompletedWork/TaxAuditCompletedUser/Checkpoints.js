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
import { MdTextsms, MdInfo } from "react-icons/md";
import IconButton from "../../../../../../components/Buttons/IconButton";
import { Input } from "../../../../../../components/Inputs/Input";
import styles from "./style.module.scss";
import axiosInstance from "../../../../../../../../apiServices";
import { useHistory, useRouteMatch } from "react-router";
import CommentSection from "../../../../../../components/CommentsSection";
import { toast } from "react-toastify";
import BackDrop from "../../../../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import AttachmentTypeCustomCell from "../../../../../../components/CustomCells/AttachmentTypeCell";
import SubmitedDocs from "../../../../../../components/CustomCells/SubmittedDocs";
import { useSelector } from "react-redux";
import { auditDateFormater } from "CommonModules/Utils/helperfunctions";
import { customHeaderCell, exportGrid } from "Components/Audit/constants/CommonFunction";

const Checkpoints = () => {
  const history = useHistory();
  const { path } = useRouteMatch();
  const email = history?.location?.state?.email || "";
  const [isShowComments, setIsShowComments] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [CheckListData, setCheckListData] = useState([]);
  const [commentsData, setCommentsData] = useState([]);
  const [currentOpenedChecklistComment, setCurrentOpenedChecklistComment] =
    useState("");

  const userTypeNo = useSelector((state) => state?.auth?.loginInfo?.auditUserType);
  const loggedInUserEmail = useSelector(
    (state) => state?.auth?.loginInfo?.email
  );

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
          completed: 1,
        }
      );
      if (status === 200 && data?.message?.status) {
        const questions = data?.message?.check_list || [];
        setCheckListData(questions);
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

  const commentAction = (data) => {
    return (
      <div className="d-flex align-items-center justify-content-center">
        <IconButton
          variant="iconButtonPrimary"
          className={`${styles.tableIconButton} mr-2 ${styles.messageNotificationDot} mr-2`}
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

  const dropdownAction = (data) => {
    const { severity, check_point_id, owner } = data.data;
    return (
      <div className="d-flex align-items-center">
        <Input
          value={severity || "-"}
          type="select"
          variant="tableDataSelectInput"
          placeholder={data.data.severity}
          disabled={
            owner !== loggedInUserEmail ||
            userTypeNo === 8 ||
            userTypeNo === 14 ||
            userTypeNo === 3
          }
          valueForDropDown={["Low", "Medium", "High"]}
          onChange={(e) => severityChange(e, check_point_id)}
        />
      </div>
    );
  };

  const SubmitedDocsFunction = (data) =>
    SubmitedDocs(data, getCheckList, "checkpoints");

  useEffect(() => {
    getCheckList();
  }, []);

  return (
    <div>
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
          caption="Comments"
          cellRender={commentAction}
          headerCellRender={customHeaderCell}
        />
        <Column
          dataField="Info"
          caption="Info"
          cellRender={infoAction}
          headerCellRender={customHeaderCell}
        />
        <Column
          dataField="Severtiy"
          caption="Severity"
          cellRender={dropdownAction}
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
