import React, { useState } from "react";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";

import {
  DataGrid,
  ColumnChooser,
  ColumnFixing,
  Column,
  RequiredRule,
  FilterRow,
  SearchPanel,
  GroupPanel,
  Selection,
  Editing,
  MasterDetail,
  Export,
} from "devextreme-react/data-grid";
import { employees } from "./employees";
import { MdModeEdit } from "react-icons/md";
import { exportGrid } from "Components/Audit/constants/CommonFunction";

function SelectedEmployee(props) {
  if (props.employee) {
    return (
      <p id="selected-employee">
        Selected employee: {props.employee.TemplateName}
      </p>
    );
  }
  return null;
}

function DetailSection(props) {
  const employee = props.data.data;
  return (
    <div>
      <h1>{employee.TemplateName}</h1>
    </div>
  );
}

const renderGridCell = (data) => {
  return (
    <div>
      {data.data.TemplateName}
      <MdModeEdit></MdModeEdit>
    </div>
  );
};

function SectionList() {
  const [selectedEmployee, setSelectedEmployee] = useState();
  const selectEmployee = (e) => {
    e.component.byKey(e.currentSelectedRowKeys[0]).done((employee) => {
      setSelectedEmployee(employee);
    });
  };

  return (
    <div className="App">
      <DataGrid
        id="dataGrid"
        dataSource={employees}
        keyExpr="Completion"
        allowColumnResizing={true}
        columnAutoWidth={true}
        allowColumnReordering={true}
        onSelectionChanged={selectEmployee}
        onExporting={exportGrid}
      >
        <ColumnChooser enabled={true} />
        <Column
          dataField="TemplateName"
          groupIndex={0}
          sortOrder="asc"
          allowGrouping={true}
        >
          <RequiredRule />
        </Column>
        <Column dataField="Completion">
          <RequiredRule />
        </Column>
        <Column dataField="MadeBy">
          <RequiredRule />
        </Column>
        <Column dataField="AuditType">
          <RequiredRule />
        </Column>
        <Column dataField="RequiredDataPoints" />
        <Column dataField="CheckPoint" cellRender={renderGridCell}>
          <RequiredRule />
        </Column>

        <ColumnFixing enabled={true} />
        <FilterRow visible={true} />
        <SearchPanel visible={true} />
        <GroupPanel visible={true} />
        <Selection mode="single" />

        <Editing
          mode="popup"
          allowUpdating={true}
          allowDeleting={true}
          allowAdding={true}
        />
        <MasterDetail enabled={true} component={DetailSection} />
        <Export enabled={true} />
      </DataGrid>
      <SelectedEmployee employee={selectedEmployee} />
    </div>
  );
}

export default SectionList;
