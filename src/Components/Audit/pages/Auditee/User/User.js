import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import styles from "./style.module.scss";
import Text from "../../../components/Text/Text";
import IconButton from "../../../components/Buttons/IconButton";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import auditApis from "../../../api/index";
import { v4 as uuidv4 } from "uuid";
import {
  MdAddBox,
  MdKeyboardArrowRight,
  MdModeEdit,
  MdDelete,
} from "react-icons/md";
import Container from "../../../components/Containers";
import { toast } from "react-toastify";
import CreateUser from "../../AuditUsers/NewUser";
import DeleteConfirmation from "../../AuditUsers/NewUser/DeleteUser";
import BackDrop from "../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import {
  customHeaderCell,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
import { getSubstring } from "CommonModules/helpers/string.helpers";
import DevExtremeComponents from "Components/Audit/constants/DevEx/commonExports";
const {
  DataGrid,
  Column,
  RequiredRule,
  Toolbar,
  Item,
  SearchPanel,
  GroupPanel,
  FilterRow,
} = DevExtremeComponents;

function Users() {
  const history = useHistory();
  const { path } = useRouteMatch();
  const [dataSource, setDataSource] = useState([]);
  const [userOpen, setUserOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [editDetails, setEditDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const handleUserOpen = useCallback((details) => {
    setUserOpen(true);
    setEditDetails(details);
  }, []);

  const handleDeleteOpen = (details) => {
    setEditDetails(details);
    setDeleteConfirmation(true);
  };
  const handleUserClose = () => {
    setUserOpen(false);
    setEditDetails({});
  };
  const handleDeleteClose = () => setDeleteConfirmation(false);

  const getUsersList = async () => {
    try {
      setIsLoading(true);
      const { data, status } = await auditApis.fetchUsersList();
      if (status === 200 && data && data.message?.status) {
        let usersList = data?.message?.User_list || [];
        usersList = [...usersList].map((item) => ({
          ID: uuidv4(),
          ...item,
          role: item?.highest_role?.against_role_type || "-",
        }));
        setDataSource(usersList);
        setIsLoading(false);
      } else {
        toast.error(
          data?.message?.stauts_response || "Unable to fetch users list"
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      setIsLoading(false);
    }
  };

  const TemplateNameCell = (data) => {
    const value = data?.value;
    return (
      <span className={styles.balckTextCell} title={value}>
        {getSubstring(value)}
      </span>
    );
  };

  const RoleCustomCell = (data) => {
    const { role } = data.data;
    return (
      <span className={styles.balckTextCell} title={role}>
        {role}
      </span>
    );
  };

  const ExpertiseCustomCell = (data) => {
    const { expertise } = data?.data;
    return (
      <span className={styles.balckTextCell} title={expertise || ""}>
        {expertise || "-"}
      </span>
    );
  };

  const MobileNumberCell = (data) => {
    const { phone } = data?.data;
    return (
      <span className={styles.balckTextCell} title={phone || ""}>
        {phone || "-"}
      </span>
    );
  };

  const editActions = (data) => {
    const detail = data.key;
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div className="px-1">
          <IconButton
            variant="iconButtonPrimary"
            description={<MdModeEdit />}
            onClick={() => {
              handleUserOpen(detail);
              // dispatch(setEditState(!state?.AuditReducer?.editState));
            }}
            size="none"
          />
        </div>
      </div>
    );
  };
  const deleteAction = (data) => {
    const value = data.data;
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div className="px-1">
          <IconButton
            variant="iconButtonDanger"
            description={<MdDelete />}
            onClick={() => {
              handleDeleteOpen(value);
            }}
            size="none"
          />
        </div>
      </div>
    );
  };

  const TemplateActions = (data) => {
    const user = data.data;
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div className="px-1">
          <IconButton
            onClick={() => {
              history.push(`${path}/work-status`, { user });
            }}
            variant="iconButtonRound"
            description={<MdKeyboardArrowRight />}
            size="none"
          />
        </div>
      </div>
    );
  };

  useEffect(() => {
    getUsersList();
  }, []);
  return (
    <>
      <BackDrop isLoading={isLoading} />
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

      <Container variant="content">
        <div className="d-flex justify-content-between align-items-center">
          <Text heading="p" variant="stepperMainHeading" text="Users" />
        </div>
        <div className={styles.headerBorder}></div>

        <DataGrid
          id="dataGrid"
          dataSource={dataSource}
          columnAutoWidth={true}
          allowColumnReordering={true}
          paging={{ pageSize: 6 }}
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
            rowRenderingMode: "virtual",
            scrollByContent: true,
            scrollByThumb: true,
            showScrollbar: "onHover",
            useNative: "auto",
          }}
          onExporting={(e) =>
            exportValidation(dataSource?.length, e, `User List`)
          }
          export={{
            allowExportSelectedData: true,
            enabled: true,
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
            cellRender={TemplateNameCell}
          />
          <Column
            dataField="expertise"
            caption="Expertise"
            headerCellRender={customHeaderCell}
            cellRender={ExpertiseCustomCell}
          />
          <Column
            dataField="role"
            caption="Role"
            headerCellRender={customHeaderCell}
            cellRender={RoleCustomCell}
          />
          <Column
            dataField="phone"
            caption="Mobile No."
            headerCellRender={customHeaderCell}
            cellRender={MobileNumberCell}
          />
          <Column
            dataField="email"
            caption="Email"
            headerCellRender={customHeaderCell}
            cellRender={TemplateNameCell}
          />
          <Column
            caption="Edit"
            headerCellRender={customHeaderCell}
            cellRender={editActions}
            allowEditing={false}
          />
          <Column
            caption="Delete"
            headerCellRender={customHeaderCell}
            cellRender={deleteAction}
            allowEditing={false}
          />
          <Column cellRender={TemplateActions}>
            <RequiredRule />
          </Column>
          <SearchPanel visible={true} />
          <FilterRow visible={true} />
          <GroupPanel visible={true} allowColumnDragging={true} />
        </DataGrid>
      </Container>
    </>
  );
}

export default Users;
