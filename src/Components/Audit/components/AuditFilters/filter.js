import axiosInstance from "apiServices";
import { isNotEmpty } from "CommonModules/helpers/string.helpers";
import moment from "moment";
import CustomStore from "devextreme/data/custom_store";

const extractFiltersFromLoadOptions = (
  auditDashBoardObjKey,
  filtersData = [],
  individual_filter_list,
  sendObj,
  isNotIncluded = false
) => {
  if (filtersData === "and") isNotIncluded = false;
  if (filtersData[1] === "=" || filtersData[1] === "<>") {
    individual_filter_list[filtersData[0]]?.push(filtersData[2]);
    if (filtersData[1] === "<>" || isNotIncluded)
      individual_filter_list[
        "is_not_included_" + auditDashBoardObjKey[filtersData[0]]
      ] = true;
  } else if (filtersData[1] === "contains") {
    console.log(
      "check serach filters",
      filtersData,
      filtersData[0],
      auditDashBoardObjKey
    );
    sendObj.inside_filter_search = [
      {
        selector: auditDashBoardObjKey[filtersData[0]],
        contain: filtersData[2],
      },
    ];
  } else {
    filtersData.forEach((lp) => {
      if (!isNotIncluded) isNotIncluded = lp === "!";
      if (Array.isArray(lp)) {
        extractFiltersFromLoadOptions(
          auditDashBoardObjKey,
          lp,
          individual_filter_list,
          sendObj,
          isNotIncluded
        );
      }
    });
  }
};

const createCustomAuditDataGridStore = (
  apiUrl,
  auditDashBoardObjKey,
  filter_list,
  indivisual_filter,
  payload,
  key = "assignment_id"
) => {
  return new CustomStore({
    key: key,
    load: async (loadOptions) => {
      let is_exporting =
        loadOptions?.isLoadingAll || !loadOptions?.take ? true : false;
      let sendObj = {
        ...payload,
        inside_filter_search: [],
        get_all: is_exporting ? 1 : 0,
      };
      sendObj.search_filter = JSON.parse(JSON.stringify(filter_list));
      let is_filter_listing = false;
      let individual_filter_list = JSON.parse(
        JSON.stringify(indivisual_filter)
      );
      [
        "skip",
        "take",
        "requireGroupCount",
        "sort",
        "filter",
        "totalSummary",
        "group",
        "groupSummary",
      ].forEach((i) => {
        if (i in loadOptions && isNotEmpty(loadOptions[i])) {
          if (i === "filter") {
            extractFiltersFromLoadOptions(
              auditDashBoardObjKey,
              loadOptions[i],
              individual_filter_list,
              sendObj,
              false
            );
          } else if (
            i === "sort" &&
            loadOptions[i] &&
            loadOptions[i].length > 0
          ) {
            sendObj[i] = [...loadOptions[i]].map((item) => ({
              ...item,
              selector: auditDashBoardObjKey[item?.selector],
            }));
          } else {
            sendObj[i] = loadOptions[i];
            if (i === "group" && isNotEmpty(loadOptions[i])) {
              let gpArray = [];
              loadOptions[i].forEach((Gitm) => {
                let obj = {
                  ...Gitm,
                  selector: auditDashBoardObjKey[Gitm.selector],
                };
                gpArray?.push(obj);
              });
              sendObj[i] = gpArray;
              is_filter_listing = true;
            }
          }
        }
      });
      if (is_filter_listing) {
        // sendObj.take = lopadOptoi;
        sendObj.get_all = 1;
      }
      // if (skipReff.current === 1) {
      //   sendObj.skip = 0;
      //   skipReff.current = 0;
      // } else {
      //   sendObj.skip = loadOptions.skip;
      // }
      Object.keys(individual_filter_list).map((item) => {
        if (
          !individual_filter_list[item] ||
          individual_filter_list[item]?.length === 0
        ) {
          return false;
        }
        if (typeof individual_filter_list[item] === "object") {
          if (auditDashBoardObjKey[item] === "created_on") {
            let ddArr =
              individual_filter_list[item]?.length < 2
                ? moment(individual_filter_list[item][0]).format("DD MMM YYYY")
                : individual_filter_list[item]
                    .map((DD) => moment(DD).format("DD MMM YYYY"))
                    .join("~>");
            sendObj.search_filter[auditDashBoardObjKey[item]] = ddArr;
          } else {
            sendObj.search_filter[auditDashBoardObjKey[item]] =
              individual_filter_list[item].join("~>");
          }
        } else {
          sendObj.search_filter[item] = individual_filter_list[item];
        }
      });
      let resultObj = {
        data: [],
        totalCount: 0,
        summary: 0,
        groupCount: 0,
      };
      let resultResponse = await axiosInstance.post(apiUrl, sendObj);
      if (is_filter_listing) {
        let FilterObj = [];
        resultResponse?.data?.message?.filter_options.forEach((item) => {
          if (item) {
            FilterObj?.push({ count: 0, items: null, key: item });
          }
          if(item === "" || item === null){
            FilterObj?.push({ count: 0, items: null, key: "blank" });
          }
        });
        const groupingData = [...FilterObj].slice(
          loadOptions.skip,
          FilterObj.length - loadOptions.skip > loadOptions.take
            ? loadOptions.take + loadOptions.skip
            : FilterObj.length
        );
        resultObj.totalCount = FilterObj.length;
        resultObj.data = groupingData;
        return resultObj;
      }
      resultObj.data = resultResponse?.data?.message?.data || [];
      resultObj.totalCount = resultResponse?.data?.data?.count || 0;
      return resultObj;
    },
  });
};

export { createCustomAuditDataGridStore };
