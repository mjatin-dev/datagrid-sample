import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./style.module.scss";
import Text from "../../../components/Text/Text";
import IconButton from "../../../components/Buttons/IconButton";
import {
  MdKeyboardArrowRight,
  MdDelete,
  MdKeyboardArrowLeft,
} from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import { useHistory, useRouteMatch } from "react-router";

import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";

import Container from "../../../components/Containers";
import axiosInstance from "../../../../../apiServices";
import CreateBranch from "../Modals/CreateBranch";
import { useSelector, useDispatch } from "react-redux";
import DeleteConfirmation from "../Modals/DeleteBranch";
import { setEditState } from "../../../redux/actions";
import BackDrop from "../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import {
  auditTableCell,
  customHeaderCell,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import { getSubstring } from "CommonModules/helpers/string.helpers";
import DevExtremeComponents from "Components/Audit/constants/DevEx/commonExports";
import AuditColumnChooser from "Components/Audit/components/AuditColumnChooser/AuditColumnChooser";
import { branchListView } from "Components/Audit/components/AuditColumnChooser/ColumnChooserConstants";
import { getSavedColumn } from "Components/Audit/components/AuditColumnChooser/AuditColumnChooserAPI";
import { branch_list_view } from "Components/Audit/components/AuditColumnChooser/initialsStatesForColumnChooser";

