import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import IconButton from "../../components/Buttons/IconButton";
import { MdAddBox, MdPlayArrow } from "react-icons/md";
import { useHistory, useRouteMatch } from "react-router";

import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";

import { MdOutlineNoteAdd } from "react-icons/md";
import {
  CreatedOnCell,
  auditTableCell,
  customHeaderCell,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
import DevExtremeComponents from "Components/Audit/constants/DevEx/commonExports";

//DevEx column chooser exports
import AuditColumnChooser from "Components/Audit/components/AuditColumnChooser/AuditColumnChooser";
import { getSavedColumn } from "Components/Audit/components/AuditColumnChooser/AuditColumnChooserAPI";
import { template_standard_List_View } from "Components/Audit/components/AuditColumnChooser/initialsStatesForColumnChooser";
import { standardTemplateListView } from "Components/Audit/components/AuditColumnChooser/ColumnChooserConstants";

//DevEx audit filter imports
import {
  auditTemplatelistObjKey,
  template_list_search_filter_list,
  template_list_indivisual_filter_list,
} from "Components/Audit/components/AuditFilters/filterConstants";
import { createCustomAuditDataGridStore } from "Components/Audit/components/AuditFilters/filter";
import { handleColumnChange } from "Components/Audit/components/AuditFilters/columnChange";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import { isAuditFiltersApplied } from "Components/Audit/components/AuditFilters/commonFunctions";
import useCustomFilter from "Components/Audit/components/AuditFilters/customHook";
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
  Grouping,
  ColumnChooser,
  HeaderFilter,
} = DevExtremeComponents;

