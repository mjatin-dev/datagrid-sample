import { useCallback } from 'react';

const useCustomFilter = (devExRef, setDefaultVisibleColumns, defaultVisibleColumns) => {
  const clearFilter = useCallback(() => {
    const dataGrid = devExRef.current.instance;
    let vCol = [...defaultVisibleColumns];
    let DVCArr = vCol.map((itm) => ({ ...itm, filter_value: [] }));
    setDefaultVisibleColumns(DVCArr);
    dataGrid.clearSelection();
    dataGrid.clearFilter();
  }, [devExRef, setDefaultVisibleColumns, defaultVisibleColumns]);

  return clearFilter;
};

export default useCustomFilter;
