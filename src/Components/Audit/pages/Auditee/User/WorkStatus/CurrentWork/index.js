import React, { useCallback, useEffect, useState } from "react";
import styles from "./style.module.scss";
import IconButton from "../../../../../components/Buttons/IconButton";
import { MdKeyboardArrowRight } from "react-icons/md";
import auditApis from "../../../../../api";
import { useHistory } from "react-router";

import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import { toast } from "react-toastify";
import {
  customHeaderCell,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
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

function CompletedWork({ userEmail }) {
  // const [selectedEmployee, setSelectedEmployee] = useState();
  const [currentWork, setCurrentWork] = useState([]);
  const history = useHistory();
  const getCurrentWork = useCallback(async () => {
    try {
      const { data, status } = await auditApis.fetchUsersCurrentWork(userEmail);
      if (status === 200 && data && data.message?.status) {
        const assignment_list = data?.message?.data || [];
        setCurrentWork(assignment_list);
      } else {
        toast.error("Unable to fetch current work");
        setCurrentWork([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [userEmail]);

  useEffect(() => {
    getCurrentWork();
  }, [userEmail]);

  const companyFieldCell = (data) => {
    const value = data?.value;
    return (
      <span className={styles.balckTextCell} title={value}>
        {getSubstring(value)}
      </span>
    );
  };

  const CompanyActions = (data) => {
    return (
      <div className="d-flex justify-content-between align-items-center">
        <IconButton
          onClick={() => {
            history.push(
              "/user-auditee/user/work-status/current/questionnaire"
            );
          }}
          variant="iconButtonRound"
          description={<MdKeyboardArrowRight />}
          size="none"
        />
      </div>
    );
  };

  const status = (data) => {
    const value = data?.value;
    return (
      <span
        className={
          value === "Draft Report Submited"
            ? styles.statusTextSubmited
            : value === "work in progress"
            ? styles.statusTextProgress
            : styles.statusTextCompleted
        }
      >
        {value}&nbsp;
      </span>
    );
  };

  const checkPointsAndQuestions = (data) => {
    const value = data?.value;
    const columnName = data?.column?.name;
    return (
      <span className={styles.textBlueDataCell}>
        {value}&nbsp;
        {columnName === "required_data_points"
          ? "Questions"
          : columnName === "checkpoints"
          ? "Checkpoints"
          : ""}
      </span>
    );
  };

  return (
    <DataGrid
      id="dataGrid"
      dataSource={currentWork}
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
        exportValidation(currentWork?.length, e, `CurrentWork List`)
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
        dataField="company_name"
        caption="Company Name"
        headerCellRender={customHeaderCell}
        cellRender={companyFieldCell}
      >
        <RequiredRule />
      </Column>
      <Column
        dataField="audit_category"
        caption="Audit Type"
        cellRender={companyFieldCell}
        headerCellRender={customHeaderCell}
        alignment="left"
      >
        <RequiredRule />
      </Column>
      <Column
        dataField="start_date"
        caption="Start Date"
        cellRender={companyFieldCell}
        headerCellRender={customHeaderCell}
      >
        <RequiredRule />
      </Column>
      <Column
        dataField="deadline_date"
        caption="End date"
        headerCellRender={customHeaderCell}
        cellRender={companyFieldCell}
        alignment="left"
      />
      <Column
        dataField="duration_of_completion"
        caption="Duration"
        headerCellRender={customHeaderCell}
        cellRender={companyFieldCell}
        alignment="center"
      />
      <Column
        dataField="status"
        caption="Status"
        headerCellRender={customHeaderCell}
        cellRender={status}
        alignment="center"
      />
      <Column
        dataField="questionnaire"
        caption="Questionnaire"
        headerCellRender={customHeaderCell}
        cellRender={checkPointsAndQuestions}
        alignment="center"
      />
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
  );
}

export default CompletedWork;
