export const isAuditFiltersApplied = (cols = []) => {
    return !!cols?.find(
      (item) => item.filter_value && item.filter_value?.length > 0
    );
  };