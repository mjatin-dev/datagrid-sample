import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { MdKeyboardArrowRight } from "react-icons/md";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import styles from "./style.module.scss";
import IconButton from "../../../../../Audit/components/Buttons/IconButton";
import Container from "../../../../../Audit/components/Containers";
import BackDrop from "../../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import {
  AssignToComponent,
  CreatedOnCell,
  auditTableCell,
  customHeaderCell,
  dashBoardFileExportName,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
import DevExtremeComponents from "Components/Audit/constants/DevEx/commonExports";
import { useSelector } from "react-redux";

// Audit DevEx column chooser imports
import AuditColumnChooser from "Components/Audit/components/AuditColumnChooser/AuditColumnChooser";
import { dashboardAuditcolumns } from "Components/Audit/components/AuditColumnChooser/ColumnChooserConstants";
import {
  dashboardAuditInitialState,
  dashboardAuditQuestionsInitialState,
  dashboardAuditChecklistInitialState,
} from "Components/Audit/components/AuditColumnChooser/initialsStatesForColumnChooser";
import { getSavedColumn } from "Components/Audit/components/AuditColumnChooser/AuditColumnChooserAPI";

//DevEx audit filter imports
import {
  auditDashBoardObjKey,
  dashboard_assignment_search_filter_list,
  dashboard_assignment_indivisual_filter_list,
} from "Components/Audit/components/AuditFilters/filterConstants";
import { createCustomAuditDataGridStore } from "Components/Audit/components/AuditFilters/filter";
import { handleColumnChange } from "Components/Audit/components/AuditFilters/columnChange";
import { isAuditFiltersApplied } from "Components/Audit/components/AuditFilters/commonFunctions";
import useCustomFilter from "Components/Audit/components/AuditFilters/customHook";
import { remoteOperations } from "Components/Audit/constants/datagrid.config";

