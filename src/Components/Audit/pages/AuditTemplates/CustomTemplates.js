/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import IconButton from "../../components/Buttons/IconButton";
import { MdAddBox, MdMoreVert } from "react-icons/md";
import { useHistory, useRouteMatch } from "react-router";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import { useSelector } from "react-redux";
import { MdModeEdit, MdOutlineNoteAdd } from "react-icons/md";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import {
  CreatedOnCell,
  auditTableCell,
  customHeaderCell,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
import { ContextMenu } from "devextreme-react";
import DevExtremeComponents from "Components/Audit/constants/DevEx/commonExports";
import AuditColumnChooser from "Components/Audit/components/AuditColumnChooser/AuditColumnChooser";
import { getSavedColumn } from "Components/Audit/components/AuditColumnChooser/AuditColumnChooserAPI";
import { template_List_View } from "Components/Audit/components/AuditColumnChooser/initialsStatesForColumnChooser";
import { templateListView } from "Components/Audit/components/AuditColumnChooser/ColumnChooserConstants";

//DevEx audit filter imports
import {
  auditTemplatelistObjKey,
  template_list_search_filter_list,
  template_list_indivisual_filter_list,
} from "Components/Audit/components/AuditFilters/filterConstants";
import { createCustomAuditDataGridStore } from "Components/Audit/components/AuditFilters/filter";
import { handleColumnChange } from "Components/Audit/components/AuditFilters/columnChange";
import { toast } from "react-toastify";
import axiosInstance from "apiServices";
import useCustomFilter from "Components/Audit/components/AuditFilters/customHook";
import { isAuditFiltersApplied } from "Components/Audit/components/AuditFilters/commonFunctions";
import { remoteOperations } from "Components/Audit/constants/datagrid.config";

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
  Grouping,
  ColumnChooser,
  HeaderFilter,
} = DevExtremeComponents;

