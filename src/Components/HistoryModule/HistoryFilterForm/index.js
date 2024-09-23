import React, { useState, useEffect } from "react";
import Datepicker from "../../../CommonModules/sharedComponents/Datepicker";
import {
  differenceInDate,
  isSameOrAfterToday,
} from "../../../CommonModules/sharedComponents/Datepicker/utils";
import { clearSelectedCompanyList, clearState } from "../redux/actions";
import { actions as adminMenuActions } from "../../../CommonModules/SideBar/Redux/actions";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { getHistoryList } from "../redux/actions";
import { withRouter } from "react-router";
import constant from "../../../CommonModules/sharedComponents/constants/constant";
import MultiSelectLicenseDropdown from "../../../CommonModules/sharedComponents/Dropdown/LicenseDropDown";
import MultiSelectCompanyDropdown from "../../../CommonModules/sharedComponents/Dropdown/CompanyDropDown";
import "./style.css";

const HistoryFilterForm = (props) => {
  const [differenceInDays, setDifferenceInDays] = useState(0);
  const [list, setList] = useState([]);
  const [listOfLicense, setListOfLicense] = useState([]);
  const priorDate = "";

  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const actionDispatch = useDispatch();

  useEffect(() => {
    if (state.HistoryReducer.companyList.length !== 0) {
      getListOfCompany();
      setListOfLicense([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.HistoryReducer.companyList]);

  const getListOfCompany = () => {
    const list = state?.HistoryReducer?.companyList.map((item) => {
      return {
        company_name: item.company_name,
        id: item.company_docname,
        selected: item.selected,
      };
    });
    setList(list);
  };

  useEffect(() => {
    if (state.HistoryReducer.licenseList.length !== 0) {
      getListOfLicense();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.HistoryReducer.licenseList]);

  const getListOfLicense = () => {
    const list = state?.HistoryReducer?.licenseList.map((item, index) => {
      return {
        LicenseCode: item.LicenseCode,
        LicenseID: index,
        selected: item.selected,
      };
    });
    setListOfLicense(list);
  };

  useEffect(() => {
    setDifferenceInDays(
      differenceInDate(state.HistoryReducer.from, state.HistoryReducer.to)
    );
  }, [state.HistoryReducer.from, state.HistoryReducer.to]);

  const setFilterAndNavigateToHistoryList = () => {
    const filters = {
      from_date:
        state.HistoryReducer.from &&
        state.HistoryReducer.from.length > 0 &&
        state.HistoryReducer.from[0] !== null
          ? moment(state.HistoryReducer.from.join("-"), "DD-M-YYYY").format(
              "YYYY-MM-DD"
            )
          : null,
      to_date:
        state.HistoryReducer.to &&
        state.HistoryReducer.to.length > 0 &&
        state.HistoryReducer.to[0] !== null
          ? moment(state.HistoryReducer.to.join("-"), "DD-M-YYYY").format(
              "YYYY-MM-DD"
            )
          : null,
      company: state.HistoryReducer.companyList
        .filter((company) => company.selected === true)
        .map((company) => company.company_docname),
      license: state.HistoryReducer.licenseList
        .filter((list) => list.selected === true)
        .map((list) => list.LicenseCode),
    };
    actionDispatch(adminMenuActions.setCurrentMenu("history"));
    actionDispatch(getHistoryList({ filters }));
    props.setIsShowFilter(!props.isShowFilter);
  };

  return (
    <>
      <div className="spacing">
        <label htmlFor="from" className="mb-2">
          From:
        </label>
        <Datepicker
          value={state.HistoryReducer.from}
          name="from"
          dispatch={actionDispatch}
          actionType="SELECT_FROM_DATE"
          pageName="historyCompliance"
        />
        <p style={{ color: "red", fontSize: "0.8rem" }}>
          {priorDate !== "" &&
            state.HistoryReducer?.from !== "" &&
            state.HistoryReducer?.from.length !== 1 &&
            moment(
              moment(state.HistoryReducer?.from.join("-"), "DD-MM-YYYY").format(
                "YYYY-MM-DD"
              )
            ).isBefore(priorDate) && (
              <small>
                {"* " +
                  constant.errorMessage.errorDueToPriorDate +
                  " " +
                  moment(priorDate, "YYYY-MM-DD").format("D MMMM Y")}
              </small>
            )}
          {state.HistoryReducer?.from.length !== 1 &&
            isSameOrAfterToday(state.HistoryReducer?.from) !== undefined &&
            !isSameOrAfterToday(state.HistoryReducer?.from) && (
              <>
                <small>
                  {"* " + constant.errorMessage.errorDueToGreaterDate}
                </small>
                <br />
              </>
            )}
        </p>
      </div>

      <div className="spacing">
        <label htmlFor="to" className="mb-2">
          To:{" "}
        </label>
        <Datepicker
          value={state.HistoryReducer.to}
          name="to"
          dispatch={actionDispatch}
          actionType="SELECT_TO_DATE"
          pageName="historyCompliance"
        />
        <p className="warning">
          {differenceInDays > 365 && (
            <>
              <small>{"* " + constant.errorMessage.errorDueToRange}</small>
              <br />
            </>
          )}

          {state.HistoryReducer.from.length !== 1 &&
            state.HistoryReducer.to.length !== 1 &&
            moment(
              moment(state.HistoryReducer?.to.join("-"), "DD-MM-YYYY").format(
                "YYYY-MM-DD"
              )
            ).isBefore(
              moment(state.HistoryReducer?.from.join("-"), "DD-MM-YYYY").format(
                "YYYY-MM-DD"
              )
            ) && <small>To Date Can't be prior to from date</small>}
        </p>
        <p className="warning">
          {differenceInDays > 365 && (
            <>
              <small>{"* " + constant.errorMessage.errorDueToRange}</small>
              <br />
            </>
          )}
          {state.HistoryReducer?.to.length !== 1 &&
            isSameOrAfterToday(state.HistoryReducer?.to) !== undefined &&
            !isSameOrAfterToday(state.HistoryReducer?.to) && (
              <>
                <small>
                  {"* " + constant.errorMessage.errorDueToGreaterDate}
                </small>
                <br />
              </>
            )}
          {state.HistoryReducer.from.length !== 1 &&
            state.HistoryReducer.to.length !== 1 &&
            moment(
              state.HistoryReducer.from[2] +
                "-" +
                state.HistoryReducer.from[1] +
                "-" +
                state.HistoryReducer.from[0] +
                "-"
            ).isAfter(
              state.HistoryReducer.to[2] +
                "-" +
                state.HistoryReducer.to[1] +
                "-" +
                state.HistoryReducer.to[0] +
                "-"
            ) && (
              <small>
                {"* " +
                  constant.errorMessage.errorDueToReverseDate +
                  moment(
                    state.HistoryReducer?.from.join("-"),
                    "DD-MM-YYYY"
                  ).format("DD-MM-YYYY") +
                  "."}
              </small>
            )}
        </p>
        {}
      </div>
      <MultiSelectCompanyDropdown
        options={list}
        lableTitle="Company:"
        inputTitle="Select Company"
        dispatch={actionDispatch}
      />
      <MultiSelectLicenseDropdown
        options={listOfLicense}
        lableTitle="License"
        inputTitle="Select License"
        dispatch={actionDispatch}
      />
      <div className="d-flex align-items-center">
        {(state?.HistoryReducer?.from?.length === 3 ||
          state?.HistoryReducer?.to?.length === 3 ||
          state.HistoryReducer.companyList
            .filter((company) => company.selected === true)
            .map((company) => company.company_docname).length > 0 ||
          state.HistoryReducer.licenseList
            .filter((license) => license.selected === true)
            .map((license) => license.LicenseCode).length > 0) &&
        (state?.HistoryReducer?.to?.length === 3
          ? isSameOrAfterToday(state.HistoryReducer?.to)
          : true) &&
        (state?.HistoryReducer?.from?.length === 3
          ? isSameOrAfterToday(state.HistoryReducer?.from)
          : true) &&
        !moment(
          moment(state.HistoryReducer?.to.join("-"), "DD-MM-YYYY").format(
            "YYYY-MM-DD"
          )
        ).isBefore(
          moment(state.HistoryReducer?.from.join("-"), "DD-MM-YYYY").format(
            "YYYY-MM-DD"
          )
        ) ? (
          <button
            onClick={setFilterAndNavigateToHistoryList}
            className="filter-button filter-button__primary"
          >
            View History
          </button>
        ) : (
          <button className="filter-button">View History</button>
        )}
        <button
          onClick={() => {
            dispatch(clearState());
            dispatch(clearSelectedCompanyList());
            props.setIsShowFilter(!props.isShowFilter);
            dispatch(
              getHistoryList({
                filters: {
                  from_date: null,
                  to_date: null,
                  company: [],
                  license: [],
                },
              })
            );
          }}
          className="filter-button filter-button__outlined ml-2"
        >
          Reset
        </button>
      </div>
    </>
  );
};

export default withRouter(HistoryFilterForm);
