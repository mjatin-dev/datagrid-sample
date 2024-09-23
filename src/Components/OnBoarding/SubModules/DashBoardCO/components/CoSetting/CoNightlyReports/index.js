import React, { useState, useEffect, useRef } from "react";
import "./style.scss";

import { toast } from "react-toastify";
import {
  DataGrid,
  Column,
  RequiredRule,
  FilterRow,
  SearchPanel,
  Export,
  Toolbar,
  Item,
  Selection,
  HeaderFilter,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import calanderIcon from "assets/Icons/calanderIcon.svg";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import BackDrop from "CommonModules/sharedComponents/Loader/BackDrop";
import { exportGrid } from "Components/Audit/constants/CommonFunction";
import moment from "moment";
import { DatePicker } from "antd";

//backend URLS
import { BACKEND_BASE_URL } from "apiServices/baseurl";
import axiosInstance from "apiServices";

function NightlyReports() {
  const calanderimg = <img src={calanderIcon} alt="calander" />;

  //sates to store API data
  const [data, setData] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCheckBox, setSelectedCheckBox] = useState([]);
  //hook to get scrollable height
  const tableRef = useRef();
  let tableRefnew = useRef();

  const tableScrollableHeight = useScrollableHeight(tableRef, 48, [
    tableRef,
    data,
  ]);

  /**
   *
   * @param {
   * } taskStartDat
   *
   * to fecth data from backned takess one parameter as taskDate
   * if it is empty no data will be there data is fetched according to date
   */

  const getDateFormate = (date) => {
    if (date) {
      return moment(date).format("DD MMM YYYY");
    } else {
      return "";
    }
  };
  const nightReportsData = async (taskStartDat = "") => {
    let params = {
      task_start_date: taskStartDat,
    };

    if (taskStartDat !== "") {
      setLoading(true);
      try {
        const getNightReportsData = await axiosInstance.get(
          `${BACKEND_BASE_URL}compliance.api.getNightyJobReportData`,
          {
            params: params,
          }
        );
        if (
          getNightReportsData.status === 200 &&
          getNightReportsData.data.message.status
        ) {
          let newArray = getNightReportsData?.data?.message?.data.map(
            (item) => {
              return {
                ...item,
                task_deadline_date: getDateFormate(item?.task_deadline_date),
                previous_schedule_date: getDateFormate(
                  item?.previous_schedule_date
                ),
                previous_deadline_date: getDateFormate(
                  item?.previous_deadline_date
                ),
                date: getDateFormate(item?.date),
              };
            }
          );
          console.log(getNightReportsData.data.message.data);
          setData(newArray);
          setLoading(false);
          const dataGrid = tableRefnew?.current?.instance;
          dataGrid.clearFilter();
        } else {
          toast.error("somethingh went wrong");
          setLoading(false);
        }
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    }
  };

  // column value styling
  const companyFieldCell = (data) => {
    const value = data?.value;
    return (
      <span title={value} className="night_reports_customDataCell">
        {value || "-"}
      </span>
    );
  };

  //to truncate string till 15 length
  const TaskNameFiled = (data) => {
    const value = data?.value;
    return (
      <span title={value} className="night_reports_customDataCell">
        {(value?.length > 25 ? value?.slice(0, 25) + "..." : value) || "-"}
      </span>
    );
  };

  //to truncate string till 15 length
  const ComplianceOfficeFiled = (data) => {
    const value = data?.value;
    return (
      <span title={value} className="night_reports_customDataCell">
        {(value?.length > 15 ? value?.slice(0, 15) + "..." : value) || "-"}
      </span>
    );
  };

  const renderTitleHeader = (data) => {
    return (
      <p
        className="night_reports_columnHeaderTitle"
        style={{ textTransform: "none" }}
      >
        {data.column.caption}
      </p>
    );
  };

  // To format Date in DD MM YY format
  const DateFormater = (data) => {
    const value = data?.value;
    let formatedDate = value ? moment(value).format("DD MMM YYYY") : "-";
    return (
      <span title={formatedDate} className="night_reports_customDataCell">
        {formatedDate}
      </span>
    );
  };

  //function to select date
  const DateSelecter = () => {
    return (
      <div className="ml-3">
        <DatePicker
          placeholder="Select Date*"
          className="night_reports_date_picker"
          name="start_date"
          format="DD MMMM Y"
          disabledDate={(current) => {
            return current && current > moment().endOf("day");
          }}
          suffixIcon={calanderimg}
          value={(filterDate && moment(filterDate, "YYYY-MM-DD")) || null}
          onChange={(value) => {
            nightReportsData(value?.format("YYYY-MM-DD") || "");
            setFilterDate(value?.format("YYYY-MM-DD") || "");
          }}
        />
      </div>
    );
  };

  // html function to show count
  const SuccessCount = () => {
    return (
      <div className="night_reports_contMainBox">
        <div className="night_reports_countOuter">
          Success <span id="successCountDevExNightlyJob">{0}</span>
        </div>
        <div className="night_reports_countOuter">
          Failed <span id="failCountDevExNightlyJob">{0}</span>
        </div>
      </div>
    );
  };

  const randomFun = (e) => {
    let successCounter = 0;
    let failCount = 0;
    let temData = e?.component?.getDataSource()._items;
    temData.map((item, index) => {
      item.status === "Success"
        ? (successCounter = successCounter + 1)
        : (failCount = failCount + 1);
    });
    document.getElementById("successCountDevExNightlyJob").innerText =
      successCounter;
    document.getElementById("failCountDevExNightlyJob").innerText = failCount;
  };

  const HandleRowSelection = (e) => {
    if (e.selectedRowsData) {
      setSelectedCheckBox(e.selectedRowKeys);
    }
  };

  const handleSelectAllGrid = (e) => {
    if (e.selectedRowKeys > 0) {
      setSelectedCheckBox([]);
    }
  };
  const resetSelectCol = () => {
    setSelectedCheckBox([]);
  };

  // to call API when it's rendered first time
  useEffect(() => {
    if (filterDate === "") {
      setData([]);
    } else {
      nightReportsData();
    }
  }, [filterDate]);

  return (
    <div className="mt-4">
      <BackDrop isLoading={loading} />
      <div className="d-flex flex-wrap align-items-center mb-2">
        <SuccessCount />
        <DateSelecter />
      </div>

      <div ref={tableRef} id="nightlyJob_devx">
        <DataGrid
          id="dataGrid"
          dataSource={data}
          ref={tableRefnew}
          columnAutoWidth={true}
          allowColumnReordering={true}
          selectedRowKeys={selectedCheckBox}
          onSelectionChanged={HandleRowSelection}
          onSelectionAllChanged={handleSelectAllGrid}
          paging={false}
          onExporting={(e) => {
            if (data?.length === 0) {
              toast.error("there is no data to export");
              e.cancel = true;
              return;
            }
            if (
              e.component.getSelectedRowKeys().length === 0 &&
              e.component.getController("export")._selectionOnly
            ) {
              toast.error("Please select rows");
              e.cancel = true;
              return;
            }
            exportGrid(e, "Nightly Job Reports");
          }}
          export={{
            allowExportSelectedData: true,
            enabled: true,
            fileName: "Nightly Job Reports",
            texts: {
              exportAll: "Export all data",
              exportSelectedRows: "Export selected rows",
              exportTo: "Export",
            },
          }}
          onContentReady={(e) => randomFun(e)}
          showColumnLines={true}
          showBorders={false}
          showRowLines={false}
          wordWrapEnabled={true}
          selection={{
            mode: "multiple",
            showCheckBoxesMode: "always",
          }}
          width="100%"
          height={tableScrollableHeight}
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
        >
          <HeaderFilter visible={true} allowSearch={true} />
          <Toolbar style={{ padding: "5px" }}>
            <Item>
              <button
                className="nightly__jobs__reset__button"
                onClick={() => {
                  const dataGrid = tableRefnew?.current?.instance;
                  dataGrid.clearFilter();
                  if (selectedCheckBox?.length > 0) {
                    resetSelectCol();
                  }
                }}
              >
                Reset
              </button>
            </Item>
            <Item name="exportButton" />
            <Item name="searchPanel" />
          </Toolbar>
          <Column
            dataField="name_of_the_subtask"
            caption="Task Name"
            width={"300px"}
            cellRender={TaskNameFiled}
            headerCellRender={renderTitleHeader}
          />

          <Column
            dataField="compliance_officer"
            caption="CO"
            cellRender={ComplianceOfficeFiled}
            headerCellRender={renderTitleHeader}
            minWidth={"200px"}
          >
            <RequiredRule />
          </Column>
          <Column
            dataField="frequency"
            caption="Frequency"
            cellRender={companyFieldCell}
            headerCellRender={renderTitleHeader}
            minWidth={"100px"}
          >
            <RequiredRule />
          </Column>
          <Column
            dataField="status"
            caption="Status"
            cellRender={companyFieldCell}
            headerCellRender={renderTitleHeader}
            minWidth={"100px"}
          >
            <RequiredRule />
          </Column>
          <Column
            dataField="previous_schedule_date"
            caption="Start Date"
            headerCellRender={renderTitleHeader}
            allowHeaderFiltering={false}
            cellRender={DateFormater}
            minWidth={"120px"}
          />
          <Column
            dataField="previous_deadline_date"
            caption="Deadline Date"
            headerCellRender={renderTitleHeader}
            cellRender={DateFormater}
            minWidth={"120px"}
          />
          <Column
            dataField="task_deadline_date"
            caption="Due Date"
            headerCellRender={renderTitleHeader}
            cellRender={DateFormater}
            minWidth={"120px"}
          />

          <Column
            dataField="license"
            caption="License"
            headerCellRender={renderTitleHeader}
            cellRender={companyFieldCell}
            minWidth={"150px"}
          />
          <FilterRow visible={false} />
          <SearchPanel visible={true} />
          <Export enabled={true} />
          <Selection mode="single" />
        </DataGrid>
      </div>
    </div>
  );
}

export default NightlyReports;
