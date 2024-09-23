import { toast } from "react-toastify";

const { default: axiosInstance } = require("apiServices");

export const SaveDefaultColview = async (defaultVisibleColumns,getView) => {
    let sendObj = defaultVisibleColumns.map((item) => {
      let obj = {
        is_visible: item.is_visible,
        column_index: item.col,
        title: item.title,
      };
      return obj;
    });
    let result = await axiosInstance.post(
      "audit.api.CreateDashboardColumnSettings",
      {
        view: getView,
        data: sendObj,
      }
    );
    if (result?.data?.message?.status) {
      toast.success("Saved Successfully");
    } else {
      toast.error("Something went Wrong Please Try Again");
    }
  };


  //to SavedColumn view function
  export const getSavedColumn = async (defaultVisibleColumns,setDefaultVisibleColumns,getView) => {
    let vCOl = [...defaultVisibleColumns];
    try {
      const resp = await axiosInstance.post(
        "audit.api.getDashboardColumnSettings",
        {
          view: getView,
        }
      );
      if (resp) {
        console.log(resp);
        const { message } = resp?.data;
        if (message?.status) {
          message?.response?.map((item, i) => {
            let FindIndex = vCOl.findIndex((it) => it?.title === item?.title);
            if (FindIndex !== -1) {
              vCOl[FindIndex].is_visible = item?.is_visible;
            }
          });
          setDefaultVisibleColumns(vCOl);
        } else {
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  