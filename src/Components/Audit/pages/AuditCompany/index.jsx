import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./style.module.scss";
import Text from "../../components/Text/Text";
import IconButton from "../../components/Buttons/IconButton";
import { MdAddBox, MdKeyboardArrowRight, MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import { useHistory, useRouteMatch } from "react-router";
import DeleteConfirmation from "./Modals/DeleteCompany";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import Container from "../../components/Containers";
import axiosInstance from "../../../../apiServices/";
import CreateCompany from "./Modals/CreateCompany";
import CreateBranch from "./Modals/CreateBranch";
import { useSelector, useDispatch } from "react-redux";
import { setEditState } from "../../redux/actions";
import BackDrop from "../../../../CommonModules/sharedComponents/Loader/BackDrop";
import {
  auditTableCell,
  customHeaderCell,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import DevExtremeComponents from "Components/Audit/constants/DevEx/commonExports";

//devEx column chooser imports
import AuditColumnChooser from "Components/Audit/components/AuditColumnChooser/AuditColumnChooser";
import { companyListView } from "Components/Audit/components/AuditColumnChooser/ColumnChooserConstants";
import { getSavedColumn } from "Components/Audit/components/AuditColumnChooser/AuditColumnChooserAPI";
import { company_list_view } from "Components/Audit/components/AuditColumnChooser/initialsStatesForColumnChooser";

//DevEx audit filter imports
import {
  auditCompanylistObjKey,
  company_list_search_filter_list,
  company__list_indivisual_filter_list,
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
  SearchPanel,
  Export,
  Toolbar,
  Item,
  GroupPanel,
  Selection,
  Grouping,
  ColumnChooser,
  HeaderFilter
} = DevExtremeComponents;

function AuditCompany() {
  const [isLoading, setIsLoading] = useState(false);
  const [CompanyOpen, setCompanyOpen] = useState(false);
  const [BranchOpen, setBranchOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [editDetails, setEditDetails] = useState({});
  const [deleteData, setDeleteData] = useState({});
  const [auditCompanyData, setAuditCompanyData] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { path } = useRouteMatch();

  const tableRef = useRef();
  const devExRef = useRef();
  const tableScrollableHeight = useScrollableHeight(tableRef, 48, [
    tableRef,
    auditCompanyData,
  ]);

  const [visible, setVisible] = useState(false);
  const [defaultVisibleColumns, setDefaultVisibleColumns] =
    useState(JSON.parse(JSON.stringify(company_list_view)));

  //custom hook to clear filter
  const customClearFilter = useCustomFilter(devExRef, setDefaultVisibleColumns, defaultVisibleColumns);

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

  const handleCompanyOpen = (details) => {
    setCompanyOpen(true);
    setEditDetails(details);
  };

  const handleDeleteOpen = (details) => {
    setDeleteData(details);
    setDeleteConfirmation(true);
  };

  const handleCompanyClose = () => setCompanyOpen(false);
  const handleBranchClose = () => setBranchOpen(false);
  const handleDeleteClose = () => setDeleteConfirmation(false);

  const fetchTblData = async () => {
    const CustomDataStore = createCustomAuditDataGridStore(
      "audit.api.getCompanyDetailsUsingDevx",
      auditCompanylistObjKey,
      company_list_search_filter_list,
      company__list_indivisual_filter_list,
      {},
      "company_docname",
    );
    setAuditCompanyData(CustomDataStore);
  };

  const selectEmployee = (e) => {
    e.component.byKey(e.currentSelectedRowKeys[0]).done((employee) => {
      // setSelectedEmployee(employee);
    });
  };

  const EditAction = (data) => {
    const detail = data?.data;
    return (
      <div className="d-flex justify-content-between align-items-center">
        <IconButton
          variant="iconButtonPrimary"
          description={<RiEdit2Fill />}
          onClick={() => {
            handleCompanyOpen(detail);
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

  const CompanyActions = (data) => {
    const { company_docname, company_name,branch_count } = data.data;
    return (
      <div className="d-flex justify-content-start align-items-center">
        <IconButton
          onClick={() => {
            history.push({
              pathname: `${path}/branches`,
              state: {
                company_name: company_name,
                company_docname: company_docname,
                branch_count:branch_count
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
    getSavedColumn(defaultVisibleColumns, setDefaultVisibleColumns, "Company");
  }, []);

  useEffect(() => {
    // getAuditCompanyData();
    fetchTblData();
  }, [
    state?.AuditReducer?.BranchData,
    state?.AuditReducer?.CompanyData,
    state?.AuditReducer?.deleteCompany,
  ]);

  return (
    <Container variant="content">
      <BackDrop isLoading={isLoading} />
      <DeleteConfirmation
        handleClose={handleDeleteClose}
        open={deleteConfirmation}
        data={deleteData}
      />
      <CreateBranch
        handleClose={handleBranchClose}
        open={BranchOpen}
        data={editDetails}
      />
      <CreateCompany
        handleClose={handleCompanyClose}
        open={CompanyOpen}
        data={editDetails || []}
      />
      <div
        className={`${styles.topHeading} d-flex align-items-center justify-content-between`}
      >
        <Text heading="p" variant="stepperMainHeading" text="Company" />
      </div>
      <div className="table-cell auditDevexCustomizations" ref={tableRef}>
        <DataGrid
          keyExpr={"company_docname"}
          id="dataGrid"
          ref={devExRef}
          dataSource={auditCompanyData}
          columnAutoWidth={false}
          allowColumnReordering={true}
          onSelectionChanged={selectEmployee}
          paging={false}
          height={tableScrollableHeight}
          showColumnLines={false}
          showBorders={false}
          showRowLines={false}
          wordWrapEnabled={true}
          width="100%"
          remoteOperations={remoteOperations}
          onOptionChanged={(e) =>
            handleColumnChange(
              e,
              defaultVisibleColumns,
              setDefaultVisibleColumns,
              devExRef
            )
          }
          selection={{
            mode: "multiple",
            showCheckBoxesMode: "always",
          }}
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
            exportValidation(auditCompanyData?.length, e, `Company List`)
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
            <Item location="after">
              <div className="d-flex">
                <IconButton
                  description="New Company"
                  variant="createCompanyBtn"
                  icon={<MdAddBox />}
                  onClick={() => {
                    setEditDetails({});
                    handleCompanyOpen();
                  }}
                />
                <IconButton
                  description="New Branch"
                  variant="createCompanyBtn"
                  icon={<MdAddBox />}
                  onClick={() => {
                    setEditDetails({});
                    handleBranchOpen();
                  }}
                />
              </div>
            </Item>
            <Item name="groupPanel" />
            <Item
              name="columnChooserButton"
              locateInMenu="auto"
              location="after"
            />
            <Item name="exportButton" />
            <Item name="searchPanel" />
          </Toolbar>
          <ColumnChooser enabled={false} />
          <HeaderFilter visible={true} filter allowSearch={true} />
          
          <Column
            dataField="company_name"
            caption="Company Name"
            headerCellRender={customHeaderCell}
            allowSorting={true}
            cellRender={auditTableCell}
            minWidth={150}
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
          />
          <Column
            dataField="register_id"
            caption="Registration No."
            cellRender={auditTableCell}
            allowSorting={true}
            minWidth={150}
            headerCellRender={customHeaderCell}
            alignment="left"
            visible={
              defaultVisibleColumns?.find((e) => e.title === "register_id")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "register_id")
                .filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "register_id")
                .filterType
            }
          />
          <Column
            dataField="company_type"
            caption="Company Category"
            cellRender={auditTableCell}
            minWidth={150}
            allowSorting={true}
            headerCellRender={customHeaderCell}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "company_type")
                ?.is_visible
            }
            // filterValues={
            //   defaultVisibleColumns.find((e) => e.title === "company_type")
            //     .filter_value
            // }
            // filterType={
            //   defaultVisibleColumns.find((e) => e.title === "company_type")
            //     .filterType
            // }
          />
          <Column
            dataField="phone_no"
            caption="Contact No."
            allowSorting={false}
            headerCellRender={customHeaderCell}
            cellRender={auditTableCell}
            minWidth={100}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "phone_no")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "phone_no")
                .filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "phone_no")
                .filterType
            }
          />
          <Column
            dataField="email_id"
            caption="Email Id"
            allowSorting={false}
            headerCellRender={customHeaderCell}
            cellRender={auditTableCell}
            minWidth={100}
            alignment="left"
            visible={
              defaultVisibleColumns?.find((e) => e.title === "email_id")
                ?.is_visible
            }
            filterValues={
              defaultVisibleColumns.find((e) => e.title === "email_id")
                .filter_value
            }
            filterType={
              defaultVisibleColumns.find((e) => e.title === "email_id")
                .filterType
            }
          />
          <Column
            dataField="branch_count"
            caption="Branches"
            dataType={"number"}
            headerCellRender={customHeaderCell}
            cellRender={auditTableCell}
            width={"80px"}
            alignment="center"
            allowSorting={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "branch_count")
                ?.is_visible
            }
            allowHeaderFiltering={false}
          />
          <Column
            cellRender={EditAction}
            caption="Edit"
            width={"50px"}
            headerCellRender={customHeaderCell}
            allowSorting={false}
            allowExporting={false}
            visible={
              defaultVisibleColumns?.find((e) => e.title === "edit")?.is_visible
            }
            allowHeaderFiltering={false}
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
            cellRender={CompanyActions}
            width={"50px"}
            allowExporting={false}
            alignment="center"
          >
            <RequiredRule />
          </Column>

          <ColumnFixing enabled={true} />
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
          defaultColumns={companyListView}
          view="Company"
        />
      </div>
    </Container>
  );
}

export default AuditCompany;
