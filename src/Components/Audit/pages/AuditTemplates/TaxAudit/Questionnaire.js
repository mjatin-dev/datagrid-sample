/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from "react";
import BackDrop from "../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import styles from "./style.module.scss";
import {
  auditTableCell,
  customDurationCell,
  customHeaderCell,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
import DevExtremeComponents from "Components/Audit/constants/DevEx/commonExports";
import { templateListViewQuestions } from "Components/Audit/components/AuditColumnChooser/ColumnChooserConstants";
import AuditColumnChooser from "Components/Audit/components/AuditColumnChooser/AuditColumnChooser";
import { getSavedColumn } from "Components/Audit/components/AuditColumnChooser/AuditColumnChooserAPI";
import { template_List_View_Questions } from "Components/Audit/components/AuditColumnChooser/initialsStatesForColumnChooser";
import IconButton from "Components/Audit/components/Buttons/IconButton";
import RequiredDocPopup from "Components/Audit/components/CustomCells/RequiredDocPopup";
import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";

//DevEx audit filter imports
import {
  auditTemplateQuestionlistObjKey,
  template_question_list_search_filter_list,
  template_question_list_indivisual_filter_list,
} from "Components/Audit/components/AuditFilters/filterConstants";
import { createCustomAuditDataGridStore } from "Components/Audit/components/AuditFilters/filter";
import { handleColumnChange } from "Components/Audit/components/AuditFilters/columnChange";
import useCustomFilter from "Components/Audit/components/AuditFilters/customHook";
import { isAuditFiltersApplied } from "Components/Audit/components/AuditFilters/commonFunctions";
import { setLongTextPoup } from "Components/Audit/redux/actions";
import { useDispatch } from "react-redux";
import { remoteOperations } from "Components/Audit/constants/datagrid.config";
import { MdInfo } from "react-icons/md";

const {
  DataGrid,
  Column,
  SearchPanel,
  Selection,
  Export,
  Grouping,
  GroupPanel,
  FilterRow,
  ColumnChooser,
  Toolbar,
  Item,
  HeaderFilter,
} = DevExtremeComponents;

const Questionnaire = ({ templateId, templateName }) => {
  const tableRef = useRef();
  const devExRef = useRef();
  const dispatch = useDispatch();

  const [questionnarie, setQuestionnarie] = useState([]);
  const [visible, setVisible] = useState(false);
  const [defaultVisibleColumns, setDefaultVisibleColumns] = useState(
    JSON.parse(JSON.stringify(template_List_View_Questions))
  );

  const [requiredDocPopup, setRequiredDocPopup] = useState({
    show: false,
    data: {},
  });

  //custom hook to clear filters
  const customClearFilter = useCustomFilter(
    devExRef,
    setDefaultVisibleColumns,
    defaultVisibleColumns
  );

  const fetchTblData = async () => {
    const payload = { audit_template_id: templateId };
    const CustomDataStore = createCustomAuditDataGridStore(
      "audit.api.getTemplateFilterQuestionList",
      auditTemplateQuestionlistObjKey,
      template_question_list_search_filter_list,
      template_question_list_indivisual_filter_list,
      payload,
      "question_id"
    );
    setQuestionnarie(CustomDataStore);
  };

  const onHiding = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onApply = useCallback(
    (changes) => {
      setDefaultVisibleColumns(changes);
    },
    [setDefaultVisibleColumns]
  );

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
    getSavedColumn(
      defaultVisibleColumns,
      setDefaultVisibleColumns,
      "Template Questions"
    );
  }, []);

  return (
    <>
      {/* <BackDrop isLoading={isLoading} /> */}
      <ProjectManagementModal
        title="Required attachment format"
        visible={requiredDocPopup.show}
        onClose={closeRequiredPopup}
      >
        <RequiredDocPopup data={requiredDocPopup.data} />
      </ProjectManagementModal>
      <div className="auditDevexCustomizations" ref={tableRef}>
        <DataGrid
          id="dataGrid"
          dataSource={questionnarie}
          columnAutoWidth={false}
          ref={devExRef}
          allowColumnReordering={true}
          allowColumnResizing={true}
          paging={false}
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
          height={document.body.clientHeight - 210}
          onExporting={(e) =>
            exportValidation(
              questionnarie?.length,
              e,
              `${templateName} (Questionnaire)`
            )
          }
          export={{
            allowExportSelectedData: true,
            enabled: true,
          }}
          scrolling={{
            columnRenderingMode: "virtual",
            mode: "infinite",
            preloadEnabled: false,
            renderAsync: false,
            rowRenderingMode: "virtual",
            scrollByContent: true,
            showScrollbar: "always",
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
            dataField="questionnaire_section"
            caption="Section Name"
            cellRender={auditTableCell}
            minWidth={100}
            allowSorting={true}
            headerCellRender={customHeaderCell}
            visible={
              defaultVisibleColumns?.find(
                (e) => e.title === "questionnaire_section"
              )?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find(
                (e) => e.title === "questionnaire_section"
              )?.filter_value
            }
            filterType={
              defaultVisibleColumns.find(
                (e) => e.title === "questionnaire_section"
              )?.filterType
            }
          />
          <Column
            dataField="question"
            cellRender={(e) => auditPopupCell(e, "Question")}
            minWidth={100}
            allowSorting={true}
            headerCellRender={customHeaderCell}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "question")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "question")
                ?.filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "question")
                ?.filterType
            }
          />
          <Column
            dataField="duration_of_completion"
            caption="Duration"
            cellRender={customDurationCell}
            headerCellRender={customHeaderCell}
            minWidth={100}
            allowSorting={true}
            allowExporting={false}
            alignment={"start"}
            visible={
              defaultVisibleColumns?.find(
                (e) => e.title === "duration_of_completion"
              )?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find(
                (e) => e.title === "duration_of_completion"
              )?.filter_value
            }
            filterType={
              defaultVisibleColumns.find(
                (e) => e.title === "duration_of_completion"
              )?.filterType
            }
          />

          <Column
            dataField="attachment_type"
            caption="Required Doc."
            cellRender={viewRequirements}
            headerCellRender={customHeaderCell}
            allowSorting={false}
            alignment="center"
            allowExporting={false}
            allowHeaderFiltering={false}
            width={"100px"}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "attachment_type")
                ?.is_visible
            }
          />
          <Selection mode="single" />
          <Export enabled={true} />
          <Grouping contextMenuEnabled={true} />
          {/* <FilterRow visible={true} /> */}
          <SearchPanel visible={true} />
          <GroupPanel visible={true} allowColumnDragging={true} />
        </DataGrid>
        <AuditColumnChooser
          container="#dataGrid"
          button="#myColumnChooser"
          visible={visible}
          onHiding={onHiding}
          columns={defaultVisibleColumns}
          onApply={onApply}
          defaultColumns={templateListViewQuestions}
          view="Template Questions"
        />
      </div>
    </>
  );
};

export default Questionnaire;
