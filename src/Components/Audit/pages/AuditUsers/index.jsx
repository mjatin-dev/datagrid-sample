import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./style.module.scss";
import Text from "../../components/Text/Text";
import IconButton from "../../components/Buttons/IconButton";
import { MdAddBox, MdKeyboardArrowRight, MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import { useHistory, useRouteMatch } from "react-router";
import DeleteConfirmation from "./NewUser/DeleteUser";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import { v4 as uuidv4 } from "uuid";
import BackDrop from "../../../../CommonModules/sharedComponents/Loader/BackDrop";

import {
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
} from "devextreme-react/data-grid";
import Container from "../../components/Containers";
import axiosInstance from "../../../../apiServices/";
import CreateUser from "./NewUser";
import { useSelector, useDispatch } from "react-redux";
import { setEditState } from "../../redux/actions";
import { toast } from "react-toastify";
import {
  customHeaderCell,
  exportGrid,
} from "Components/Audit/constants/CommonFunction";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";

function AuditUser() {
  const [userOpen, setUserOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [editDetails, setEditDetails] = useState({});
  const [auditCompanyData, setAuditCompanyData] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { path } = useRouteMatch();

  const tableRef = useRef();
  const tableScrollableHeight = useScrollableHeight(tableRef, 48, [
    tableRef,
    auditCompanyData,
  ]);

  //function to open user Modal
  const handleUserOpen = useCallback((details) => {
    setUserOpen(true);
    setEditDetails(details);
  }, []);

  //function to open delete modal
  const handleDeleteOpen = (details) => {
    setEditDetails(details);
    setDeleteConfirmation(true);
  };

  //function to close user modal
  const handleUserClose = () => setUserOpen(false);

  //function to close delete modal
  const handleDeleteClose = () => setDeleteConfirmation(false);

  //function to fetch User Details
  const getAuditUserData = async () => {
    try {
      setIsLoading(true);
      const { data, status } = await axiosInstance.post(
        "audit.api.getUserByRole"
      );
      if (status === 200 && data && data.message && data.message.status) {
        const company = data?.message?.User_list;
        const arr = [];
        company.map((item) => {
          arr.push({
            ID: uuidv4(),
            first_name: item.first_name,
            email: item.email,
            phone: item.phone,
            expertise: item.expertise,
            company: item.company,
            role: item.highest_role.against_role_type,
          });
        });
        setAuditCompanyData(arr);
        setIsLoading(false);
      } else {
        setAuditCompanyData([]);
        setIsLoading(false);
        toast.error("something went wrong");
      }
    } catch (error) {
      console.log(error.message);
      setIsLoading(false);
      toast.error("something went wrong");
    }
  };

  const selectEmployee = (e) => {
    e.component.byKey(e.currentSelectedRowKeys[0]).done((employee) => {
      // setSelectedEmployee(employee);
    });
  };

  const companyFieldCell = (data) => {
    const value = data?.value;
    return (
      <span className={styles.balckTextCell} title={value}>
        {value || "-"}
      </span>
    );
  };

  //fuction to trigger Edit User
  const EditAction = (data) => {
    const detail = data.key;
    return (
      <div className="d-flex justify-content-between align-items-center">
        <IconButton
          variant="iconButtonPrimary"
          description={<RiEdit2Fill />}
          onClick={() => {
            handleUserOpen(detail);
            dispatch(setEditState(!state?.AuditReducer?.editState));
          }}
          size="none"
        />
      </div>
    );
  };

  //function to trigger delete
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

  //function to redirect to another page
  const CompanyActions = (data) => {
    const dat = data.data;
    return (
      <div className="d-flex justify-content-between align-items-center">
        <IconButton
          onClick={() => {
            history.push({
              pathname: `${path}/work-user`,
              state: {
                first_name: dat.first_name,
                email: dat.email,
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

  const RequiredDataCell = (data) => {
    const value = data?.value;
    return <span className={styles.textBlueDataCell}>{value}&nbsp;</span>;
  };

  //function to export data in to excel
  const exportFunction = (e) => {
    exportGrid(e, "User List");
  };

  useEffect(() => {
    getAuditUserData();
  }, [state?.AuditReducer?.editState]);

  return (
    <>
      <BackDrop isLoading={isLoading} />
      <Container variant="content">
        <DeleteConfirmation
          handleClose={handleDeleteClose}
          open={deleteConfirmation}
          data={editDetails}
        />

        <CreateUser
          handleClose={handleUserClose}
          open={userOpen}
          data={editDetails}
        />
        <div
          className={`${styles.topHeading} d-flex align-items-center justify-content-between`}
        >
          <Text heading="p" variant="stepperMainHeading" text="Users" />
        </div>
        <div className="table-cell" ref={tableRef}>
          <DataGrid
            id="dataGrid"
            dataSource={auditCompanyData}
            columnAutoWidth={true}
            allowColumnReordering={true}
            onSelectionChanged={selectEmployee}
            onExporting={exportFunction}
            paging={false}
            height={tableScrollableHeight}
            showColumnLines={false}
            showBorders={false}
            showRowLines={false}
            wordWrapEnabled={true}
            width="100%"
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
          >
            <Toolbar>
              <Item location="after">
                <IconButton
                  description="New User"
                  variant="createProject"
                  icon={<MdAddBox />}
                  onClick={() => handleUserOpen()}
                />
              </Item>
              <Item name="exportButton" />
              <Item name="searchPanel" />
              <Item name="groupPanel" location="before" />
            </Toolbar>
            <Column
              dataField="first_name"
              caption="User Name"
              headerCellRender={customHeaderCell}
              cellRender={companyFieldCell}
            >
              <RequiredRule />
            </Column>
            <Column
              dataField="expertise"
              caption="Expertise"
              cellRender={companyFieldCell}
              headerCellRender={customHeaderCell}
              alignment="left"
            >
              <RequiredRule />
            </Column>
            <Column
              dataField="role"
              caption="Role"
              cellRender={companyFieldCell}
              headerCellRender={customHeaderCell}
            >
              <RequiredRule />
            </Column>
            <Column
              dataField="phone"
              caption="Mobile No"
              headerCellRender={customHeaderCell}
              cellRender={companyFieldCell}
            >
              <RequiredRule />
            </Column>
            <Column
              dataField="email"
              caption="Email Id"
              headerCellRender={customHeaderCell}
              cellRender={companyFieldCell}
              alignment="left"
            />
            <Column
              cellRender={EditAction}
              caption="Edit"
              headerCellRender={customHeaderCell}
            >
              <RequiredRule />
            </Column>
            <Column
              cellRender={DeleteAction}
              caption="Delete"
              headerCellRender={customHeaderCell}
            >
              <RequiredRule />
            </Column>
            <Column cellRender={CompanyActions}>
              <RequiredRule />
            </Column>
            <ColumnFixing enabled={true} />
            <FilterRow visible={true} />
            <SearchPanel visible={true} />
            <Grouping contextMenuEnabled={true} />

            <GroupPanel visible={true} allowColumnDragging={true} />
            <Export enabled={true} />
            <Selection mode="single" />
          </DataGrid>
        </div>
      </Container>
    </>
  );
}

export default AuditUser;
