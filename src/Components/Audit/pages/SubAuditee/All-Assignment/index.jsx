import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import Text from "Components/Audit/components/Text/Text";
import IconButton from "Components/Audit/components/Buttons/IconButton";
import { MdAddBox, MdKeyboardArrowRight } from "react-icons/md";
import { useHistory, useRouteMatch } from "react-router";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import Container from "Components/Audit/components/Containers";
import axiosInstance from "apiServices";
import Reassignment from "../ApplyPages/Reassignment/Reassignment";
import Leave from "../ApplyPages/Leave/Leave";
import { auditDateFormater } from "CommonModules/Utils/helperfunctions";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import BackDrop from "CommonModules/sharedComponents/Loader/BackDrop";
import {
  customHeaderCell,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
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

function AllAuditeeAssignment() {
  const history = useHistory();
  const { path } = useRouteMatch();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openReassignment, setReassigmentOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [allAssignmentData, setAllAssignmentData] = useState([]);
  const tableRef = useRef();

  const tableScrollableHeight = useScrollableHeight(tableRef, 48, [
    tableRef,
    allAssignmentData,
  ]);
  const current_page = history?.location?.state || "all";

  const onLeaveOpen = () => {
    setOpen(true);
  };
  const onLeaveClose = () => {
    setOpen(false);
  };
  const onReassinmentOpen = () => {
    setReassigmentOpen(true);
  };
  const onReassinmentClose = () => {
    setReassigmentOpen(false);
  };

  const getAllAssignmentData = async () => {
    try {
      setIsLoading(true);
      const { data, status } = await axiosInstance.post(
        "audit.api.getAssignmentList",
        { status: current_page === undefined ? "all" : current_page }
      );
      if (status === 200 && data && data.message && data.message.status) {
        const AssignmentData = data?.message?.data;
        setAllAssignmentData(AssignmentData);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      setIsLoading(false);
    }
  };
  const selectEmployee = (e) => {
    e.component.byKey(e.currentSelectedRowKeys[0]).done((employee) => {
      setSelectedEmployee(employee);
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

  const redirectToQuestionarie = (data) => {
    const { assignment_id, assignment_name } = data?.data;
    history.push({
      pathname: `${path}/assignment`,
      state: {
        assignment_id: assignment_id,
        status: current_page,
        assignment_name: assignment_name,
      },
    });
  };

  const CompanyActions = (data) => {
    return (
      <div className="d-flex justify-content-between align-items-center">
        <IconButton
          onClick={() => redirectToQuestionarie(data)}
          variant="iconButtonRound"
          description={<MdKeyboardArrowRight />}
          size="none"
        />
      </div>
    );
  };

  const RequiredDataCell = (data) => {
    const value = data?.value;
    return (
      <span
        className={styles.textBlueDataCell}
        onClick={() => redirectToQuestionarie(data)}
        style={{ cursor: "pointer" }}
      >
        {value} Questions
      </span>
    );
  };

  useEffect(() => {
    getAllAssignmentData();
  }, [current_page]);

  return (
    <Container variant="content">
      <BackDrop isLoading={isLoading} />
      <Leave onClose={onLeaveClose} open={open} />
      <Reassignment
        onClose={onReassinmentClose}
        openReassignment={openReassignment}
      />
      <div className={styles.topHeading}>
        <Text
          heading="p"
          variant="stepperMainHeading"
          text={`${
            current_page === undefined ? "all" : current_page
          } Assignments`}
        />
      </div>
      <div className="table-cell" ref={tableRef}>
        <DataGrid
          id="dataGrid"
          dataSource={allAssignmentData}
          columnAutoWidth={true}
          allowColumnReordering={true}
          onSelectionChanged={selectEmployee}
          height={tableScrollableHeight}
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
            exportValidation(allAssignmentData?.length, e, `Assignments List`)
          }
          export={{
            allowExportSelectedData: true,
            enabled: true,
          }}
        >
          <Toolbar>
            <Item location="after">
              <IconButton
                description="Apply Reassignment"
                variant="subAudit"
                icon={<MdAddBox />}
                onClick={() => {
                  onReassinmentOpen();
                }}
              />
            </Item>
            <Item location="after">
              <IconButton
                description="Apply Leave"
                variant="subAudit"
                icon={<MdAddBox />}
                onClick={() => {
                  onLeaveOpen();
                }}
              />
            </Item>
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
            dataField="assignment_name"
            caption="Assignment Name"
            headerCellRender={customHeaderCell}
            cellRender={companyFieldCell}
          >
            <RequiredRule />
          </Column>
          <Column
            dataField="start_date"
            caption="Start Date"
            cellRender={auditDateFormater}
            headerCellRender={customHeaderCell}
          >
            <RequiredRule />
          </Column>
          <Column
            dataField="end_date"
            caption="End Date"
            headerCellRender={customHeaderCell}
            cellRender={auditDateFormater}
          >
            <RequiredRule />
          </Column>
          <Column
            dataField="questionnaire"
            caption="Questionnaires"
            headerCellRender={customHeaderCell}
            cellRender={RequiredDataCell}
            alignment="left"
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
      </div>
    </Container>
  );
}

export default AllAuditeeAssignment;
