/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from "react";
import BackDrop from "../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import styles from "./style.module.scss";
import ProjectManagementModal from "../../../../ProjectManagement/components/ProjectManagementModal";
import { Input } from "../../../components/Inputs/Input";
import { useDispatch, useSelector } from "react-redux";
import { auditTemplateActions } from "../../../redux/auditTemplateActions";
import auditApis from "../../../api/index";
import { toast } from "react-toastify";
import {
  auditTableCell,
  customDurationCell,
  customHeaderCell,
  docsReliedUponCell,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
import AuditReferenceModal from "Components/Audit/components/ReferenceComponent";
import DevExtremeComponents from "Components/Audit/constants/DevEx/commonExports";
import AuditColumnChooser from "Components/Audit/components/AuditColumnChooser/AuditColumnChooser";
import { templateListViewCheckList } from "Components/Audit/components/AuditColumnChooser/ColumnChooserConstants";
import { getSavedColumn } from "Components/Audit/components/AuditColumnChooser/AuditColumnChooserAPI";
import { template_List_View_CheckList } from "Components/Audit/components/AuditColumnChooser/initialsStatesForColumnChooser";
import RequiredDocPopup from "Components/Audit/components/CustomCells/RequiredDocPopup";
import IconButton from "Components/Audit/components/Buttons/IconButton";

//DevEx audit filter imports
import {
  auditTemplateChecklistlistObjKey,
  template_checklist_list_search_filter_list,
  template_checklist_list_indivisual_filter_list,
} from "Components/Audit/components/AuditFilters/filterConstants";
import { createCustomAuditDataGridStore } from "Components/Audit/components/AuditFilters/filter";
import { handleColumnChange } from "Components/Audit/components/AuditFilters/columnChange";
import { isAuditFiltersApplied } from "Components/Audit/components/AuditFilters/commonFunctions";
import useCustomFilter from "Components/Audit/components/AuditFilters/customHook";
import { setLongTextPoup } from "Components/Audit/redux/actions";
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

const Checkpoints = ({ templateId, templateName }) => {
  const [isShowReferenceData, setShowReferenceData] = useState({
    isShowReference: false,
    question_id: "",
  });

  const tableRef = useRef();
  const devExRef = useRef();

  const userTypeNo = useSelector(
    (state) => state?.auth?.loginInfo?.auditUserType
  );
  const [references, setReferences] = useState([]);
  // const { checklist: checkpointsData } = useSelector(
  //   (state) => state?.AuditReducer?.AuditTemplateData
  // );
  const [isLoading, setIsLoading] = useState(false);
  const [checkpoints, setCheckpoints] = useState([]);
  const dispatch = useDispatch();
  const [requiredDocPopup, setRequiredDocPopup] = useState({
    show: false,
    data: {},
  });

  const [visible, setVisible] = useState(false);
  const [defaultVisibleColumns, setDefaultVisibleColumns] = useState(
    JSON.parse(JSON.stringify(template_List_View_CheckList))
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

  const fetchTblData = async () => {
    const payload = { audit_template_id: templateId };
    const CustomDataStore = createCustomAuditDataGridStore(
      "audit.api.getTemplateFilterCheckList",
      auditTemplateChecklistlistObjKey,
      template_checklist_list_search_filter_list,
      template_checklist_list_indivisual_filter_list,
      payload,
      "check_point_id"
    );
    setCheckpoints(CustomDataStore);
  };

  const customDataCell = (option) => {
    const { value } = option;
    return (
      <span title={value} className={styles.customDataCell}>
        {value || "-"}
      </span>
    );
  };

  const CustomStatusCell = (data) => {
    const { severity, check_point_id } = data.data;
    return (
      <div className="d-flex align-items-center">
        <Input
          type="select"
          disabled={userTypeNo === 8 || userTypeNo === 14 || userTypeNo === 3}
          placeholder="select"
          variant="tableDataSelectInput"
          value={severity || null}
          onChange={(e) => onSeverityUpdate(e, check_point_id)}
          valueForDropDown={["Low", "Medium", "High"]}
        />
      </div>
    );
  };

  const onSeverityUpdate = async (e, check_point_id) => {
    const severity = e.target.value;
    setIsLoading(true);
    try {
      const { data, status } = await auditApis.updateSeverityInCheckList({
        check_point_id,
        severity,
      });
      if (status === 200 && data && data?.message?.status) {
        fetchTblData();
        toast.success("Severity successfully updated.");
        setIsLoading(false);
      } else {
        toast.error(
          data?.message?.status_response || "Unable to update severity"
        );
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Something went wrong");
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
    // dispatch(auditTemplateActions.getAuditTemplatesCheckpointList(templateId));
    fetchTblData();
    getSavedColumn(
      defaultVisibleColumns,
      setDefaultVisibleColumns,
      "Template Checklist"
    );
  }, []);

  return (
    <>
      <BackDrop isLoading={isLoading} />
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
      <div className="auditDevexCustomizations" ref={tableRef}>
        <DataGrid
          id="dataGrid"
          dataSource={checkpoints}
          columnAutoWidth={false}
          allowColumnReordering={true}
          paging={false}
          ref={devExRef}
          showColumnLines={false}
          showBorders={false}
          showRowLines={false}
          wordWrapEnabled={true}
          width="100%"
          // allowColumnResizing={true}
          selection={{
            mode: "multiple",
            showCheckBoxesMode: "always",
          }}
          onExporting={(e) =>
            exportValidation(
              checkpoints?.length,
              e,
              `${templateName} (Checkpoints)`
            )
          }
          export={{
            allowExportSelectedData: true,
            enabled: true,
          }}
          height={document.body.clientHeight - 210}
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
          remoteOperations={remoteOperations}
          onOptionChanged={(e) =>
            handleColumnChange(
              e,
              defaultVisibleColumns,
              setDefaultVisibleColumns,
              devExRef
            )
          }
          columnChooser={{
            enabled: false,
          }}
          sorting={{
            mode: "multiple",
          }}
          onToolbarPreparing={onToolbarPreparing}
        >
          <SearchPanel visible={true} />
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
            dataField="checklist_section"
            caption="Section Name"
            cellRender={auditTableCell}
            allowSorting={true}
            minWidth={200}
            headerCellRender={customHeaderCell}
            visible={
              defaultVisibleColumns?.find(
                (e) => e.title === "checklist_section"
              )?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "checklist_section")
                ?.filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "checklist_section")
                ?.filterType
            }
          />
          <Column
            dataField="check_point"
            caption="Checkpoint"
            allowSorting={true}
            cellRender={(e) => auditPopupCell(e, "Checkpoint")}
            minWidth={200}
            headerCellRender={customHeaderCell}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "check_point")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "check_point")
                ?.filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "check_point")
                ?.filterType
            }
          />
          <Column
            dataField="attachment_format"
            width={"100px"}
            caption="Required Type"
            allowSorting={false}
            cellRender={viewRequirements}
            headerCellRender={customHeaderCell}
            alignment="center"
            allowExporting={false}
            visible={
              defaultVisibleColumns?.find(
                (e) => e.title === "attachment_format"
              )?.is_visible
            }
            allowHeaderFiltering={false}
          />
          <Column
            dataField="duration_of_completion"
            caption="Duration"
            allowSorting={true}
            cellRender={customDurationCell}
            width={"100px"}
            headerCellRender={customHeaderCell}
            alignment="center"
            allowExporting={false}
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
            dataField="documents_relied_upon"
            caption="Docs. Relied Upon"
            allowSorting={false}
            cellRender={(data) =>
              docsReliedUponCell(data, setShowReferenceData)
            }
            headerCellRender={customHeaderCell}
            visible={
              defaultVisibleColumns?.find(
                (e) => e.title === "documents_relied_upon"
              )?.is_visible
            }
            width={"200px"}
            filterValues={
              defaultVisibleColumns.find(
                (e) => e.title === "documents_relied_upon"
              )?.filter_value
            }
            filterType={
              defaultVisibleColumns.find(
                (e) => e.title === "documents_relied_upon"
              )?.filterType
            }
          />
          <Column
            dataField="severity"
            caption="Severity"
            cellRender={CustomStatusCell}
            headerCellRender={customHeaderCell}
            allowGrouping={false}
            allowSorting={false}
            width={"120px"}
            alignment="center"
            visible={
              defaultVisibleColumns?.find((e) => e.title === "severity")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "severity")
                ?.filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "severity")
                ?.filterType
            }
          />
          <Column
            dataField="how_to_verify"
            minWidth={150}
            allowSorting={false}
            caption="How To Verify"
            cellRender={customDataCell}
            headerCellRender={customHeaderCell}
            alignment="center"
            visible={
              defaultVisibleColumns?.find((e) => e.title === "how_to_verify")
                ?.is_visible
            }
            allowHeaderFiltering={false}
          />
          <Column
            dataField="penalty"
            caption="Penalty"
            allowSorting={false}
            cellRender={customDataCell}
            headerCellRender={customHeaderCell}
            alignment="center"
            allowExporting={false}
            width={"80px"}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "penalty")
                ?.is_visible
            }
            allowHeaderFiltering={false}
          />
          <Selection mode="single" />
          <Export enabled={true} />
          {/* <FilterRow visible={true} /> */}
          <Grouping contextMenuEnabled={true} />
          <GroupPanel visible={true} allowColumnDragging={true} />
        </DataGrid>
        <AuditColumnChooser
          container="#dataGrid"
          button="#myColumnChooser"
          visible={visible}
          onHiding={onHiding}
          columns={defaultVisibleColumns}
          onApply={onApply}
          defaultColumns={templateListViewCheckList}
          view="Template Checklist"
        />
      </div>
    </>
  );
};

export default Checkpoints;
