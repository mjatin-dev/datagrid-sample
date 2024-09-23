import { IconButton } from "@mui/material";
import { exportGrid } from "Components/Audit/constants/CommonFunction";
import { eventsModuleActions } from "Components/Events/redux/actions";
import CommentIcon from "assets/Icons/UserText.png";
import {
  Column,
  ColumnChooser,
  GroupPanel,
  HeaderFilter,
  Item,
  SearchPanel,
  Selection,
  DataGrid,
  Toolbar,
} from "devextreme-react/data-grid";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const LicenceListForApprover = ({
  onChildItemsOperations,
  onParentItemsOperations,
  list,
  setList,
  // isLoading,
}) => {
  // const [list, setList] = useState([]);
  // const containerRef = useRef();
  const dispatch = useDispatch();
  const tableRef = useRef();
  // const scrollableHeight = useScrollableHeight(containerRef);
  // const [isLoading, setIsLoading] = useState(false);
  const [hasFilter, setHasFilter] = useState(false);
  const clearFilter = () => {
    const dataGrid = tableRef.current.instance;
    dataGrid.clearSelection();
    dataGrid.clearFilter();
  };
  const renderCommentCell = (data) => {
    const temp_id =
      data?.data?.sub_license_temp_id || data?.data?.parent_temp_id;
    return temp_id ? (
      <IconButton
        onClick={() => {
          dispatch(
            eventsModuleActions.setCommentModal({
              visible: true,
              commentDetails: {
                doctype: "Pending License",
                docname: temp_id,
              },
            })
          );
        }}
      >
        <img src={CommentIcon} alt="comment" />
      </IconButton>
    ) : (
      <></>
    );
  };

  // const fetchLicenseList = async () => {
  //   try {
  //     setIsLoading(true);
  //     const { data, status } = await axiosInstance.post(
  //       "compliance.api.GetSingleLicenseList",
  //       {
  //         email_id: "testusersecmark@secmark.in",
  //       }
  //     );
  //     if (status === 200 && data.message?.status) {
  //       setIsLoading(false);
  //       setList(data?.message?.license_list || []);
  //     } else {
  //       setIsLoading(false);
  //       setList([]);
  //     }
  //   } catch (error) {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchLicenseList();
  // }, []);

  return (
    <>
      {/* <div
        ref={containerRef}
        style={{ height: scrollableHeight, overflow: "auto" }}
        className="compliance-event-table mt-3"
      > */}
      {/* {isLoading ? (
          <Dots />
        ) : ( */}
      <DataGrid
        ref={tableRef}
        dataSource={list}
        noDataText="No License Found"
        height="100%"
        scrolling={{
          columnRenderingMode: "standard",
          mode: "standard",
          preloadEnabled: false,
          renderAsync: undefined,
          rowRenderingMode: "virtual",
          useNative: true,
        }}
        onContentReady={(e) => {
          setHasFilter(Boolean(e?.component?.getCombinedFilter()));
        }}
        onCellClick={(e) => {
          if (
            e.column.caption !== "Actions" &&
            e.column.caption !== "Comment" &&
            e.column.type !== "selection" &&
            e.rowType === "data" &&
            Object.keys(e.row.data).length > 0
          ) {
            const rowData = e.row.data || null;
            const isSubLicense = Boolean(rowData.sub_license_name);
            const editdata = {
              license_display: isSubLicense
                ? rowData?.sub_license_name
                : rowData.license_name,
              license_id: isSubLicense
                ? rowData.sub_license
                : rowData.parent_license,
              temp_license_id: isSubLicense
                ? rowData.sub_license_temp_id
                : rowData.parent_temp_id,
              status: rowData.status,
              industry: rowData.industry_type,
            };
            if (isSubLicense) {
              onChildItemsOperations("edit", editdata);
            } else {
              onParentItemsOperations(e, "edit", editdata);
            }
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
          exportGrid(e, "License");
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
            visible={hasFilter}
          />
          <Item name="exportButton" />
          <Item name="searchPanel" />
          <Item name="groupPanel" location="before" />
        </Toolbar>
        <GroupPanel visible={true} />
        <SearchPanel visible={true} />
        <HeaderFilter visible={true} filter allowSearch={true} />
        {/* <ColumnChooser enabled={true} mode="select" /> */}
        <Selection
          mode="multiple"
          allowSelectAll="allPages"
          showCheckBoxesMode="always"
        />
        <Column
          dataField="parent_license"
          caption="License Name"
          dataType="string"
          minWidth={140}
        />
        <Column
          dataField="industry_type"
          caption="Industries"
          dataType="string"
        />
        <Column
          dataField="sub_license"
          caption="Sub License"
          dataType="string"
        />
        <Column
          caption="Comment"
          cellRender={renderCommentCell}
          allowExporting={false}
        />
        <Column
          dataField="status"
          caption="Status"
          dataType="string"
          width={160}
        />
      </DataGrid>
      {/* )} */}
      {/* </div> */}
    </>
  );
};

export default LicenceListForApprover;