const {
  DataGrid,
  ColumnFixing,
  Column,
  RequiredRule,
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

function Auditor() {
  const history = useHistory();
  const userTypeNo = useSelector(
    (state) => state?.auth?.loginInfo?.auditUserType
  );
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const tableRef = useRef();
  const devExRef = useRef();
  const tableScrollableHeight = useScrollableHeight(tableRef, 48, [
    dataSource,
    tableRef,
  ]);

  const [visible, setVisible] = useState(false);
  const [defaultVisibleColumns, setDefaultVisibleColumns] = useState(
    JSON.parse(JSON.stringify(dashboardAuditInitialState))
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

  const CompanyActions = (_data) => {
    let type =
      userTypeNo === 13
        ? "Checkpoints"
        : userTypeNo === 14
        ? "Questions"
        : "Questions";
    return (
      <div className="d-flex justify-content-between align-items-center">
        <IconButton
          onClick={() => {
            history.push({
              pathname: `/dashboard-auditor/${type}`,
              state: {
                company: _data.data.company_name,
                assignmentId: _data.data?.assignment_id,
              },
            });
          }}
          variant="iconButtonRound"
          description={<MdKeyboardArrowRight />}
          size="none"
        />
      </div>
    );
  };

  const checkPointsAndQuestions = (_data) => {
    const value = _data?.value;
    const columnName = _data?.column?.name;
    const type = columnName === "question_count" ? "Questions" : "Checkpoints";
    return (
      <button
        className={styles.textBlueDataCell}
        onClick={() => {
          history.push({
            pathname: `/dashboard-auditor/${type}`,
            state: {
              company: _data.data.company_name,
              assignmentId: _data.data?.assignment_id,
            },
          });
        }}
      >
        {value}&nbsp;
        {columnName === "question_count"
          ? "Questions"
          : columnName === "checklist_count"
          ? "Checkpoints"
          : ""}
      </button>
    );
  };

  const fetchTblData = async () => {
    const CustomDataStore = createCustomAuditDataGridStore(
      "audit.api.assignmentDeshboard",
      auditDashBoardObjKey,
      dashboard_assignment_search_filter_list,
      dashboard_assignment_indivisual_filter_list
    );
    setDataSource(CustomDataStore);
  };

  const onToolbarPreparing = useCallback(
    (e) => {
      e.toolbarOptions.items.push({
        widget: "dxButton",
        location: "after",
        mode: "select",
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

  // Handler for when column reordering occurs
  const handleColumnReorder = (e) => {
    // Save the new column order state to the API
    // console.log("chck columns",e);
  };

  useEffect(() => {
    fetchTblData();
    getSavedColumn(
      defaultVisibleColumns,
      setDefaultVisibleColumns,
      "Dashboard"
    );
  }, []);

  useEffect(() => {
    if (userTypeNo && userTypeNo === 13) {
      setDefaultVisibleColumns(
        JSON.parse(JSON.stringify(dashboardAuditChecklistInitialState))
      );
    } else if (userTypeNo && userTypeNo === 14) {
      setDefaultVisibleColumns(
        JSON.parse(JSON.stringify(dashboardAuditQuestionsInitialState))
      );
    } else {
      setDefaultVisibleColumns(
        JSON.parse(JSON.stringify(dashboardAuditInitialState))
      );
    }
  }, [userTypeNo]);
  return (
    <Container variant="container">
      <BackDrop isLoading={isLoading} />
      <div
        ref={tableRef}
        className={`table-cell auditDevexCustomizations`}
        id="Auditor-table"
      >
        <DataGrid
          keyExpr={"assignment_id"}
          id="assignment_id"
          dataSource={dataSource}
          remoteOperations={remoteOperations}
          columnAutoWidth={false}
          ref={devExRef}
          allowColumnReordering={true}
          wordWrapEnabled={true}
          paging={false}
          showColumnLines={false}
          showBorders={false}
          showRowLines={false}
          height={tableScrollableHeight}
          customizeColumns={handleColumnReorder}
          onOptionChanged={(e) => {
            handleColumnChange(
              e,
              defaultVisibleColumns,
              setDefaultVisibleColumns,
              devExRef
            );
          }}
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
            exportValidation(dataSource?.length, e, dashBoardFileExportName())
          }
          export={{
            allowExportSelectedData: true,
            enabled: true,
          }}
          columnChooser={{
            enabled: false,
            mode: "select",
          }}
          sorting={{
            mode: "multiple",
          }}
          onToolbarPreparing={onToolbarPreparing}
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
            <Item
              name="columnChooserButton"
              locateInMenu="auto"
              location="after"
            />
            <Item name="exportButton" />
            <Item name="searchPanel" />
            <Item name="groupPanel" location="before" />
          </Toolbar>
          <HeaderFilter visible={true} filter allowSearch={true} />
          <ColumnChooser enabled={false} mode={"select"} />
          <Column
            dataField="company_name"
            caption="Company Name"
            dataType="string"
            minWidth={200}
            headerCellRender={customHeaderCell}
            cellRender={auditTableCell}
            allowSorting={true}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "company_name")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "company_name")
                .filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "company_name")
                .filterType
            }
          >
            <RequiredRule />
          </Column>
          <Column
            dataField="audit_category"
            caption="Audit Scope"
            minWidth={200}
            headerCellRender={customHeaderCell}
            allowSorting={true}
            cellRender={auditTableCell}
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
          />
          <Column
            dataField="assignment_name"
            caption="Assignment Name"
            headerCellRender={customHeaderCell}
            allowSorting={true}
            cellRender={auditTableCell}
            minWidth={200}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "assignment_name")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "assignment_name")
                .filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "assignment_name")
                .filterType
            }
          >
            <RequiredRule />
          </Column>
          <Column
            dataField="audit_template_name"
            caption="Template Name"
            headerCellRender={customHeaderCell}
            allowSorting={true}
            cellRender={auditTableCell}
            minWidth={200}
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
            headerCellRender={customHeaderCell}
            allowSorting={true}
            cellRender={CreatedOnCell}
            allowExporting={false}
            width={"120px"}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "start_date")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "start_date")
                ?.filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "start_date")
                ?.filterType
            }
          >
            <RequiredRule />
          </Column>
          <Column
            dataField="assigned_by"
            caption="Assign By"
            headerCellRender={customHeaderCell}
            allowSorting={true}
            cellRender={AssignToComponent}
            allowExporting={false}
            minWidth={100}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "assigned_by")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "assigned_by")
                .filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "assigned_by")
                .filterType
            }
          />
          <Column
            dataField="question_count"
            caption="Questionnaire"
            headerCellRender={customHeaderCell}
            allowHeaderFiltering={false}
            allowSorting={false}
            cellRender={checkPointsAndQuestions}
            allowExporting={false}
            width={"100px"}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "question_count")
                ?.is_visible && userTypeNo !== 13
            }
          />
          <Column
            dataField="checklist_count"
            caption="Checkpoint"
            headerCellRender={customHeaderCell}
            allowHeaderFiltering={false}
            allowSorting={false}
            cellRender={checkPointsAndQuestions}
            width={"100px"}
            allowExporting={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "checklist_count")
                ?.is_visible && userTypeNo !== 14
            }
          />
          <Column
            caption="Action"
            width={"70px"}
            allowExporting={false}
            allowSorting={false}
            cellRender={CompanyActions}
          />
          <ColumnFixing enabled={false} />
          <SearchPanel visible={true} />
          <Grouping contextMenuEnabled={true} />
          <GroupPanel visible={true} allowColumnDragging={true} />
          <Export enabled={true} />
          <Selection mode="single" />
        </DataGrid>
        <AuditColumnChooser
          container="#Auditor-table"
          button="#myColumnChooser"
          cssId={"custom-audit-column-chooser"}
          visible={visible}
          onHiding={onHiding}
          columns={defaultVisibleColumns}
          onApply={onApply}
          defaultColumns={dashboardAuditcolumns}
          view="Dashboard"
        />
      </div>
    </Container>
  );
}

export default Auditor;
