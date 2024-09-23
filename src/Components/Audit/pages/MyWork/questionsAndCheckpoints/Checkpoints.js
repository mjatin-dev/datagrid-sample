/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { MdAdd } from "react-icons/md";
import { useHistory } from "react-router";
import { Input } from "Components/Audit/components/Inputs/Input";
import styles from "./style.module.scss";
import BackDrop from "CommonModules/sharedComponents/Loader/BackDrop";
import axiosInstance from "apiServices";
import SubmitedDocs from "Components/Audit/components/CustomCells/SubmittedDocs";
import AttachmentTypeCustomCell from "Components/Audit/components/CustomCells/AttachmentTypeCell";
import { useSelector } from "react-redux";
import { getFileExtensions } from "Components/Audit/components/Helpers/string.helpers";
import useFileUpload from "SharedComponents/Hooks/FileUpload.hook";
import auditApi from "Components/Audit/api";
import NotCompliedConfirmation from "Components/Audit/components/Modal/NotCompiledConfirmation";
import {
  CompliedNotCompliedFunction,
  customHeaderCell,
  exportValidation,
} from "Components/Audit/constants/CommonFunction";
import { auditDateFormater } from "CommonModules/Utils/helperfunctions";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import DevExtremeComponents from "Components/Audit/constants/DevEx/commonExports";
const {
  DataGrid,
  Column,
  SearchPanel,
  Selection,
  Export,
  Toolbar,
  Item,
  FilterRow,
  GroupPanel,
} = DevExtremeComponents;

