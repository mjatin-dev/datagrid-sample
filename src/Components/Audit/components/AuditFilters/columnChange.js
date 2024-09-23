export const handleColumnChange = (
  e,
  defaultVisibleColumns,
  setDefaultVisibleColumns,
  tableRef
) => {
  let vCol = [...defaultVisibleColumns];
  let foundIndex = defaultVisibleColumns.findIndex((x) => {
    if (!e?.fullName) {
      return false;
    }
    let fnameIndx = e?.fullName?.match(/\d+/g)?.[0];
    let colIndx = x?.col?.match(/\d+/g)?.[0];
    return fnameIndx === colIndx;
  });
  if (foundIndex !== -1) {
    if (e.fullName?.split(".")?.pop() === "filterValues") {
      vCol[foundIndex].filter_value = e.value;
    }
    if (e.fullName?.split(".")?.pop() === "filterType") {
      vCol[foundIndex].filterType = e.value;
    }
    setDefaultVisibleColumns(vCol);
  }

  if (e?.name === "columns") {
    let vCol = [...defaultVisibleColumns];
    let foundIndex = defaultVisibleColumns.findIndex(
      (x) => x.col === e.fullName
    );
    if (foundIndex !== -1) {
      vCol[foundIndex].is_visible = e.value;
      setDefaultVisibleColumns(vCol);
      tableRef?.current?.instance?.showColumnChooser();
    }
  }
};
