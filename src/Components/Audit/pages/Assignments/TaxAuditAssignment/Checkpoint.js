import React, { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "../../../components/Inputs/Input";
import styles from "./style.module.scss";
import axiosInstance from "../../../../../apiServices";
import { useParams, useHistory } from "react-router";
import { toast } from "react-toastify";
import auditApi from "../../../api";
import ProjectManagementModal from "../../../../ProjectManagement/components/ProjectManagementModal";
import BackDrop from "../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import CommentSection from "../../../components/CommentsSection";
import SubmitedDocs from "../../../components/CustomCells/SubmittedDocs";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/Buttons/Button";
import useFileUpload from "SharedComponents/Hooks/FileUpload.hook";
import NotCompliedConfirmation from "Components/Audit/components/Modal/NotCompiledConfirmation";
import {
  AssignByComponent,
  CompliedNotCompliedFunction,
  auditTableCell,
  customHeaderCell,
  docsReliedUponCell,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
import { auditDateFormater } from "CommonModules/Utils/helperfunctions";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import { BACKEND_BASE_URL } from "apiServices/baseurl";
import {
  setAssignmentDetail,
  setLongTextPoup,
} from "Components/Audit/redux/actions";
import DevExtremeComponents from "Components/Audit/constants/DevEx/commonExports";
import AuditReferenceModal from "Components/Audit/components/ReferenceComponent";
import { assignemnet_List_View_CheckList } from "Components/Audit/components/AuditColumnChooser/initialsStatesForColumnChooser";
import { getSavedColumn } from "Components/Audit/components/AuditColumnChooser/AuditColumnChooserAPI";
import AuditColumnChooser from "Components/Audit/components/AuditColumnChooser/AuditColumnChooser";
import { assignemnetListViewCheckList } from "Components/Audit/components/AuditColumnChooser/ColumnChooserConstants";
import IconButton from "Components/Audit/components/Buttons/IconButton";
import RequiredDocPopup from "Components/Audit/components/CustomCells/RequiredDocPopup";

// devex filter imports
import {
  auditAssignmentchecklistlistObjKey,
  assignment_checklist_list_search_filter_list,
  assignment_checklist_list_indivisual_filter_list,
} from "Components/Audit/components/AuditFilters/filterConstants";
import { createCustomAuditDataGridStore } from "Components/Audit/components/AuditFilters/filter";
import { handleColumnChange } from "Components/Audit/components/AuditFilters/columnChange";
import { isAuditFiltersApplied } from "Components/Audit/components/AuditFilters/commonFunctions";
import useCustomFilter from "Components/Audit/components/AuditFilters/customHook";
import { remoteOperations } from "Components/Audit/constants/datagrid.config";
import { MdInfo } from "react-icons/md";

const {
  DataGrid,
  Column,
  SearchPanel,
  Selection,
  Export,
  Toolbar,
  GroupPanel,
  Grouping,
  FilterRow,
  Item,
  ColumnChooser,
  HeaderFilter,
} = DevExtremeComponents;

const Checkpoints = ({ auditName }) => {
  const [data, setData] = useState([]);
  const { id } = useParams();
  const history = useHistory();

  const [isShowReferenceData, setShowReferenceData] = useState({
    isShowReference: false,
    question_id: "",
  });
  const dispatch = useDispatch();
  const userTypeNp = useSelector(
    (state) => state?.auth?.loginInfo?.auditUserType
  );
  const [isShowComments, setIsShowComments] = useState(false);
  const [references, setReferences] = useState([]);
  const [commentsData, setCommentsData] = useState([]);
  const [requiredDocPopup, setRequiredDocPopup] = useState({
    show: false,
    data: {},
  });
  const [currentOpenedChecklistComment, setCurrentOpenedChecklistComment] =
    useState("");
  const [isFileUploadInProgress, uploadFile] = useFileUpload();
  const [notCompliedModal, setNotCompliedModal] = useState(false);
  const [notCompliedModalData, setNotCompliedModalData] = useState(null);

  const userTypeNo = useSelector(
    (state) => state?.auth?.loginInfo?.auditUserType
  );
  const tableRef = useRef();
  const devExRef = useRef();
  const tableScrollableHeight = useScrollableHeight(tableRef, 48, [
    tableRef,
    data,
  ]);

  const [visible, setVisible] = useState(false);
  const [defaultVisibleColumns, setDefaultVisibleColumns] = useState(
    JSON.parse(JSON.stringify(assignemnet_List_View_CheckList))
  );

  //custom hook to clear filter
  const customClearFilter = useCustomFilter(
    devExRef,
    setDefaultVisibleColumns,
    defaultVisibleColumns
  );

  const onHiding = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onApply = useCallback(
    (changes) => {
      setDefaultVisibleColumns(changes);
    },
    [setDefaultVisibleColumns]
  );

  const openNotCompliedModal = (data) => {
    setNotCompliedModal(true);
    setNotCompliedModalData(data);
  };
  const closeNotCompliedModal = () => {
    setNotCompliedModal(false);
  };

  const fetchTblData = useCallback(async () => {
    const payload = { assignment_id: id };
    const CustomDataStore = createCustomAuditDataGridStore(
      "audit.api.getChecklistBasedonAssignment",
      auditAssignmentchecklistlistObjKey,
      assignment_checklist_list_search_filter_list,
      assignment_checklist_list_indivisual_filter_list,
      payload,
      "check_point_id"
    );
    setData(CustomDataStore);
  }, [id]);

  const fetchAndSetAuditBasicDetail = async (id) => {
    const apiResponse = await axiosInstance.get(
      `${BACKEND_BASE_URL}audit.api.AssignmentDetails`,
      {
        params: {
          assignment_id: id,
        },
      }
    );
    if (apiResponse?.data?.message?.status === true) {
      dispatch(setAssignmentDetail(apiResponse?.data?.message?.data));
    }
  };

  // function to get Comments
  const getChecklistComments = async (val) => {
    const { data, status } = await axiosInstance.post(
      "audit.api.GetChecklistComments",
      {
        check_point_id: val || currentOpenedChecklistComment,
        assignment_id: id,
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
        assignment_id: id,
      }
    );
    if (data && status === 200 && data?.message?.status === true) {
      getChecklistComments();
    }
  };

  const dropdownAction = (data) => {
    const { severity } = data.data;
    return (
      <div className="d-flex align-items-center">
        <Input
          type="select"
          disabled={userTypeNo === 8 || userTypeNo === 14 || userTypeNo === 3}
          variant="tableDataSelectInput"
          valueForDropDown={["Low", "Medium", "High"]}
          placeholder={severity || "select"}
          value={severity || "select"}
          onChange={(e) => changeSeverity(e, data)}
        />
      </div>
    );
  };

  const changeSeverity = async (event, item) => {
    const { check_point_id } = item.data;
    const { value } = event.target;

    const { data, status } = await auditApi.updateSeverityInCheckList({
      check_point_id,
      severity: value,
    });
    if (status === 200 && data && data?.message?.status) {
      toast.success("severity successfully updated.");
      fetchTblData();
    } else {
      toast.error(
        data?.message?.status_response || "Unable to update severity"
      );
    }
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
        fetchTblData
      );
    }
  };

  const dropAction = (data) => {
    const { check_point_id, assignment_id, status } = data?.data;
    return (
      <div className="d-flex align-items-center">
        <Input
          placeholder={status || "select"}
          type="select"
          variant="tableDataSelectInput"
          disabled={userTypeNp === 8 || userTypeNp === 14 || userTypeNp === 3}
          onChange={(e) =>
            compliedNotComplied(e, assignment_id, check_point_id, data)
          }
          valueForDropDown={["Complied", "Not Complied", "Not Applicable"]}
        />
      </div>
    );
  };

  const onAssign = () => {
    if (userTypeNo === 16) {
      history.replace({
        pathname: `${history?.location?.pathname}/assignCheckList`,
        state: {
          path: history?.location?.pathname,
        },
      });
    } else {
      history.replace({
        pathname: `${history?.location?.pathname}/teamDetails`,
        state: {
          id: id,
          path: history?.location?.pathname,
        },
      });
    }
  };

  const closeRequiredPopup = () => {
    setRequiredDocPopup({
      show: false,
      data: {},
    });
  };

  const viewRequirements = (data) => {
    return (
      <div className="d-flex align-items-center justify-content-center">
        {data?.value?.length > 0 ? (
          <IconButton
            variant="iconButtonPrimary"
            description={<MdInfo />}
            size="none"
            onClick={() =>
              setRequiredDocPopup({
                show: true,
                data: data,
              })
            }
          />
        ) : (
          <span className={`${styles.customDataCell} d-block w-100 `}>-</span>
        )}
      </div>
    );
  };

  const auditPopupCell = (_data, type) => {
    const value = _data?.value;
    return (
      <div className="audit__columna__auto">
        <p
          title={value}
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.preventDefault();
            dispatch(
              setLongTextPoup({
                isOpen: true,
                data: value,
                heading: type,
              })
            );
          }}
        >
          {value?.toString() || "-"}
        </p>
      </div>
    );
  };

  const onToolbarPreparing = useCallback(
    (e) => {
      e.toolbarOptions.items.push({
        widget: "dxButton",
        location: "after",
        visible: true,
        options: {
          icon: "columnchooser",
          hint: "Column Chooser",
          elementAttr: {
            id: "myColumnChooser",
          },
          onClick: () => setVisible(true),
        },
      });
    },
    [setVisible]
  );

  useEffect(() => {
    fetchTblData();
    // dispatch(getAssignmentCheckpoints(id));
    fetchAndSetAuditBasicDetail(id);
    getSavedColumn(
      defaultVisibleColumns,
      setDefaultVisibleColumns,
      "Assignment Checklist"
    );
  }, []);

  // useEffect(() => {
  //   if (assignmentCheckpoints && assignmentCheckpoints?.length > 0) {
  //     setData([...assignmentCheckpoints]);
  //   }
  // }, [assignmentCheckpoints]);

  return (
    <div>
      <BackDrop isLoading={isFileUploadInProgress} />
      <NotCompliedConfirmation
        handleClose={closeNotCompliedModal}
        open={notCompliedModal}
        data={notCompliedModalData}
        onSubmitFunction={fetchTblData}
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
        title="Required attachment format"
        visible={requiredDocPopup.show}
        onClose={closeRequiredPopup}
      >
        <RequiredDocPopup data={requiredDocPopup.data} />
      </ProjectManagementModal>
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
      <div className="table-cell auditDevexCustomizations" ref={tableRef}>
        <DataGrid
          keyExpr={"check_point_id"}
          id="dataGrid"
          dataSource={data}
          columnAutoWidth={false}
          allowColumnReordering={true}
          paging={false}
          showColumnLines={false}
          showBorders={false}
          ref={devExRef}
          showRowLines={false}
          wordWrapEnabled={true}
          width="100%"
          height={tableScrollableHeight}
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
            exportValidation(data?.length, e, `${auditName}(CheckPoints)`)
          }
          export={{
            allowExportSelectedData: true,
            enabled: true,
          }}
          columnChooser={{
            enabled: false,
          }}
          sorting={{
            mode: "multiple",
          }}
          onToolbarPreparing={onToolbarPreparing}
          remoteOperations={remoteOperations}
          onOptionChanged={(e) =>
            handleColumnChange(
              e,
              defaultVisibleColumns,
              setDefaultVisibleColumns,
              devExRef
            )
          }
        >
          <Toolbar>
            <Item
              widget="dxButton"
              options={{
                text: "Reset Filters",
                type: "normal",
                hint: "Reset Filters",
                stylingMode: "outlined",
                onClick: customClearFilter,
              }}
              name="resetFiltersButton"
              location="after"
              visible={isAuditFiltersApplied(defaultVisibleColumns)}
            />
            <Item name="searchPanel" />
            <Item name="exportButton" />
            <Item
              name="columnChooserButton"
              locateInMenu="auto"
              location="after"
            />
            <Item name="groupPanel" location="before" />
            <Item>
              {(userTypeNo === 9 || userTypeNo === 16) && (
                <Button
                  variant="iconButtonPrimary"
                  className={`${styles.tableIconButton} mr-2 ${styles.messageNotificationDot} mr-2`}
                  description="Assign Checklist"
                  onClick={onAssign}
                  size="small"
                />
              )}
            </Item>
          </Toolbar>
          <HeaderFilter visible={true} filter allowSearch={true} />
          <SearchPanel visible={true} />
          <ColumnChooser enabled={false} />
          <Column
            dataField="checklist_section"
            caption="Section Name"
            dataType="string"
            allowSorting={true}
            minWidth={150}
            cellRender={auditTableCell}
            headerCellRender={customHeaderCell}
            visible={
              defaultVisibleColumns?.find(
                (e) => e.title === "checklist_section"
              )?.is_visible
            }
            // filterValues={
            //   defaultVisibleColumns.find((e) => e.title === "checklist_section")
            //     .filter_value
            // }
            // filterType={
            //   defaultVisibleColumns.find((e) => e.title === "checklist_section")
            //     .filterType
            // }
          />

          <Column
            dataField="check_point"
            caption="Checkpoints"
            dataType="string"
            cellRender={(e) => auditPopupCell(e, "Checkpoint")}
            allowSorting={true}
            minWidth={150}
            headerCellRender={customHeaderCell}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "check_point")
                ?.is_visible
            }
            // filterValues={
            //   defaultVisibleColumns.find((e) => e.title === "check_point")
            //     .filter_value
            // }
            // filterType={
            //   defaultVisibleColumns.find((e) => e.title === "check_point")
            //     .filterType
            // }
          />
          <Column
            dataField="start_date"
            caption="Start Date"
            width={"100px"}
            cellRender={auditDateFormater}
            headerCellRender={customHeaderCell}
            allowExporting={false}
            allowSorting={true}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "start_date")
                ?.is_visible
            }
            // filterValues={
            //   defaultVisibleColumns.find((e) => e.title === "start_date")
            //     .filter_value
            // }
            // filterType={
            //   defaultVisibleColumns.find((e) => e.title === "start_date")
            //     .filterType
            // }
          />
          <Column
            dataField="to_be_completed"
            caption="End Date"
            width={"100px"}
            cellRender={auditDateFormater}
            headerCellRender={customHeaderCell}
            allowExporting={false}
            allowSorting={true}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "to_be_completed")
                ?.is_visible
            }
            // filterValues={
            //   defaultVisibleColumns.find((e) => e.title === "to_be_completed")
            //     .filter_value
            // }
            // filterType={
            //   defaultVisibleColumns.find((e) => e.title === "to_be_completed")
            //     .filterType
            // }
          />
          <Column
            dataField="assigned_by"
            caption="Assign By"
            minWidth={100}
            cellRender={AssignByComponent}
            headerCellRender={customHeaderCell}
            allowExporting={false}
            allowSorting={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "assigned_by")
                ?.is_visible
            }
            // filterValues={
            //   defaultVisibleColumns.find((e) => e.title === "assigned_by")
            //     .filter_value
            // }
            // filterType={
            //   defaultVisibleColumns.find((e) => e.title === "assigned_by")
            //     .filterType
            // }
          />
          <Column
            dataField="attachment_format"
            caption="Required Doc"
            // cellRender={AttachmentTypeCustomCell}
            cellRender={viewRequirements}
            headerCellRender={customHeaderCell}
            allowExporting={false}
            width={"80px"}
            alignment={"center"}
            allowHeaderFiltering={false}
            allowSorting={false}
            visible={
              defaultVisibleColumns?.find(
                (e) => e.title === "attachment_format"
              )?.is_visible
            }
          />
          <Column
            caption="Submitted Docs"
            cellComponent={SubmitedDocs}
            headerCellRender={customHeaderCell}
            dataField="submitted_doc"
            width={"130px"}
            allowExporting={false}
            allowSorting={false}
            allowHeaderFiltering={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "submitted_docs")
                ?.is_visible
            }
          />
          <Column
            caption="Reg Reference"
            cellComponent={SubmitedDocs}
            headerCellRender={customHeaderCell}
            dataField="checkpoint_reference_list"
            width={"130px"}
            allowExporting={false}
            allowSorting={false}
            allowHeaderFiltering={false}
            visible={
              defaultVisibleColumns?.find(
                (e) => e.title === "checkpoint_reference_list"
              )?.is_visible
            }
          />
          <Column
            dataField="documents_relied_upon"
            caption="Docs. Relied Upon"
            allowSorting={false}
            width={"200px"}
            cellRender={(data) =>
              docsReliedUponCell(data, setShowReferenceData)
            }
            headerCellRender={customHeaderCell}
            visible={
              defaultVisibleColumns?.find(
                (e) => e.title === "documents_relied_upon"
              )?.is_visible
            }
            // filterValues={
            //   defaultVisibleColumns.find(
            //     (e) => e.title === "documents_relied_upon"
            //   ).filter_value
            // }
            // filterType={
            //   defaultVisibleColumns.find(
            //     (e) => e.title === "documents_relied_upon"
            //   ).filterType
            // }
          />
          <Column
            dataField="severity"
            caption="Severity"
            allowSorting={false}
            width={"150px"}
            cellRender={dropdownAction}
            headerCellRender={customHeaderCell}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "severity")
                ?.is_visible
            }
            // filterValues={
            //   defaultVisibleColumns.find((e) => e.title === "severity")
            //     .filter_value
            // }
            // filterType={
            //   defaultVisibleColumns.find((e) => e.title === "severity")
            //     .filterType
            // }
          />
          <Column
            dataField="status"
            width={"150px"}
            allowSorting={false}
            caption="Status"
            cellRender={dropAction}
            headerCellRender={customHeaderCell}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "status")
                ?.is_visible
            }
            // filterValues={
            //   defaultVisibleColumns.find((e) => e.title === "status")
            //     .filter_value
            // }
            // filterType={
            //   defaultVisibleColumns.find((e) => e.title === "status").filterType
            // }
          />
          <Column
            dataField="how_to_verify"
            allowSorting={false}
            caption="How to verify"
            allowHeaderFiltering={false}
            minWidth={150}
            cellRender={auditTableCell}
            headerCellRender={customHeaderCell}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "how_to_verify")
                ?.is_visible
            }
          />
          <Column
            dataField="penalty"
            caption="Penalty"
            allowSorting={false}
            cellRender={auditTableCell}
            minWidth={150}
            headerCellRender={customHeaderCell}
            alignment="start"
            allowExporting={false}
            allowHeaderFiltering={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "penalty")
                ?.is_visible
            }
          />

          {/* <MasterDetail enabled={true} component={DropdownDetails} /> */}
          <Grouping contextMenuEnabled={true} />
          <GroupPanel visible={true} allowColumnDragging={true} />
          <Export enabled={true} />
          {/* <FilterRow visible={true} /> */}
          <Selection mode="single" />
        </DataGrid>
        <AuditColumnChooser
          container="#dataGrid"
          button="#myColumnChooser"
          visible={visible}
          onHiding={onHiding}
          columns={defaultVisibleColumns}
          onApply={onApply}
          defaultColumns={assignemnetListViewCheckList}
          view="Assignment Checklist"
        />
      </div>
    </div>
  );
};

export default Checkpoints;