function StandardTemplates() {
  const history = useHistory();
  const { path } = useRouteMatch();
  const [templates, setTemplates] = useState([]);

  const tableRef = useRef();
  const devExRef = useRef();
  const tableScrollableHeight = useScrollableHeight(tableRef, 48, [
    tableRef,
    templates,
  ]);

  const [visible, setVisible] = useState(false);
  const [defaultVisibleColumns, setDefaultVisibleColumns] = useState(
    JSON.parse(JSON.stringify(template_standard_List_View))
  );

  // custom hook to clear filter
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

  const selectEmployee = (e) => {
    e.component.byKey(e.currentSelectedRowKeys[0]).done((employee) => {
      // setSelectedEmployee(employee);
    });
  };

  const fetchTblData = async () => {
    const CustomDataStore = createCustomAuditDataGridStore(
      "audit.api.AuditStandardTemplateDeshBoard",
      auditTemplatelistObjKey,
      template_list_search_filter_list,
      template_list_indivisual_filter_list,
      {},
      "audit_template_id"
    );
    setTemplates(CustomDataStore);
  };

  const CompletionCell = (data) => {
    const value = data?.data?.completion;
    return (
      <p
        title={value}
        className={`${styles.completion} ${value === 100 && styles.success}`}
      >
        {value + "%"}
      </p>
    );
  };

  const AssignTemplateAction = (data) => {
    const { audit_template_name, audit_template_id } = data.data;
    return (
      <IconButton
        variant="iconButtonPrimary"
        description={<MdPlayArrow />}
        size="none"
        onClick={() => {
          history.push({
            pathname: `${path}/template`,
            state: {
              templateName: audit_template_name,
              templateId: audit_template_id,
            },
          });
        }}
      />
    );
  };

  const CreateTemplateAction = (data) => {
    const { audit_template_id } = data.data;
    return (
      <IconButton
        variant="iconButtonPrimary"
        description={<MdOutlineNoteAdd />}
        onClick={() =>
          history.push({
            pathname: path + "/assignments/audit-assignment",
            state: { audit_template_id },
          })
        }
        size="none"
      />
    );
  };

  const RequiredDataCell = (data) => {
    const value = data?.value;
    const columnName = data?.column?.name;
    const { audit_template_name, audit_template_id } = data.data;
    return (
      <span
        className={styles.textBlueDataCell}
        onClick={() => {
          history.push({
            pathname: `${path}/template`,
            state: {
              templateName: audit_template_name,
              templateId: audit_template_id,
            },
            ...(columnName === "total_checklist" && {
              search: "isChecklist=true",
            }),
          });
        }}
      >
        {value}&nbsp;
        {columnName === "total_question"
          ? "Questions"
          : columnName === "total_checklist"
          ? "Checkpoints"
          : ""}
      </span>
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
    getSavedColumn(
      defaultVisibleColumns,
      setDefaultVisibleColumns,
      "Standard Template"
    );
  }, []);

  return (
    <>
      <div className="table-cell auditDevexCustomizations" ref={tableRef}>
        <DataGrid
          keyExpr={"audit_template_id"}
          id="dataGrid"
          dataSource={templates}
          columnAutoWidth={false}
          ref={devExRef}
          allowColumnReordering={true}
          onSelectionChanged={selectEmployee}
          onExporting={(e) =>
            exportValidation(templates?.length, e, "Standard Templates")
          }
          paging={false}
          height={tableScrollableHeight}
          showColumnLines={false}
          showBorders={false}
          showRowLines={false}
          wordWrapEnabled={true}
          width="100%"
          export={{
            allowExportSelectedData: true,
            enabled: true,
          }}
          selection={{
            mode: "multiple",
            showCheckBoxesMode: "always",
          }}
          columnChooser={{
            enabled: false,
          }}
          onOptionChanged={(e) =>
            handleColumnChange(
              e,
              defaultVisibleColumns,
              setDefaultVisibleColumns,
              devExRef
            )
          }
          remoteOperations={remoteOperations}
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
          onToolbarPreparing={onToolbarPreparing}
          sorting={{
            mode: "multiple",
          }}
        >
          <Toolbar>
            <Item location="after">
              <IconButton
                description="New Template"
                variant="createProject"
                icon={<MdAddBox />}
                onClick={() =>
                  history.push({
                    pathname: `${path}/create-template`,
                    search: `?new_template=true`,
                  })
                }
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
            <Item name="exportButton" />
            <Item name="searchPanel" />
            <Item name="groupPanel" location="before" />
          </Toolbar>
          <ColumnChooser enabled={false} />
          <HeaderFilter visible={true} filter allowSearch={true} />

          <Column
            dataField="audit_template_name"
            caption="Template Name"
            headerCellRender={customHeaderCell}
            cellRender={auditTableCell}
            minWidth={100}
            allowSorting={true}
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
            dataField="audit_category"
            allowSorting={true}
            caption="Audit Type"
            minWidth={100}
            headerCellRender={customHeaderCell}
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
          >
            <RequiredRule />
          </Column>
          <Column
            dataField="created_on"
            caption="Created On"
            allowSorting={true}
            minWidth={100}
            headerCellRender={customHeaderCell}
            cellRender={CreatedOnCell}
            width={"100px"}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "created_on")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "created_on")
                .filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "created_on")
                .filterType
            }
          />
          <Column
            dataField="total_question"
            caption="Questionnaire"
            headerCellRender={customHeaderCell}
            cellRender={RequiredDataCell}
            allowHeaderFiltering={false}
            allowSorting={false}
            width={"120px"}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "total_question")
                ?.is_visible
            }
          />
          <Column
            dataField="total_checklist"
            caption="Checkpoints"
            headerCellRender={customHeaderCell}
            cellRender={RequiredDataCell}
            allowHeaderFiltering={false}
            allowSorting={false}
            width={"120px"}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "total_checklist")
                ?.is_visible
            }
          >
            <RequiredRule />
          </Column>
          <Column
            caption="Assign"
            headerCellRender={customHeaderCell}
            cellRender={AssignTemplateAction}
            allowHeaderFiltering={false}
            allowSorting={false}
            width={"70px"}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "assign")
                ?.is_visible
            }
          >
            <RequiredRule />
          </Column>
          <Column
            caption="Create"
            headerCellRender={customHeaderCell}
            cellRender={CreateTemplateAction}
            allowExporting={false}
            allowHeaderFiltering={false}
            allowSorting={false}
            width={"70px"}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "create")
                ?.is_visible
            }
          >
            <RequiredRule />
          </Column>
          {/* <Column cellRender={TemplateContextMenu} /> */}

          <ColumnFixing enabled={true} />
          {/* <FilterRow visible={true} /> */}
          <SearchPanel visible={true} />
          <Grouping contextMenuEnabled={true} />

          <GroupPanel visible={true} allowColumnDragging={true} />
          <Export enabled={true} />
          {/* <Selection mode="single" /> */}
        </DataGrid>
        <AuditColumnChooser
          container="#dataGrid"
          button="#myColumnChooser"
          visible={visible}
          onHiding={onHiding}
          columns={defaultVisibleColumns}
          onApply={onApply}
          defaultColumns={standardTemplateListView}
          view="Standard Template"
        />
      </div>
    </>
  );
}

export default StandardTemplates;
