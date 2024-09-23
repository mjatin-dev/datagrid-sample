import Dots from "CommonModules/sharedComponents/Loader/Dots";
import { exportGrid } from "Components/Audit/constants/CommonFunction";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import { DataGrid, Toolbar } from "devextreme-react";
import { useRouteMatch, useHistory } from "react-router";
import {
  Column,
  ColumnChooser,
  GroupPanel,
  HeaderFilter,
  Item,
  SearchPanel,
  Selection,
} from "devextreme-react/data-grid";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { eventsModuleActions } from "Components/Events/redux/actions";
import { getRegisteredSMEUsers } from "Components/Events/api";

const RegisteredSME = () => {
  const [usersList, setUsersList] = useState([]);
  const containerRef = useRef();
  const tableRef = useRef();
  const dispatch = useDispatch();
  const scrollableHeight = useScrollableHeight(containerRef);
  const isLoading = false;
  const history = useHistory();
  const { path } = useRouteMatch();

  const clearFilter = () => {
    const dataGrid = tableRef.current.instance;
    dataGrid.clearSelection();
    dataGrid.clearFilter();
  };

  const renderActionsCount = (data) => {
    return (
      <div
        className="initial-name__container"
        style={{ backgroundColor: "red" }}
      >
        <span className="initial-name text-white">{data.value}</span>
      </div>
    );
  };
  const fetchRegisteredSME = async () => {
    try {
      const { data, status } = await getRegisteredSMEUsers();
      if (status === 200 && data?.message && data?.message?.status) {
        const sme_user_list = data?.message?.sme_user_list || [];
        setUsersList(
          sme_user_list.map((item) => ({ ...item, email: item.email_id }))
        );
      } else {
        setUsersList([]);
        toast.error(data?.message?.status_response);
      }
    } catch (error) {
      setUsersList([]);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    fetchRegisteredSME();
  }, []);
  return (
    <>
      <div
        ref={containerRef}
        style={{ height: scrollableHeight, overflow: "auto" }}
        className="compliance-event-table mt-3"
      >
        {isLoading ? (
          <Dots />
        ) : (
          <DataGrid
            ref={tableRef}
            dataSource={usersList}
            noDataText="No SME Users Found"
            height="100%"
            scrolling={{
              columnRenderingMode: "standard",
              mode: "standard",
              preloadEnabled: false,
              renderAsync: undefined,
              rowRenderingMode: "virtual",
              useNative: true,
            }}
            onCellClick={(e) => {
              if (
                e.column.caption !== "Actions" &&
                e.column.type !== "selection" &&
                e.rowType === "data" &&
                Object.keys(e.row.data).length > 0
              ) {
                dispatch(eventsModuleActions.setSelectedUser(e.data));
                history.push(`${path}/registered-sme`, e.data);
                // dispatch(
                //   eventsModuleActions.setModalState({
                //     isVisible: true,
                //     data: {
                //       ...(e.data || {}),
                //     },
                //   })
                // );
              }
            }}
            allowColumnReordering={false}
            wordWrapEnabled={true}
            columnAutoWidth={true}
            showColumnLines={true}
            width="100%"
            paging={{
              enabled: false,
            }}
            onExporting={(e) => {
              if (
                e.component.getSelectedRowKeys().length === 0 &&
                e.component.getController("export")._selectionOnly
              ) {
                toast.error("Please select rows");
                e.cancel = true;
                return;
              }
              exportGrid(e, "Circulars");
            }}
            export={{
              allowExportSelectedData: true,
              enabled: true,
              texts: {
                exportAll: "Export all data",
                exportSelectedRows: "Export selected rows",
                exportTo: "Export",
              },
            }}
          >
            <Toolbar>
              <Item
                widget="dxButton"
                options={{
                  text: "Reset",
                  type: "normal",
                  stylingMode: "outlined",
                  onClick: clearFilter,
                }}
                location="after"
              />
              <Item name="exportButton" />
              <Item name="searchPanel" />
              <Item name="groupPanel" location="before" />
            </Toolbar>
            <GroupPanel visible={true} />
            <SearchPanel visible={true} />
            <HeaderFilter visible={true} filter allowSearch={true} />
            <ColumnChooser enabled={true} mode="select" />
            <Selection
              mode="multiple"
              allowSelectAll="allPages"
              showCheckBoxesMode="always"
            />
            <Column
              dataField="full_name"
              caption="Full Name"
              dataType="string"
              minWidth={140}
            />
            <Column
              dataField="domain"
              caption="Domain Name"
              dataType="string"
            />
            <Column
              dataField="mobile_no"
              caption="Mobile Number"
              dataType="string"
            />
            <Column dataField="email_id" caption="Email Id" dataType="email" />
            <Column
              dataField="country"
              caption="Country"
              dataType="string"
              width={160}
            />
            <Column
              dataField="action_count"
              caption="Actions"
              dataType="string"
              cellRender={renderActionsCount}
            />
          </DataGrid>
        )}
      </div>
    </>
  );
};

export default RegisteredSME;