//DevEx audit filter imports
import {
  auditBranchlistObjKey,
  branch_list_search_filter_list,
  branch_list_indivisual_filter_list,
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

function AuditCompany() {
  const [isLoading, setIsLoading] = useState(false);
  const [CompanyBranchData, setCompanyBranchData] = useState([]);
  const [BranchOpen, setBranchOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [editDetails, setEditDetails] = useState({});
  const history = useHistory();
  const CompanyName = history?.location?.state?.company_name || "";
  const CompanyDocName = history?.location?.state?.company_docname || "";
  const branch_count =
    history?.location?.state?.branch_count?.toString() || "0";
  const { path } = useRouteMatch();
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const tableRef = useRef();
  const devExRef = useRef();
  const tableScrollableHeight = useScrollableHeight(tableRef, 48, [
    tableRef,
    CompanyBranchData,
  ]);

  const [visible, setVisible] = useState(false);
  const [defaultVisibleColumns, setDefaultVisibleColumns] = useState(
    JSON.parse(JSON.stringify(branch_list_view))
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

  const handleBranchOpen = (details) => {
    setBranchOpen(true);
    setEditDetails(details);
  };
  const handleDeleteOpen = (details) => {
    setEditDetails(details);
    setDeleteConfirmation(true);
  };

  const handleBranchClose = () => setBranchOpen(false);
  const handleDeleteClose = () => setDeleteConfirmation(false);

  const fetchTblData = async () => {
    const payload = { company: CompanyDocName };
    const CustomDataStore = createCustomAuditDataGridStore(
      "audit.api.getBranchDetailsUsingDevx",
      auditBranchlistObjKey,
      branch_list_search_filter_list,
      branch_list_indivisual_filter_list,
      payload,
      "branch_docname"
    );
    setCompanyBranchData(CustomDataStore);
  };

  //function to get branch list
  const getCompanyBranchData = async () => {
    try {
      const { data, status } = await axiosInstance.post(
        "audit.api.getBranchDetails",
        { company: CompanyDocName }
      );
      if (status === 200 && data && data.message && data.message.status) {
        const branches = data?.message?.company_branch_list;
        setCompanyBranchData(branches);
      } else {
        if (history.action === "PUSH") {
          history.push({
            pathname: `${path}/work-status`,
            state: {
              routeId: CompanyDocName,
              routeName: CompanyName,
            },
          });
        }
        if (history.action === "POP") {
          history.goBack();
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error.message);
      setIsLoading(false);
    }
  };

  const selectEmployee = (e) => {
    e.component.byKey(e.currentSelectedRowKeys[0]).done((employee) => {
      // setSelectedEmployee(employee);
    });
  };

  const CompanyActions = (data) => {
    return (
      <div className="d-flex justify-content-between align-items-center">
        <IconButton
          onClick={() => {
            history.push({
              pathname: `${path}/work-status`,
              state: {
                routeId: data.data?.branch_docname,
                routeName: data.data?.branch_location,
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

  const EditAction = (data) => {
    const detail = data?.data;
    return (
      <div className="d-flex justify-content-between align-items-center">
        <IconButton
          variant="iconButtonPrimary"
          description={<RiEdit2Fill />}
          onClick={() => {
            handleBranchOpen(detail);
            dispatch(setEditState(!state?.AuditReducer?.editState));
          }}
          size="none"
        />
      </div>
    );
  };
  const DeleteAction = (data) => {
    const value = data.data;
    return (
      <div className="d-flex justify-content-between align-items-center">
        <IconButton
          variant="iconButtonDanger"
          description={<MdDelete />}
          size="none"
          onClick={() => {
            handleDeleteOpen(value);
          }}
        />
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
    getSavedColumn(defaultVisibleColumns, setDefaultVisibleColumns, "Branch");
  }, []);

  useEffect(() => {
    fetchTblData();
  }, [state?.AuditReducer?.BranchData, state?.AuditReducer?.deleteBranch]);

  useEffect(() => {
    if (branch_count === "0" || branch_count === 0) {
      if (history.action === "PUSH") {
        history.push({
          pathname: `${path}/work-status`,
          state: {
            routeId: CompanyDocName,
            routeName: CompanyName,
          },
        });
      }
      if (history.action === "POP") {
        history.goBack();
      }
    }
  }, []);
  return (
    <Container variant="content">
      <BackDrop isLoading={isLoading} />
      <DeleteConfirmation
        handleClose={handleDeleteClose}
        open={deleteConfirmation}
        data={editDetails}
      />
      <CreateBranch
        handleClose={handleBranchClose}
        open={BranchOpen}
        data={editDetails}
      />
      <div className={styles.topHeading}>
        <div className="d-flex mb-3">
          <IconButton
            onClick={() => {
              history.goBack();
            }}
            variant="iconButtonRound"
            description={<MdKeyboardArrowLeft />}
            size="none"
          />
          <Text
            heading="p"
            variant="stepperMainHeading"
            text={CompanyName}
            className="mb-0 ml-3"
          />
        </div>
      </div>

      <div className="table-cell auditDevexCustomizations" ref={tableRef}>
        <DataGrid
          id="dataGrid"
          keyExpr={"branch_docname"}
          dataSource={CompanyBranchData}
          columnAutoWidth={false}
          allowColumnReordering={true}
          ref={devExRef}
          onSelectionChanged={selectEmployee}
          height={tableScrollableHeight}
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
          remoteOperations={remoteOperations}
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
            rowRenderingMode: "virtual",
            scrollByContent: true,
            scrollByThumb: true,
            showScrollbar: "onHover",
            useNative: "auto",
          }}
          onExporting={(e) =>
            exportValidation(CompanyBranchData?.length, e, "Branch List")
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
            <Item
              name="columnChooserButton"
              locateInMenu="auto"
              location="after"
            />
          </Toolbar>
          <ColumnChooser enabled={false} />
          <HeaderFilter visible={true} filter allowSearch={true} />
          <Column
            dataField="branch_location"
            caption="Branch Name"
            headerCellRender={customHeaderCell}
            cellRender={auditTableCell}
            minWidth={100}
            allowSorting={true}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "branch_location")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "branch_location")
                ?.filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "branch_location")
                ?.filterType
            }
          />
          <Column
            dataField="manager_name"
            allowSorting={true}
            caption="Manager Name"
            minWidth={100}
            cellRender={auditTableCell}
            headerCellRender={customHeaderCell}
            alignment="left"
            visible={
              defaultVisibleColumns?.find((e) => e.title === "manager_name")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "manager_name")
                ?.filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "manager_name")
                ?.filterType
            }
          />
          <Column
            dataField="manager_phone_no"
            caption="Manager No"
            allowSorting={false}
            cellRender={auditTableCell}
            headerCellRender={customHeaderCell}
            minWidth={100}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "manager_phone_no")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "manager_phone_no")
                ?.filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "manager_phone_no")
                ?.filterType
            }
          />
          <Column
            dataField="manager_emailid"
            allowSorting={false}
            caption="Email Id"
            headerCellRender={customHeaderCell}
            cellRender={auditTableCell}
            minWidth={100}
            alignment="left"
            visible={
              defaultVisibleColumns?.find((e) => e.title === "manager_emailid")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "manager_emailid")
                .filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "manager_emailid")
                .filterType
            }
          />
          <Column
            cellRender={EditAction}
            allowSorting={false}
            caption="Edit"
            width={"50px"}
            headerCellRender={customHeaderCell}
            allowExporting={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "edit")?.is_visible
            }
          >
            <RequiredRule />
          </Column>
          <Column
            cellRender={DeleteAction}
            caption="Delete"
            width={"60px"}
            headerCellRender={customHeaderCell}
            allowExporting={false}
            allowSorting={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "delete")
                ?.is_visible
            }
          >
            <RequiredRule />
          </Column>
          <Column
            width={"50px"}
            allowSorting={false}
            cellRender={CompanyActions}
            allowExporting={false}
          >
            <RequiredRule />
          </Column>

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
          defaultColumns={branchListView}
          view="Branch"
        />
      </div>
    </Container>
  );
}
export default AuditCompany;