const Checkpoints = () => {
  const history = useHistory();
  const { assignment_id } = history.location.state;
  const [isFileUploadInProgress, uploadFile] = useFileUpload();
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const userTypeNo = useSelector(
    (state) => state?.auth?.loginInfo?.auditUserType
  );

  const [notCompliedModal, setNotCompliedModal] = useState(false);
  const [notCompliedModalData, setNotCompliedModalData] = useState(null);

  const tableRef = useRef();
  const tableScrollableHeight = useScrollableHeight(tableRef, 48, [
    tableRef,
    dataSource,
  ]);

  const openNotCompliedModal = (data) => {
    setNotCompliedModal(true);
    setNotCompliedModalData(data);
  };
  const closeNotCompliedModal = () => {
    setNotCompliedModal(false);
  };

  //function to get branch list
  const getUserChecklist = async () => {
    const payload = { assignment_id: assignment_id };
    try {
      const resp = await axiosInstance.post(
        "audit.api.getTemplateWiseUserCheckList",
        payload
      );
      if (resp) {
        const { data } = resp;
        if (data?.message?.status) {
          setDataSource(data.message.data);
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleAddDocs = async (e, check_point_id) => {
    const isFileUploaded = await uploadFile(e, auditApi.addDocsInChecklist, {
      check_point_id,
      assignment_id: assignment_id,
    });
    if (isFileUploaded) {
      getUserChecklist();
    }
  };

  const updateStatusApi = async (e, assignment_id, check_point_id, data) => {
    if (
      e.target.value === "Not Complied" &&
      data?.data?.submitted_doc.length === 0
    ) {
      openNotCompliedModal(data);
    } else {
      CompliedNotCompliedFunction(
        e.target.value,
        assignment_id,
        check_point_id,
        getUserChecklist
      );
    }
  };

  const customDataCell = (option) => {
    const { value } = option;
    return (
      <span title={value} className={styles.customDataCell}>
        {value}
      </span>
    );
  };

  const AddTemplateAction = (data) => {
    const { check_point_id, attachment_type, complied } = data.data;
    return (
      <div className={styles.fileInput}>
        <label
          className={`${
            complied === "Complied" ||
            userTypeNo === 8 ||
            userTypeNo === 14 ||
            userTypeNo === 3
              ? styles.addIconButtonDisabled
              : styles.addIconButton
          }`}
        >
          <input
            type="file"
            multiple
            disabled={
              complied === "Complied" ||
              userTypeNo === 8 ||
              userTypeNo === 14 ||
              userTypeNo === 3
            }
            onChange={(e) => handleAddDocs(e, check_point_id)}
            accept={getFileExtensions(attachment_type)}
          />

          <MdAdd />
        </label>
      </div>
    );
  };

  const statusAction = (data) => {
    const { complied, check_point_id, assignment_id } = data.data;
    return (
      <div className="d-flex align-items-center">
        <Input
          type="select"
          variant="tableDataSelectInput"
          value={complied || "select"}
          placeholder={"select"}
          disabled={userTypeNo === 8 || userTypeNo === 14 || userTypeNo === 3}
          valueForDropDown={["Complied", "Not Complied", "Not Applicable"]}
          onChange={(e) =>
            updateStatusApi(e, assignment_id, check_point_id, data)
          }
        />
      </div>
    );
  };

  const SubmitedDocsFunction = (data) =>
    SubmitedDocs(data, getUserChecklist, "checkpoints");

  useEffect(() => {
    getUserChecklist();
  }, []);

  return (
    <>
      <NotCompliedConfirmation
        handleClose={closeNotCompliedModal}
        open={notCompliedModal}
        data={notCompliedModalData}
        onSubmitFunction={getUserChecklist}
      />
      <BackDrop isLoading={isLoading} />
      <div class="table-cell" ref={tableRef}>
        <DataGrid
          id="dataGrid"
          dataSource={dataSource}
          columnAutoWidth={true}
          height={tableScrollableHeight}
          allowColumnReordering={true}
          paging={false}
          showColumnLines={false}
          showBorders={false}
          showRowLines={false}
          wordWrapEnabled={true}
          width="100%"
          padding="500px"
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
            scrollByThumb: false,
            showScrollbar: "onHover",
            useNative: "auto",
          }}
          onExporting={(e) =>
            exportValidation(dataSource?.length, e, `Mywork Checkpoints`)
          }
          export={{
            allowExportSelectedData: true,
            enabled: true,
          }}
        >
          <Toolbar>
            <Item name="searchPanel" />
            <Item name="exportButton" />
            <Item name="groupPanel" location="before" />
          </Toolbar>

          <SearchPanel visible={true} width={250} />
          <Column
            dataField="checklist_section"
            caption="Section Name"
            cellRender={customDataCell}
            headerCellRender={customHeaderCell}
          />
          <Column
            dataField="check_point"
            caption="Checkpoint"
            cellRender={customDataCell}
            headerCellRender={customHeaderCell}
          />
          <Column
            dataField="start_date"
            caption="Start Date"
            cellRender={auditDateFormater}
            headerCellRender={customHeaderCell}
            allowExporting={false}
          />
          <Column
            dataField="to_be_completed"
            caption="End Date"
            cellRender={auditDateFormater}
            headerCellRender={customHeaderCell}
            allowExporting={false}
          />

          <Column
            dataField="attachment_type"
            caption="Required Docs."
            cellRender={AttachmentTypeCustomCell}
            headerCellRender={customHeaderCell}
            allowExporting={false}
          />
          <Column
            caption="Submitted Docs"
            dataField="submitted_doc"
            cellComponent={SubmitedDocsFunction}
            headerCellRender={customHeaderCell}
            allowExporting={false}
          />
          <Column
            caption="Add Docs"
            cellRender={AddTemplateAction}
            headerCellRender={customHeaderCell}
            alignment="left"
            allowExporting={false}
          />
          <Column
            dataField="status"
            caption="Status"
            cellRender={statusAction}
            headerCellRender={customHeaderCell}
          />
          <FilterRow visible={true} />
          <Export enabled={true} />
          <Selection mode="single" />
          <GroupPanel visible={true} allowColumnDragging={true} />
        </DataGrid>
      </div>
    </>
  );
};
export default Checkpoints;
