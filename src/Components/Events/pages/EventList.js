import { IconButton } from "@mui/material";
import axiosInstance from "apiServices";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import { exportGrid } from "Components/Audit/constants/CommonFunction";
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
import { flatten } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import { eventsModuleActions } from "../redux/actions";
import { useDispatch } from "react-redux";
const EventList = ({
  complianceEvents,
  fetchComplianceEvents,
  handleEditComplianceEvent,
  isLoading,
}) => {
  const containerRef = useRef();
  const scrollableHeight = useScrollableHeight(containerRef, 64, [
    complianceEvents,
  ]);
  const [hasFilter, setHasFilter] = useState(false);
  const dispatch = useDispatch();
  const tableRef = useRef();
  const handleDeactivateComplianceEvent = async (
    compliance_event_id,
    compliance_event_name
  ) => {
    try {
      const { data, status } = await axiosInstance.post(
        "compliance.api.deactivateComplianceEvent",
        {
          compliance_event_id,
        }
      );

      if (status === 200 && data?.message?.success) {
        toast.success(
          "Compliance event " +
            compliance_event_name +
            " deactivated successfully!"
        );
        fetchComplianceEvents();
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };
  const clearFilter = () => {
    const dataGrid = tableRef.current.instance;
    dataGrid.clearSelection();
    dataGrid.clearFilter();
  };

  const renderFrequencyCell = (data) => {
    return (
      <div className="w-100 d-flex align-items-center justify-content-start">
        {data?.value && <div className="Button-title">{data.value}</div>}
      </div>
    );
  };
  const renderCommentCell = (data) => {
    return data?.data?.temp_compliance_id ? (
      <IconButton
        onClick={() => {
          dispatch(
            eventsModuleActions.setCommentModal({
              visible: true,
              commentDetails: {
                doctype: "Pending Compliance Events",
                docname: data?.data?.temp_compliance_id,
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
  const renderDateCell = (data) => {
    return (
      <div>
        {(data?.column?.caption === "Deactivation Date"
          ? data?.data?.disable_repeat === "De-active"
          : true) && data.value
          ? data.value
          : ""}
      </div>
    );
  };
  const renderTextContent = (data) => {
    return <div className="table__text-content">{data.value}</div>;
  };

  const renderActionsCell = (data) => {
    return (
      <div className="Edit-Delete">
        <IconButton
          disableTouchRipple
          onClick={() => handleEditComplianceEvent(data.data)}
        >
          <FaEdit className="compliance__event_edit_btn" />
        </IconButton>
        {data?.data?.disable_repeat === "Active" && (
          <IconButton
            disableTouchRipple
            onClick={() => {
              handleDeactivateComplianceEvent(
                data?.data?.compliance_event_id ||
                  data?.data?.temp_compliance_id,
                data?.data?.name_of_the_subtask
              );
            }}
          >
            <MdDeleteOutline className="compliance__event_delete_btn" />
          </IconButton>
        )}
      </div>
    );
  };
  useEffect(() => {
    fetchComplianceEvents();
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
            keyExpr="compliance_event_id"
            dataSource={complianceEvents}
            noDataText="No Events Found"
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
                e.column.caption !== "Comment" &&
                e.column.type !== "selection" &&
                e.rowType === "data" &&
                Object.keys(e.row.data).length > 0
              )
                handleEditComplianceEvent(e.data);
            }}
            allowColumnReordering={false}
            wordWrapEnabled={true}
            columnAutoWidth={true}
            showColumnLines={true}
            width="100%"
            paging={{
              enabled: false,
            }}
            onContentReady={(e) => {
              setHasFilter(Boolean(e?.component?.getCombinedFilter()));
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
              exportGrid(e, "Compliance Events");
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
              dataField="name_of_the_subtask"
              caption="Compliance Event"
              dataType="string"
              cellRender={renderTextContent}
              minWidth={360}
            />
            <Column
              dataField="start_date"
              caption="Event Start Date"
              dataType="string"
              cellRender={renderDateCell}
              width={200}
            />
            <Column
              dataField="frequency"
              caption="Event (Frequency)"
              dataType="string"
              cellRender={renderFrequencyCell}
              width={200}
            />
            <Column
              dataField="end_date"
              cellRender={renderDateCell}
              caption="Event End Date"
              dataType="string"
              width={200}
            />
            <Column
              dataField="disable_repeat"
              caption="Status"
              dataType="string"
              width={80}
            />
            <Column
              dataField="status"
              caption="Event Status"
              dataType="string"
              width={120}
            />
            <Column
              dataField="licenseString"
              caption="License Name"
              dataType="string"
              cellRender={renderTextContent}
              width={240}
            >
              <HeaderFilter
                dataSource={[
                  ...new Set(
                    flatten(complianceEvents.map((item) => item.license))
                  ),
                ].map((data) => ({
                  text: data,
                  value: ["licenseString", "contains", data],
                }))}
              />
            </Column>
            <Column
              dataField="deactivation_date"
              cellRender={renderDateCell}
              caption="Deactivation Date"
              dataType="string"
              width={200}
            />
            <Column
              caption="Comment"
              cellRender={renderCommentCell}
              allowExporting={false}
            />
            <Column
              caption="Actions"
              width={120}
              cellRender={renderActionsCell}
              allowExporting={false}
            />
          </DataGrid>
        )}
      </div>
    </>
  );
};
export default EventList;
