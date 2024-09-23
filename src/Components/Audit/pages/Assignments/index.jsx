import React, { useEffect, useState, useCallback, useRef } from "react";
import styles from "./style.module.scss";
import Text from "../../components/Text/Text";
import IconButton from "../../components/Buttons/IconButton";
import { MdAddBox } from "react-icons/md";
import { useHistory, useRouteMatch } from "react-router";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import { MdModeEdit, MdMoreVert } from "react-icons/md";
import Container from "../../components/Containers";
import axiosInstance from "../../../../apiServices/";
import { toast } from "react-toastify";
import SubmitAnswerModal from "../../components/SubmitAnswerModal";
import { useSelector } from "react-redux";
import {
  CreatedOnCell,
  auditTableCell,
  customHeaderCell,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import { ContextMenu } from "devextreme-react";
import { getSubstring } from "CommonModules/helpers/string.helpers";
import DevExtremeComponents from "Components/Audit/constants/DevEx/commonExports";
import AuditColumnChooser from "Components/Audit/components/AuditColumnChooser/AuditColumnChooser";
import { assignmentListView } from "Components/Audit/components/AuditColumnChooser/ColumnChooserConstants";
import { getSavedColumn } from "Components/Audit/components/AuditColumnChooser/AuditColumnChooserAPI";
import { assignment_List_View } from "Components/Audit/components/AuditColumnChooser/initialsStatesForColumnChooser";
import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";

//DevEx audit filter imports
import {
  auditAssignmentlistObjKey,
  assignment_list_search_filter_list,
  assignment_list_indivisual_filter_list,
} from "Components/Audit/components/AuditFilters/filterConstants";
import { createCustomAuditDataGridStore } from "Components/Audit/components/AuditFilters/filter";
import { handleColumnChange } from "Components/Audit/components/AuditFilters/columnChange";
import useCustomFilter from "Components/Audit/components/AuditFilters/customHook";
import { isAuditFiltersApplied } from "Components/Audit/components/AuditFilters/commonFunctions";
import { remoteOperations } from "Components/Audit/constants/datagrid.config";

const {
  DataGrid,
  ColumnFixing,
  Column,
  RequiredRule,
  FilterRow,
  SearchPanel,
  Export,
  Toolbar,
  Item,
  GroupPanel,
  Selection,
  Grouping,
  ColumnChooser,
  HeaderFilter,
} = DevExtremeComponents;

function Assignments() {
  const userEmail = useSelector(
    (state) => state?.auth?.loginInfo?.email || state?.auth?.loginInfo?.EmailID
  );
  const [assignmentData, setAssignmentData] = useState([]);
  const history = useHistory();
  const { path } = useRouteMatch();
  const tableRef = useRef();
  const devExRef = useRef();
  const tableScrollableHeight = useScrollableHeight(tableRef, 48, [
    tableRef,
    assignmentData,
  ]);
  const [visible, setVisible] = useState(false);
  const [defaultVisibleColumns, setDefaultVisibleColumns] =
    useState(JSON.parse(JSON.stringify(assignment_List_View)));

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

  const fetchTblData = async () => {
    const CustomDataStore = createCustomAuditDataGridStore(
      "audit.api.assignmentListView",
      auditAssignmentlistObjKey,
      assignment_list_search_filter_list,
      assignment_list_indivisual_filter_list
    );
    setAssignmentData(CustomDataStore);
  };

  const selectEmployee = (e) => {
    e.component.byKey(e.currentSelectedRowKeys[0]).done((employee) => {});
  };

  const editAction = (data) => {
    const { assignment_id, user_id } = data.data;
    return (
      <div className="d-flex align-items-center">
        <IconButton
          variant="iconButtonRound"
          description={<MdModeEdit />}
          disabledVariant={"auditDisabled"}
          disabled={userEmail !== user_id}
          size="none"
          onClick={() =>
            history.push(
              `${path}/audit-assignment?id=${data.data.name || assignment_id}`
            )
          }
        />
      </div>
    );
  };

  const RequiredDataCell = (data) => {
    const value = data?.value;
    const columnName = data?.column?.name;
    const { name, audit_name, assignment_id } = data?.data;

    const type = columnName === "questionnaire" ? "Questions" : "Checkpoints";
    return (
      <button
        className={styles.textBlueDataCell}
        onClick={() => {
          history.push({
            pathname: `${path}/assignment/${name || assignment_id}/${type}`,
            state: {
              audit_name,
              assignment_id,
            },
          });
        }}
      >
        {value}&nbsp;
        {columnName === "questionnaire"
          ? "Questions"
          : columnName === "checkpoints"
          ? "Checkpoints"
          : ""}
      </button>
    );
  };
  const onDeleteTemplate = useCallback(async (audit_template_id) => {
    try {
      const { data } = await axiosInstance.post(`audit.api.DeleteAssignment`, {
        assignment_id: audit_template_id,
      });

      if (data.message.status) {
        toast.success("Assignment deleted successfully!");
        fetchTblData();
      } else {
        toast.error(data?.message?.status_response || "Something went wrong!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  }, []);

  const TemplateContextMenu = useCallback(
    (data) => {
      const template_id = data.data.name;
      const { user_id } = data.data;
      return (
        <>
          <div className="position-relative">
            <div id={`context-menu-assignment-${template_id}`}>
              <IconButton
                variant="iconButtonRound"
                disabledVariant={"auditDisabled"}
                disabled={userEmail !== user_id}
                description={<MdMoreVert />}
              />
            </div>
            {/* {[...showContextMenu]?.includes(template_id) && (
              <div className={styles.templateContextMenu} ref={contextRef}>
                <p
                  onClick={() => {
                    if (userEmail === user_id) {
                      onDeleteTemplate(template_id);
                    }
                    setShowContextMenu([]);
                  }}
                >
                  Delete
                </p>
              </div>
            )} */}
            <ContextMenu
              dataSource={[{ text: "Delete" }]}
              // width={200}
              disabled={userEmail !== user_id}
              target={`#context-menu-assignment-${template_id}`}
              onItemClick={(e) => {
                if (e?.itemData?.text === "Delete") {
                  if (userEmail === user_id) onDeleteTemplate(template_id);
                }
              }}
              showEvent="click"
            />
          </div>
        </>
      );
    },
    [onDeleteTemplate, userEmail]
  );

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
    getSavedColumn(
      defaultVisibleColumns,
      setDefaultVisibleColumns,
      "Assignment"
    );
  }, []);

  return (
    <>
      <SubmitAnswerModal />
      <Container variant="content">
        <div
          className={`${styles.topHeading} d-flex align-items-center justify-content-between`}
        >
          <Text
            heading="p"
            variant="stepperMainHeading"
            text="Audit Assignments"
          />
        </div>
        <div className="auditDevexCustomizations" ref={tableRef}>
          <DataGrid
            keyExpr={"assignment_id"}
            id="dataGrid"
            dataSource={assignmentData}
            remoteOperations={remoteOperations}
            columnAutoWidth={false}
            ref={devExRef}
            allowColumnReordering={true}
            onSelectionChanged={selectEmployee}
            paging={false}
            showColumnLines={false}
            showBorders={false}
            showRowLines={false}
            wordWrapEnabled={true}
            height={tableScrollableHeight}
            width="100%"
            selection={{
              mode: "multiple",
              showCheckBoxesMode: "always",
            }}
            onOptionChanged={(e) =>
              handleColumnChange(
                e,
                defaultVisibleColumns,
                setDefaultVisibleColumns,
                devExRef
              )
            }
            scrolling={{
              columnRenderingMode: "standard",
              mode: "standard",
              preloadEnabled: false,
              renderAsync: undefined,
              rowRenderingMode: undefined,
              scrollByContent: true,
              scrollByThumb: true,
              showScrollbar: "onHover",
              useNative: "auto",
            }}
            onExporting={(e) =>
              exportValidation(assignmentData?.length, e, "Assignments")
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
          >
            <Toolbar>
              <Item location="after">
                <IconButton
                  description="Create Assignment"
                  variant="createProject"
                  icon={<MdAddBox style={{ fontSize: "25px" }} />}
                  onClick={() => history.push(`${path}/audit-assignment`)}
                />
              </Item>
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
            </Toolbar>
            <HeaderFilter visible={true} filter allowSearch={true} />
            <ColumnChooser enabled={false} />
            <Column
              dataField="customer_name"
              caption="Company Name"
              minWidth={100}
              headerCellRender={customHeaderCell}
              allowSorting={true}
              cellRender={auditTableCell}
              visible={
                defaultVisibleColumns?.find((e) => e.title === "customer_name")
                  ?.is_visible
              }
              filterValues={
                defaultVisibleColumns.find((e) => e.title === "customer_name")
                  .filter_value
              }
              filterType={
                defaultVisibleColumns.find((e) => e.title === "customer_name")
                  .filterType
              }
            >
              <RequiredRule />
            </Column>
            <Column
              dataField="audit_name"
              caption="Assignment Name"
              allowSorting={true}
              minWidth={100}
              headerCellRender={customHeaderCell}
              cellRender={auditTableCell}
              visible={
                defaultVisibleColumns?.find((e) => e.title === "audit_name")
                  ?.is_visible
              }
              filterValues={
                defaultVisibleColumns.find((e) => e.title === "audit_name")
                  .filter_value
              }
              filterType={
                defaultVisibleColumns.find((e) => e.title === "audit_name")
                  .filterType
              }
            >
              <RequiredRule />
            </Column>
            <Column
              dataField="audit_template_name"
              allowSorting={true}
              caption="Template Name"
              minWidth={100}
              headerCellRender={customHeaderCell}
              cellRender={auditTableCell}
              visible={
                defaultVisibleColumns?.find(
                  (e) => e.title === "audit_template_name"
                )?.is_visible
              }
              filterValues={
                defaultVisibleColumns.find(
                  (e) => e.title === "audit_template_name"
                ).filter_value
              }
              filterType={
                defaultVisibleColumns.find(
                  (e) => e.title === "audit_template_name"
                ).filterType
              }
            >
              <RequiredRule />
            </Column>
            <Column
              dataField="start_date"
              caption="Start Date"
              allowSorting={true}
              width={"150px"}
              headerCellRender={customHeaderCell}
              cellRender={CreatedOnCell}
              visible={
                defaultVisibleColumns?.find((e) => e.title === "start_date")
                  ?.is_visible
              }
              filterValues={
                defaultVisibleColumns.find((e) => e.title === "start_date")
                  .filter_value
              }
              filterType={
                defaultVisibleColumns.find((e) => e.title === "start_date")
                  .filterType
              }
            >
              <RequiredRule />
            </Column>
            <Column
              dataField="audit_category"
              allowSorting={true}
              caption="Audit Scope"
              headerCellRender={customHeaderCell}
              cellRender={auditTableCell}
              minWidth={100}
              visible={
                defaultVisibleColumns?.find((e) => e.title === "audit_category")
                  ?.is_visible
              }
              filterValues={
                defaultVisibleColumns.find((e) => e.title === "audit_category")
                  .filter_value
              }
              filterType={
                defaultVisibleColumns.find((e) => e.title === "audit_category")
                  .filterType
              }
            >
              <RequiredRule />
            </Column>

            <Column
              allowHeaderFiltering={false}
              allowSorting={false}
              dataField="questionnaire"
              caption="Questionnaire"
              headerCellRender={customHeaderCell}
              cellRender={RequiredDataCell}
              width={"110px"}
              alignment="left"
              allowExporting={false}
              visible={
                defaultVisibleColumns?.find((e) => e.title === "questionnaire")
                  ?.is_visible
              }
            />
            <Column
              allowHeaderFiltering={false}
              allowSorting={false}
              dataField="checkpoints"
              caption="Checkpoints"
              width={"110px"}
              headerCellRender={customHeaderCell}
              cellRender={RequiredDataCell}
              alignment="left"
              allowExporting={false}
              visible={
                defaultVisibleColumns?.find((e) => e.title === "checkpoints")
                  ?.is_visible
              }
            >
              <RequiredRule />
            </Column>

            <Column
              allowHeaderFiltering={false}
              caption="Edit"
              headerCellRender={customHeaderCell}
              cellRender={editAction}
              allowSorting={false}
              alignment="left"
              allowExporting={false}
              width={"60px"}
              visible={
                defaultVisibleColumns?.find((e) => e.title === "edit")
                  ?.is_visible
              }
            />
            <Column
              allowHeaderFiltering={false}
              width={"50px"}
              cellRender={TemplateContextMenu}
              allowExporting={false}
            />
            <ColumnFixing enabled={true} />
            {/* <FilterRow visible={true} /> */}
            <SearchPanel visible={true} />
            <Grouping contextMenuEnabled={true} />
            <GroupPanel visible={true} allowColumnDragging={true} />
            <Export enabled={true} />
            <Selection mode="single" />
          </DataGrid>
          <AuditColumnChooser
            container="#dataGrid"
            button="#myColumnChooser"
            visible={visible}
            onHiding={onHiding}
            columns={defaultVisibleColumns}
            onApply={onApply}
            defaultColumns={assignmentListView}
            view="Assignment"
          />
        </div>
      </Container>
    </>
  );
}

export default Assignments;
