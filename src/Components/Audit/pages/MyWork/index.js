import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import IconButton from "Components/Audit/components/Buttons/IconButton";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useHistory, useRouteMatch } from "react-router";
import Text from "Components/Audit/components/Text/Text";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import BackDrop from "CommonModules/sharedComponents/Loader/BackDrop";
import Container from "Components/Audit/components/Containers";
import axiosInstance from "apiServices";
import {
  customHeaderCell,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
import { getSubstring } from "CommonModules/helpers/string.helpers";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
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

function MyWork() {
  const [isLoading, setIsLoading] = useState(true);
  const [auditTemplatesData, setAuditTemplatesData] = useState([]);
  const history = useHistory();
  const { path } = useRouteMatch();

  const tableRef = useRef();
  const tableScrollableHeight = useScrollableHeight(tableRef, 48, [
    tableRef,
    auditTemplatesData,
  ]);

  useEffect(() => {
    getUserWork();
  }, []);

  //function to get branch list
  const getUserWork = async () => {
    try {
      const resp = await axiosInstance.post(
        "audit.api.getTemplateWiseUserWork"
      );
      if (resp) {
        const { data } = resp;
        if (data?.message?.status) {
          setAuditTemplatesData(data.message.data);
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

  const CompanyActions = (data) => {
    const { assignment_id, audit_template_name,assignment_name } = data.data;
    return (
      <div className="d-flex justify-content-between align-items-center">
        <IconButton
          onClick={() => {
            history.push({
              pathname: `${path}/questionnarie`,
              state: { assignment_id, audit_template_name ,assignment_name},
            });
          }}
          variant="iconButtonRound"
          description={<MdKeyboardArrowRight />}
          size="none"
        />
      </div>
    );
  };

  const CheckPointsAndQuestions = (data) => {
    const value = data?.value;
    const columnName = data?.column?.name;
    const { assignment_id, audit_template_name,assignment_name } = data.data;
    return (
      <span
        className={styles.textBlueDataCell}
        onClick={() => {
          history.push({
            pathname: `${path}/questionnarie`,
            state: {
              assignment_id,
              audit_template_name,
              assignment_name,
              isOpen:
                columnName === "questionnaire"
                  ? "questionnaire"
                  : "checkpoints",
            },
          });
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
    <Container variant="content">
      <div className={styles.header}>
        <Text heading="p" variant="stepperMainHeading" text="My Work" />
      </div>
      <BackDrop isLoading={isLoading} />
      <div className="table-cell" ref={tableRef}>
        <DataGrid
          id="dataGrid"
          dataSource={auditTemplatesData}
          height={tableScrollableHeight}
          columnAutoWidth={true}
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
            exportValidation(auditTemplatesData?.length, e, `My Work`)
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
          />
          <Column
            dataField="assignment_name"
            caption="Assignment Name"
            headerCellRender={customHeaderCell}
            cellRender={companyFieldCell}
          />
          <Column
            dataField="audit_template_name"
            caption="Template Name"
            headerCellRender={customHeaderCell}
            cellRender={companyFieldCell}
          />
          <Column
            dataField="audit_type"
            caption="Audit Type"
            cellRender={companyFieldCell}
            headerCellRender={customHeaderCell}
            alignment="left"
          />
          <Column
            dataField="questionnaire"
            caption="Questionnaire"
            cellRender={CheckPointsAndQuestions}
            headerCellRender={customHeaderCell}
            alignment="left"
          />
          <Column
            dataField="checkpoints"
            caption="Checkpoints"
            cellRender={CheckPointsAndQuestions}
            headerCellRender={customHeaderCell}
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

export default MyWork;
