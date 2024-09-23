import React, { useEffect, useRef, useState } from "react";
import styles from "../../WorkStatus/style.module.scss";
import IconButton from "../../../../components/Buttons/IconButton";
import { MdTextsms, MdInfo } from "react-icons/md";
import { useHistory, useRouteMatch } from "react-router";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import CommentSection from "../../../../components/CommentsSection";
import axiosInstance from "../../../../../../apiServices";
import BackDrop from "../../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import AttachmentTypeCustomCell from "../../../../components/CustomCells/AttachmentTypeCell";
import SubmitedDocs from "../../../../components/CustomCells/SubmittedDocs";
import { useSelector } from "react-redux";
import { auditDateFormater } from "CommonModules/Utils/helperfunctions";
import {
  customHeaderCell,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
import { getTruncatedString } from "Components/Audit/components/Helpers/string.helpers";
import { getSubstring } from "CommonModules/helpers/string.helpers";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import DevExtremeComponents from "Components/Audit/constants/DevEx/commonExports";
const {
  DataGrid,
  ColumnFixing,
  Column,
  FilterRow,
  SearchPanel,
  Export,
  Toolbar,
  Item,
  GroupPanel,
  Selection,
  Grouping,
} = DevExtremeComponents;

function Checkpoints() {
  const history = useHistory();
  const { path } = useRouteMatch();
  const companyId = history?.location?.state?.company || "";
  const assignment_id = history?.location?.state?.assignment_id || "";

  const userTypeNo = useSelector(
    (state) => state?.auth?.loginInfo?.auditUserType
  );
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

  useEffect(() => {
    getCheckpoints();
  }, []);

  //function to get branch list
  const getCheckpoints = async () => {
    try {
      const resp = await axiosInstance.post(
        "audit.api.getCompanyWiseChecklist",
        { completed: 1, company: companyId, assignment_id: assignment_id }
      );
      if (resp) {
        const { data } = resp;
        if (data?.message) {
          setdataSource(data.message);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error.message);
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

  const companyFieldCell = (data) => {
    const value = data?.value;
    return (
      <span className={styles.balckTextCell} title={value}>
        {getSubstring(value)}
      </span>
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

  const CommentAction = (data) => {
    return (
      <div className="d-flex align-items-center">
        <IconButton
          variant="iconButtonPrimary"
          className={`${styles.tableIconButton} mr-2`}
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

  const SubmitedDocsFunction = (data) => SubmitedDocs(data, getCheckpoints);

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
          paging={false}
          showColumnLines={false}
          showBorders={false}
          showRowLines={false}
          height={tableScrollableHeight}
          wordWrapEnabled={true}
          selection={{
            mode: "multiple",
            showCheckBoxesMode: "always",
          }}
          width="100%"
          scrolling={{
            columnRenderingMode: "standard",
            mode: "standard",
            preloadEnabled: false,
            renderAsync: undefined,
            rowRenderingMode: "virtual",
            scrollByContent: true,
            scrollByThumb: true,
            showScrollbar: "onHover",
            useNative: "auto",
          }}
          onExporting={(e) =>
            exportValidation(
              dataSource?.length,
              e,
              `Completed Work Checkpoints`
            )
          }
          export={{
            allowExportSelectedData: true,
            enabled: true,
          }}
        >
          <Toolbar>
            <Item name="exportButton" />
            <Item name="searchPanel" />
            <Item name="groupPanel" location="before" />
          </Toolbar>
          <Column
            dataField="audit_template_name"
            caption="Template Name"
            headerCellRender={customHeaderCell}
            cellRender={companyFieldCell}
            allowExporting={false}
          />
          <Column
            dataField="checklist_section"
            caption="Section Name"
            cellRender={companyFieldCell}
            headerCellRender={customHeaderCell}
          />
          <Column
            dataField="check_point"
            caption="Checkpoints"
            headerCellRender={customHeaderCell}
            cellRender={companyFieldCell}
            alignment="left"
          />
          <Column
            dataField="assigned_to"
            caption="Assign To"
            headerCellRender={customHeaderCell}
            cellRender={assignedTo}
            alignment="left"
            allowExporting={false}
          />
          <Column
            dataField="start_date"
            caption="Start Date"
            headerCellRender={customHeaderCell}
            cellRender={auditDateFormater}
            alignment="left"
            allowExporting={false}
          />
          <Column
            dataField="to_be_completed"
            caption="end Date"
            headerCellRender={customHeaderCell}
            cellRender={auditDateFormater}
            alignment="left"
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
            caption="Comment"
            headerCellRender={customHeaderCell}
            cellRender={CommentAction}
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
          <ColumnFixing enabled={true} />
          <FilterRow visible={true} />
          <SearchPanel visible={true} />
          <Grouping contextMenuEnabled={true} />

          <GroupPanel visible={true} allowColumnDragging={true} />
          <Export enabled={true} />
          <Selection mode="single" />
        </DataGrid>
      </div>
    </>
  );
}

export default Checkpoints;
