import React, { useEffect, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useHistory, useRouteMatch } from "react-router";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import styles from "./style.module.scss";
import IconButton from "../../../../../components/Buttons/IconButton";
import { toast } from "react-toastify";
import axiosInstance from "../../../../../../../apiServices";
import BackDrop from "../../../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import { customHeaderCell } from "Components/Audit/constants/CommonFunction";
import DevExtremeComponents from "Components/Audit/constants/DevEx/commonExports";
const {
  DataGrid,
  Column,
  RequiredRule,
  SearchPanel,
  Selection,
  Export,
  Toolbar,
  Item,
  FilterRow,
} = DevExtremeComponents;

function CompleteWork() {
  const history = useHistory();
  const { path } = useRouteMatch();
  const first_name = history?.location?.state?.first_name || "";
  const email = history?.location?.state?.email || "";
  const [completedWorkData, setCompletedWorkData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //function to get completed work list
  const getCompletedWorkData = async () => {
    try {
      setIsLoading(true);
      const { data, status } = await axiosInstance.post(
        "audit.api.getUserWiseCompletedWork",
        {
          user: email,
          completed: 1,
        }
      );
      if (status === 200 && data && data.message && data.message.status) {
        const CompletedData = data?.message?.data;
        setCompletedWorkData(CompletedData);
        setIsLoading(false);
      } else {
        setCompletedWorkData([]);
        toast.warning(data?.message?.status_response);
        setIsLoading(false);
        toast.error("something went wrong");
      }
    } catch (error) {
      console.log(error.message);
      setIsLoading(false);
      toast.error("something went wrong");
    }
  };

  const selectionChanged = (e) => {
    e.component.collapseAll(-1);
    e.component.expandRow(e.currentSelectedRowKeys[0]);
  };

  const TemplateNameCellWithBlack = (data) => {
    const value = data?.value;
    return (
      <span className={styles.balckTextCell} title={value}>
        {value || "-"}
      </span>
    );
  };
  const TemplateActions = (data) => {
    const dat = data.data;
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div className="px-1">
          <IconButton
            onClick={() => {
              history.push({
                pathname: `${path}/complete-work`,
                state: {
                  first_name: first_name,
                  email: email,
                  company_name: dat.company_name,
                },
              });
            }}
            variant="iconButtonRound"
            description={<MdKeyboardArrowRight />}
            size="none"
          />
        </div>
      </div>
    );
  };
  const RequiredDataCell = (data) => {
    const value = data?.value;
    const columnName = data?.column?.name;
    return (
      <span className={styles.textBlueDataCell}>
        {value}&nbsp;
        {columnName === "questionnaire"
          ? "Questions"
          : columnName === "checkpoints"
          ? "Checkpoints"
          : ""}
      </span>
    );
  };
  useEffect(() => {
    getCompletedWorkData();
  }, []);
  return (
    <div className="mt-4">
      <BackDrop isLoading={isLoading} />
      <DataGrid
        id="dataGrid"
        dataSource={completedWorkData}
        // keyExpr="id"
        onSelectionChanged={selectionChanged}
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
      >
        <Toolbar>
          <Item name="searchPanel" />
          <Item name="exportButton" />
          <Item name="groupPanel" location="before" />
        </Toolbar>
        <SearchPanel visible={true} width={250} />
        <Column
          dataField="company_name"
          caption="Company Name"
          headerCellRender={customHeaderCell}
          cellRender={TemplateNameCellWithBlack}
        />
        <Column
          dataField="audit_category"
          caption="Audit Type"
          headerCellRender={customHeaderCell}
          cellRender={TemplateNameCellWithBlack}
        />
        <Column
          dataField="start_date"
          caption="Start Date"
          headerCellRender={customHeaderCell}
          cellRender={TemplateNameCellWithBlack}
          alignment="center"
        />
        <Column
          dataField="deadline_date"
          caption="End Date"
          headerCellRender={customHeaderCell}
          cellRender={TemplateNameCellWithBlack}
          alignment="center"
        />
        <Column
          dataField="duration_of_completion"
          caption="Duration"
          headerCellRender={customHeaderCell}
          cellRender={TemplateNameCellWithBlack}
          alignment="center"
        />
        <Column
          dataField="questionnaire"
          caption="Questionnaire"
          headerCellRender={customHeaderCell}
          cellRender={RequiredDataCell}
          alignment="center"
        />
        <Column
          dataField="checkpoints"
          caption="Checkpoints"
          headerCellRender={customHeaderCell}
          cellRender={RequiredDataCell}
          alignment="center"
        />
        <Column cellRender={TemplateActions}>
          <RequiredRule />
        </Column>
        <Export enabled={true} />
        <FilterRow visible={true} />
        <Selection mode="single" />
      </DataGrid>
    </div>
  );
}

export default CompleteWork;