function CustomTemplates() {
  const userEmail = useSelector(
    (state) => state?.auth?.loginInfo?.email || state?.auth?.loginInfo?.EmailID
  );

  const [templates, setTemplates] = useState([]);
  const history = useHistory();
  const { path } = useRouteMatch();

  const tableRef = useRef();
  const devExRef = useRef();
  const tableScrollableHeight = useScrollableHeight(tableRef, 48, [
    tableRef,
    templates,
  ]);

  const [visible, setVisible] = useState(false);
  const [defaultVisibleColumns, setDefaultVisibleColumns] = useState(
    JSON.parse(JSON.stringify(template_List_View))
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

  const fetchTblData = async () => {
    const CustomDataStore = createCustomAuditDataGridStore(
      "audit.api.AuditTemplateDeshBoard",
      auditTemplatelistObjKey,
      template_list_search_filter_list,
      template_list_indivisual_filter_list,
      {},
      "audit_template_id"
    );
    setTemplates(CustomDataStore);
  };

  const selectEmployee = (e) => {
    e.component.byKey(e.currentSelectedRowKeys[0]).done((employee) => {
      // setSelectedEmployee(employee);
    });
  };

  const EditTemplateAction = (data) => {
    const { audit_template_id, user_id } = data.data;

    return (
      <IconButton
        variant="iconButtonRound"
        description={<MdModeEdit />}
        disabledVariant={"auditDisabled"}
        size="none"
        disabled={userEmail !== user_id}
        onClick={() => {
          history.push({
            pathname: `${path}/create-template`,
            search: `?new_template=false&audit_template_id=${audit_template_id}`,
          });
        }}
      />
    );
  };

  const CreateTemplateAction = (data) => {
    const { audit_template_id } = data.data;
    return (
      <div className="d-flex align-items-center justify-content-center">
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
      </div>
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

  const onDeleteTemplate = async (audit_template_id) => {
    try {
      const { data, status } = await axiosInstance.post(
        "audit.api.DeleteTemplate",
        { audit_template_id }
      );
      if (data && status === 200 && data?.message?.status) {
        fetchTblData();
        toast.success("Template Disabled");
      }
    } catch (err) {}
  };

  const TemplateContextMenu = useCallback(
    (data) => {
      // const key = data.data.ID;
      const template_id = data.data.audit_template_id;
      const { user_id } = data.data;
      return (
        <>
          <div className="position-relative">
            <div id={`context-menu-${template_id}`}>
              <IconButton
                variant="iconButtonRound"
                description={<MdMoreVert />}
              />
            </div>
            <ContextMenu
              dataSource={[{ text: "Delete" }]}
              target={`#context-menu-${template_id}`}
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
    getSavedColumn(defaultVisibleColumns, setDefaultVisibleColumns, "Template");
  }, []);

  return (
    <>
      <div className="table-cell auditDevexCustomizations" ref={tableRef}>
        <DataGrid
          // keyExpr={"audit_template_id"}
          id="dataGrid"
          dataSource={templates}
          columnAutoWidth={false}
          allowColumnReordering={true}
          ref={devExRef}
          onSelectionChanged={selectEmployee}
          height={tableScrollableHeight}
          onExporting={(e) =>
            exportValidation(templates?.length, e, `Custom Templates`)
          }
          export={{
            allowExportSelectedData: true,
            enabled: true,
          }}
          showColumnLines={false}
          showBorders={false}
          showRowLines={false}
          wordWrapEnabled={true}
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
          columnChooser={{
            enabled: false,
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
            <Item
              name="columnChooserButton"
              locateInMenu="auto"
              location="after"
            />
            <Item name="groupPanel" location="before" />
          </Toolbar>
          <ColumnChooser enabled={false} />
          <HeaderFilter visible={true} filter allowSearch={true} />
          <Column
            dataField="audit_template_name"
            caption="Template Name"
            headerCellRender={customHeaderCell}
            cellRender={auditTableCell}
            allowSorting={true}
            minWidth={150}
            visible={
              defaultVisibleColumns?.find(
                (e) => e.title === "audit_template_name"
              )?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find(
                (e) => e.title === "audit_template_name"
              )?.filter_value
            }
            filterType={
              defaultVisibleColumns.find(
                (e) => e.title === "audit_template_name"
              )?.filterType
            }
          />
          <Column
            dataField="audit_category"
            caption="Audit Type"
            minWidth={150}
            allowSorting={true}
            headerCellRender={customHeaderCell}
            cellRender={auditTableCell}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "audit_category")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "audit_category")
                ?.filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "audit_category")
                ?.filterType
            }
          />
          <Column
            dataField="created_on"
            caption="Created On"
            allowSorting={true}
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
            caption="questionnaire"
            allowSorting={false}
            headerCellRender={customHeaderCell}
            cellRender={RequiredDataCell}
            alignment="left"
            width={"110px"}
            allowExporting={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "total_question")
                ?.is_visible
            }
            allowHeaderFiltering={false}
          />
          <Column
            dataField="total_checklist"
            caption="Checkpoints"
            allowSorting={false}
            headerCellRender={customHeaderCell}
            cellRender={RequiredDataCell}
            alignment="left"
            width={"110px"}
            allowExporting={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "total_checklist")
                ?.is_visible
            }
            allowHeaderFiltering={false}
          />
          <Column
            caption="Edit"
            allowSorting={false}
            headerCellRender={customHeaderCell}
            cellRender={EditTemplateAction}
            width={"50px"}
            allowExporting={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "edit")?.is_visible
            }
            allowHeaderFiltering={false}
          />
          <Column
            caption="Create Assignment"
            allowSorting={false}
            headerCellRender={customHeaderCell}
            cellRender={CreateTemplateAction}
            width={"100px"}
            allowExporting={false}
            visible={
              defaultVisibleColumns?.find(
                (e) => e.title === "create_assignment"
              )?.is_visible
            }
            allowHeaderFiltering={false}
          />
          <Column
            allowHeaderFiltering={false}
            allowSorting={false}
            width={"50px"}
            cellRender={TemplateContextMenu}
            allowExporting={false}
          />
          <ColumnFixing enabled={false} />
          {/* <FilterRow visible={true} /> */}
          <SearchPanel visible={true} />
          <Grouping contextMenuEnabled={true} />
          <GroupPanel visible={true} allowColumnDragging={true} />
          <Export enabled={true} />
        </DataGrid>
        <AuditColumnChooser
          container="#dataGrid"
          button="#myColumnChooser"
          visible={visible}
          onHiding={onHiding}
          columns={defaultVisibleColumns}
          onApply={onApply}
          defaultColumns={templateListView}
          view="Template"
        />
      </div>
    </>
  );
}

export default CustomTemplates;
