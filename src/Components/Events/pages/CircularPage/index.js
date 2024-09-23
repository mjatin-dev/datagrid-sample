import { IconButton } from "@mui/material";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import { exportGrid } from "Components/Audit/constants/CommonFunction";
import { eventsModuleActions } from "Components/Events/redux/actions";
import CommentIcon from "assets/Icons/UserText.png";
import DataGrid, {
  Column,
  ColumnChooser,
  GroupPanel,
  HeaderFilter,
  Item,
  SearchPanel,
  Selection,
  Toolbar,
} from "devextreme-react/data-grid";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
const CircularList = () => {
  const [hasFilter, setHasFilter] = useState(false);
  const { isLoading, list: circulars } = useSelector(
    (state) => state?.eventsModuleReducer?.circular
  );
  const containerRef = useRef();
  const scrollableHeight = useScrollableHeight(containerRef, 64, []);
  const tableRef = useRef();
  const dispatch = useDispatch();
  const clearFilter = () => {
    const dataGrid = tableRef.current.instance;
    dataGrid.clearSelection();
    dataGrid.clearFilter();
  };

  const renderCircularNumberCell = (data) => {
    return <div style={{ wordBreak: "break-word" }}>{data.value}</div>;
  };
  const renderTextContent = (data) => {
    return <div className="table__text-content">{data.value}</div>;
  };

  const renderCommentCell = (data) => {
    return data?.data?.temp_circular_id ? (
      <IconButton
        onClick={() => {
          dispatch(
            eventsModuleActions.setCommentModal({
              visible: true,
              commentDetails: {
                doctype: "Pending Circular",
                docname: data?.data?.temp_circular_id,
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
  useEffect(() => {
    dispatch(eventsModuleActions.fetchCircularsRequest());
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
            dataSource={circulars || []}
            noDataText="No Circulars Found"
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
                dispatch(
                  eventsModuleActions.setModalState({
                    isVisible: true,
                    data: {
                      ...(e.data || {}),
                    },
                  })
                );
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
                visible={hasFilter}
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
              dataField="title"
              caption="Circular Title"
              dataType="string"
              cellRender={renderTextContent}
              minWidth={360}
            />
            <Column
              dataField="date_of_issued"
              caption="Date of issued"
              dataType="date"
              format="dd MMM yyyy"
              width={120}
            />
            <Column
              dataField="circular_number"
              caption="Circular Number"
              dataType="string"
              cellRender={renderCircularNumberCell}
              width={200}
            />
            <Column
              dataField="update_issued_by"
              caption="Update issued by"
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
              width={200}
            />
          </DataGrid>
        )}
      </div>
    </>
  );
};
export default CircularList;
