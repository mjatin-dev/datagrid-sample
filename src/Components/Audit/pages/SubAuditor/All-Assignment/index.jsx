import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import Text from "Components/Audit/components/Text/Text";
import IconButton from "Components/Audit/components/Buttons/IconButton";
import { MdAddBox, MdKeyboardArrowRight } from "react-icons/md";
import { useHistory, useRouteMatch } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import Container from "Components/Audit/components/Containers";
import Reassignment from "../ApplyPages/Reassignment/Reassignment";
import Leave from "../ApplyPages/Leave/Leave";
import { subAuditorModuleActions } from "Components/Audit/redux/subAuditorModuleActions";
import { auditDateFormater } from "CommonModules/Utils/helperfunctions";
import {
  customHeaderCell,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import BackDrop from "CommonModules/sharedComponents/Loader/BackDrop";
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

function AllAssignment() {
  const [open, setOpen] = useState(false);
  const [openReassignment, setReassigmentOpen] = useState(false);
  const history = useHistory();
  const { path } = useRouteMatch();
  const dispatch = useDispatch();
  const subAuditorData = useSelector(
    (state) => state?.AuditReducer?.subAuditorModule
  );
  const { assignmentList, isLoading, currentStatusTab } = subAuditorData;
  const tableRef = useRef();

  const tableScrollableHeight = useScrollableHeight(tableRef, 48, [
    tableRef,
    assignmentList,
  ]);

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

  const companyFieldCell = (data) => {
    const value = data?.value;
    return (
      <span className={styles.balckTextCell} title={value}>
        {value || "-"}
      </span>
    );
  };

  const CompanyActions = (data) => {
    const { assignment_id, assignment_name } = data.data;
    return (
      <div className="d-flex justify-content-between align-items-center">
        <IconButton
          onClick={() => {
            history.push({
              pathname: `${path}/assignment`,
              state: {
                assignment_id,
                assignment_name,
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
    const { assignment_id, assignment_name } = data.data;
    const value = data?.value;
    return (
      <span
        className={styles.textBlueDataCell}
        style={{ cursor: "pointer" }}
        onClick={() => {
          history.push({
            pathname: `${path}/assignment`,
            state: {
              assignment_id,
              assignment_name,
            },
          });
        }}
      >
        {value} Checkpoints
      </span>
    );
  };

  useEffect(() => {
    dispatch(subAuditorModuleActions.fetchAssignmentList(currentStatusTab));
  }, []);

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
          text={`${currentStatusTab} Assignment`}
        />
      </div>
      <div className="table-cell" ref={tableRef}>
        <DataGrid
          id="dataGrid"
          dataSource={assignmentList}
          columnAutoWidth={true}
          allowColumnReordering={true}
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
            rowRenderingMode: "virtual",
            scrollByContent: true,
            scrollByThumb: true,
            showScrollbar: "onHover",
            useNative: "auto",
          }}
          onExporting={(e) =>
            exportValidation(assignmentList?.length, e, `Assignment List`)
          }
          export={{
            allowExportSelectedData: true,
            enabled: true,
          }}
        >
          <Toolbar>
            <Item>
              <IconButton
                description="APPLY REASSIGNMENT"
                variant="subAudit"
                icon={<MdAddBox />}
                onClick={() => {
                  onReassinmentOpen();
                }}
              />
            </Item>
            <Item>
              <IconButton
                description="APPLY LEAVE"
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
            dataField="checkpoints"
            caption="Checkpoints"
            headerCellRender={customHeaderCell}
            cellRender={RequiredDataCell}
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
    </Container>
  );
}

export default AllAssignment;
