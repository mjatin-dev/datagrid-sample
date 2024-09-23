import React, { useState, useEffect, useRef } from "react";
import styles from "./style.module.scss";
import IconButton from "../../../components/Buttons/IconButton";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useHistory, useRouteMatch } from "react-router";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import BackDrop from "../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import axiosInstance from "../../../../../apiServices";
import {
  CreatedOnCell,
  customHeaderCell,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import { getSubstring } from "CommonModules/helpers/string.helpers";
import DevExtremeComponents from "Components/Audit/constants/DevEx/commonExports";
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
} = DevExtremeComponents;

function CompletedWork() {
  const history = useHistory();
  const { path } = useRouteMatch();
  const routeId = history?.location?.state?.routeId || "";
  const [isLoading, setIsLoading] = useState(true);
  const [completedWorkData, setCompletedWorkData] = useState([]);

  const tableRef = useRef();
  const tableScrollableHeight = useScrollableHeight(tableRef, 48, [
    tableRef,
    completedWorkData,
  ]);

  useEffect(() => {
    getCompanyCurrentWork();
  }, [routeId]);

  //function to get branch list
  const getCompanyCurrentWork = async () => {
    try {
      const resp = await axiosInstance.post(
        "audit.api.getCompanyWiseCompletedWork",
        { company: routeId }
      );
      if (resp) {
        const { data } = resp;
        if (data?.message?.status) {
          setCompletedWorkData(data.message.data);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      setIsLoading(false);
    }
  };

  const companyFieldCell = (data) => {
    const value = data?.value;
    return (
      <span className={styles.balckTextCell} title={value}>
        {getSubstring(value)}
      </span>
    );
  };

  const onRedirect = (data, type = "questionnaire") => {
    const { assignment_id, company, assignment_name } = data?.data;
    history.push({
      pathname: `${path}/completed-work/questionaire-checklist`,
      state: {
        company: company,
        assignment_id: assignment_id,
        assignment_name: assignment_name,
        type: type,
      },
    });
  };

  const CompanyActions = (data) => {
    return (
      <div className="d-flex justify-content-between align-items-center">
        <IconButton
          onClick={() => onRedirect(data, "questionnaire")}
          variant="iconButtonRound"
          description={<MdKeyboardArrowRight />}
          size="none"
        />
      </div>
    );
  };

  const checkPointsAndQuestions = (data) => {
    const value = data?.value;
    const columnName = data?.column?.name;
    return (
      <span
        style={{ cursor: "pointer" }}
        className={styles.textBlueDataCell}
        onClick={() => {
          columnName === "questionnaire"
            ? onRedirect(data, "questionnaire")
            : onRedirect(data, "checkpoints");
        }}
      >
        {value}&nbsp;
        {columnName === "questionnaire"
          ? "Questions"
          : columnName === "checkpoints"
          ? "Checkpoints"
          : ""}
      </span>
    );
  };

  return (
    <>
      <BackDrop isLoading={isLoading} />
      <div className="table-cell" ref={tableRef}>
        <DataGrid
          id="dataGrid"
          dataSource={completedWorkData}
          columnAutoWidth={true}
          height={tableScrollableHeight}
          allowColumnReordering={true}
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
            exportValidation(completedWorkData?.length, e, `Completed Work`)
          }
          export={{
            allowExportSelectedData: true,
            enabled: true,
          }}
        >
          <Toolbar>
            <Item name="exportButton" />
            <Item name="searchPanel" />
            <Item name="groupPanel" location="before" />
          </Toolbar>
          <Column
            dataField="assignment_name"
            caption="Assignemnt Name"
            headerCellRender={customHeaderCell}
            cellRender={companyFieldCell}
          />
          <Column
            dataField="audit_category"
            caption="Audit Type"
            cellRender={companyFieldCell}
            headerCellRender={customHeaderCell}
            alignment="left"
          />
          <Column
            dataField="start_date"
            caption="Start Date"
            cellRender={CreatedOnCell}
            headerCellRender={customHeaderCell}
          />
          {/* <Column
            dataField="deadline_date"
            caption="End date"
            headerCellRender={customHeaderCell}
            cellRender={CreatedOnCell}
            alignment="left"
          /> */}
          {/* <Column
            dataField="duration_of_completion"
            caption="Duration"
            headerCellRender={customHeaderCell}
            cellRender={companyFieldCell}
            alignment="left"
          /> */}
          <Column
            dataField="questionnaire"
            caption="Required data points"
            headerCellRender={customHeaderCell}
            cellRender={checkPointsAndQuestions}
            alignment="left"
          />
          <Column
            dataField="checkpoints"
            caption="Checkpoints"
            headerCellRender={customHeaderCell}
            cellRender={checkPointsAndQuestions}
            alignment="left"
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
    </>
  );
}

export default CompletedWork;
