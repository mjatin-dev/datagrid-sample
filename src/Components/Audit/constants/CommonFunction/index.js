import axiosInstance from "apiServices";
import { toast } from "react-toastify";
import { Workbook } from "exceljs";
import saveAs from "file-saver";
import { exportDataGrid } from "devextreme/excel_exporter";
import moment from "moment";
import "./style.scss";
import { columnsListForExport } from "CommonModules/sharedComponents/constants/constant";

export const CompliedNotCompliedFunction = (
  value,
  assignment_id,
  check_point_id,
  callBackFunction
) => {
  let setValue = "";
  if (
    value === "Complied" ||
    value === "Not Complied" ||
    value === "Not Applicable"
  ) {
    setValue = value;
  } else {
    setValue = "";
  }
  let status = false;
  const formData = new FormData();
  formData.append("assignment_id", assignment_id);
  formData.append("check_point_id", check_point_id);
  formData.append("complied", setValue);
  try {
    axiosInstance
      .post("audit.api.AnswerCheckPoint", formData)
      .then((res) => {
        if (res?.data?.message?.status) {
          toast.success(res?.data?.message?.status_response);
          callBackFunction();
          status = true;
        } else {
          toast.warning(res?.data?.message?.status_response);
          status = false;
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  } catch (err) {}
};

export const exportAllGrid = (e, rows = [], fileName = "DataGrid.xlsx") => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("Main sheet");
  worksheet.columns = columnsListForExport;
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.style.font = { bold: true };
    });
  });
  worksheet.addRows(rows);
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, fileName);
  });
  e.cancel = true;
};

export const exportValidation = (len, e, fileName) => {
  if (len === 0) {
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
  exportGrid(e, fileName);
};

export const exportGrid = (e, fileName = "dataGrid") => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("Main sheet");
  exportDataGrid({
    worksheet: worksheet,
    component: e.component,
    customizeCell: ({ gridCell, excelCell }) => {
      if (gridCell.rowType === "data") {
        if (gridCell.column.dataField === "documents_relied_upon") {
          excelCell.value =
            gridCell?.value?.length > 0
              ? gridCell?.value?.map(
                  (item, index) => `${index + 1}.${item.question}`
                )
              : "No Question";
        }
        if (
          gridCell.column.dataField === "created_on" ||
          gridCell.column.dataField === "start_date" ||
          gridCell.column.dataField === "deadline_date" ||
          gridCell.column.dataField === "end_date"
        ) {
          excelCell.value = gridCell?.value
            ? moment(gridCell?.value).format("DD MMM YYYY")
            : "-";
        }
      }
    },
  }).then(function () {
    workbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `${fileName}.xlsx`
      );
    });
  });
  e.cancel = true;
};

export const getAssignmentEndDate = (
  start_date,
  buffer_duration,
  audit_deadline
) => {
  let date1 = new Date(start_date);
  let date1getTime = date1.getTime();
  let oneDay = 1000 * 60 * 60 * 24;
  let TotalNumberOfDays =
    (Number(buffer_duration) + Number(audit_deadline)) * oneDay;
  let dateShouldBeBetween = moment(date1getTime + TotalNumberOfDays).format(
    "YYYY-MM-DD"
  );
  return dateShouldBeBetween;
};

export const CreatedOnCell = (data) => {
  const value = data?.value;
  return (
    <div className="audit__columna__auto">
      <p title={value ? moment(value).format("DD MMM YYYY") : "-"}>
        {value ? moment(value).format("DD MMM YYYY") : "-"}
      </p>
    </div>
  );
};

export const customHeaderCell = (data) => {
  const { caption, name } = data?.column;
  return <span className="customHeaderCell">{caption || name}</span>;
};

export const formatedDate = (date) => {
  return date ? moment(date).format("DD MMM YYYY") : "-";
};

export const dashBoardFileExportName = () => {
  return `Audit Dashboard_${moment().format("DD MMM YYYY")}`;
};

export const docsReliedUponCell = (data, setShowReferenceData) => {
  const { value } = data;
  return (
    <>
      {value?.length > 0 &&
        value?.map((item, index) => {
          const { question, question_id } = item;
          return (
            <span
              key={index}
              title={question}
              // onClick={() =>
              //   setShowReferenceData({
              //     isShowReference: true,
              //     question_id: question_id,
              //   })
              // }
              className={`customDataCell customDataCellLinkColor mr-2`}
            >
              {`${index + 1})${question}` || "-"}
            </span>
          );
        })}
      {!value && <span className="customDataCell">-</span>}
    </>
  );
};

export const auditTableCell = (_data) => {
  const value = _data?.value;
  return (
    <div className="audit__columna__auto">
      <p title={value}>{value?.toString() || "-"}</p>
    </div>
  );
};

export const AssignToComponent = (data) => {
  let assigned_by_name;
  let assigned_by_email;
  if (data?.data?.assigned_by?.length > 0) {
    assigned_by_email = data?.data?.assigned_by[0].assigned_by_email;
    assigned_by_name = data?.data?.assigned_by[0].assigned_by_name;
  }
  return (
    <div className="audit__columna__auto">
      <p title={assigned_by_email}>{assigned_by_name || "-"}</p>
    </div>
  );
};

export const customDurationCell = (data) => {
  const { value } = data;
  return (
    <div className="audit__columna__auto">
      <p title={value}>{value ? `${value} day${value > 1 ? "s" : ""}` : "-"}</p>
    </div>
  );
};

export const AssignToComponentQuestions = (data) => {
  const { assigned_to, assigned_to_email } = data?.data;
  return (
    <div className="audit__columna__auto">
      <p title={assigned_to_email}>{assigned_to || "-"}</p>
    </div>
  );
};

export const AssignByComponent = (data) => {
  const { assigned_by, assigned_by_email } = data?.data;
  return (
    <div className="audit__columna__auto">
      <p title={assigned_by_email}>{assigned_by || "-"}</p>
    </div>
  );
};
