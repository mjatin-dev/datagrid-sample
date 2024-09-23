/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import Text from "../../../components/Text/Text";
import Button from "../../../components/Buttons/Button";
import {
  MdExpandMore,
  MdExpandLess,
  MdKeyboardArrowLeft,
} from "react-icons/md";
import IconButton from "../../../components/Buttons/IconButton";
import axiosInstance from "../../../../../apiServices";
import CreatableSelect from "react-select/creatable";
import { useSelector, useDispatch } from "react-redux";
import { setAssignmentDetail } from "../../../redux/actions";
import BackDrop from "../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import { toast } from "react-toastify";
import { useHistory, useParams } from "react-router";
import { BACKEND_BASE_URL } from "../../../../../apiServices/baseurl";
import Container from "../../../components/Containers";
import { DatePicker } from "antd";
import moment from "moment";
import { getAssignmentEndDate } from "Components/Audit/constants/CommonFunction";
import { customStyle } from "Components/Audit/assets/reactSelectStyles/styles";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import PreviewAllocation from "Components/Audit/components/PreviewAllocationModal/PreviewAllocation";

const CheckListForm = ({ next, stepper }) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const history = useHistory();
  const previousPath = history?.location?.state?.path;

  const selectRef = useRef();
  const tableScrollableHeight = useScrollableHeight(selectRef, 100, [
    selectRef,
    data,
  ]);

  let dateAccessArray = [3, 9];
  const userTypeNo = useSelector(
    (state) => state?.auth?.loginInfo?.auditUserType
  );

  const state = useSelector((state) => state);
  const { start_date } = state?.AuditReducer?.assignmentDetail;
  //   const assignment_id = new URLSearchParams(location.search).get("id");
  const audit_name = history?.location?.state?.audit_name;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const fetchAndSetAuditBasicDetail = async (id) => {
    const apiResponse = await axiosInstance.get(
      `${BACKEND_BASE_URL}audit.api.AssignmentDetails`,
      {
        params: {
          assignment_id: id,
        },
      }
    );
    if (apiResponse?.data?.message?.status === true) {
      dispatch(setAssignmentDetail(apiResponse?.data?.message?.data));
      getAddedSection();
      //setAssignmentDetail(apiResponse?.data?.message?.data);
    }
  };

  const getAddedSection = () => {
    let sections = state?.AuditReducer?.assignmentDetail?.checklist_assignment;
    let getSections = new Set(
      sections?.map((element) => element.checklist_section)
    );

    let requiredData = getSections?.map((element) => {
      let temp = [];
      state?.AuditReducer?.assignmentDetail?.checklist_assignment.forEach(
        (item) => {
          if (item.checklist_section === element) {
            temp.push({
              ...item,
              assignTo: item.assigned_to,
              deadlineDay: item.to_be_completed || null,
              expand: true,
              error: false,
              deadLineDateError: "",
            });
          }
        }
      );
      return {
        section: element,
        checklist: temp,
        expand: true,
        error: false,
        deadLineDateError: "",
        completed_by: sections.filter(
          (item) => item.checklist_section === element
        )[0].completed_by,
        deadlineDay:
          sections.filter((item) => item.checklist_section === element)[0]
            .to_be_completed || "",
        duration_of_completion: sections.filter(
          (item) => item.checklist_section === element
        )[0].duration_of_completion,
        buffer_period: sections.filter(
          (item) => item.checklist_section === element
        )[0].buffer_period,
        assignTo:
          sections.filter((item) => item.checklist_section === element)[0]
            .assigned_to || null,
      };
    });

    setData([...requiredData]);
  };

  const expandFunction = (index) => {
    let temp = [...data];
    temp[index].expand = !temp[index].expand;
    setData([...temp]);
  };

  const convertUnqiueUserList = (event) => {
    let tempUserList = [
      ...userList,
      {
        value: event.value,
        label: event.label,
      },
    ];
    let jsonObject = tempUserList?.map(JSON.stringify);
    let uniqueSet = new Set(jsonObject);
    let uniqueArray = Array.from(uniqueSet)?.map(JSON.parse);
    setUserList([...uniqueArray]);
  };

  const superDropDownAssignTo = (event) => {
    convertUnqiueUserList(event);
    let temp = [...data];
    temp?.map((item) => {
      item.assignTo = event.value;
      item.checklist?.map((item) => {
        item.assignTo = event.value;
      });
    });
    setData([...temp]);
  };

  const subDropDownDeadline = (
    date,
    dateString,
    sectionIndex,
    dataIndex,
    bp,
    doc
  ) => {
    let temp = [...data];
    if (date) {
      let date1 = new Date(start_date);
      let date2 = new Date(date.format("YYYY-MM-DD"));
      let dateShouldBeBetween = getAssignmentEndDate(start_date, bp, doc);
      let date3 = new Date(dateShouldBeBetween);
      if (!(date2 >= date1) || date2 > date3) {
        temp[sectionIndex].checklist[dataIndex].error = true;
        temp[sectionIndex].checklist[
          dataIndex
        ].deadLineDateError = `Date Should be between ${start_date} and ${dateShouldBeBetween}`;
      } else {
        temp[sectionIndex].checklist[dataIndex].error = false;
        temp[sectionIndex].checklist[dataIndex].deadLineDateError = "";
      }
      temp[sectionIndex].checklist[dataIndex].deadlineDay =
        date?.format("YYYY-MM-DD");
      setData([...temp]);
    } else {
      temp[sectionIndex].checklist[dataIndex].deadlineDay = null;
      setData([...temp]);
    }
  };

  const subDropDownAssignTo = (event, sectionIndex, dataIndex) => {
    convertUnqiueUserList(event);
    let temp = [...data];
    temp[sectionIndex].checklist[dataIndex].assignTo = event.value;
    setData([...temp]);
  };

  const dropDownAssignTo = (event, sectionIndex) => {
    convertUnqiueUserList(event);
    let temp = [...data];
    temp[sectionIndex].checklist?.map((item, i) => {
      item.assignTo = event.value;
    });
    temp[sectionIndex].assignTo = event.value;
    setData(temp);
  };

  const dropDownChangeDeadline = (date, dateString, sectionIndex, bp, doc) => {
    let temp = [...data];
    if (date) {
      let date1 = new Date(start_date);
      let date2 = new Date(date.format("YYYY-MM-DD"));
      let dateShouldBeBetween = getAssignmentEndDate(start_date, bp, doc);
      let date3 = new Date(dateShouldBeBetween);
      if (!(date2 >= date1) || date2 > date3) {
        temp[sectionIndex].error = true;
        temp[
          sectionIndex
        ].deadLineDateError = `Date Should be between ${start_date} and ${dateShouldBeBetween}`;
        temp[sectionIndex].checklist?.map((item, i) => {
          item.error = true;
          item.deadLineDateError = `Date Should be between ${start_date} and ${dateShouldBeBetween}`;
        });
      } else {
        temp[sectionIndex].error = false;
        temp[sectionIndex].deadLineDateError = "";
        temp[sectionIndex].checklist?.map((item, i) => {
          item.error = false;
          item.deadLineDateError = ``;
        });
      }
      temp[sectionIndex].deadlineDay = date?.format("YYYY-MM-DD");
      temp[sectionIndex].checklist?.map((item, i) => {
        item.deadlineDay = date?.format("YYYY-MM-DD");
      });
      setData(temp);
    } else {
      temp[sectionIndex].deadlineDay = null;
      temp[sectionIndex].checklist?.map((item, i) => {
        item.deadlineDay = null;
      });
      setData(temp);
    }
  };

  const onDataSubmit = () => {
    setIsLoading(true);
    const formData = new FormData();
    let temp = [...data];
    let arr = [];
    let assignToCounter = 0;
    let dateCounter = 0;
    let dateErrorCounter = 0;
    temp?.map((item) => {
      item.checklist?.map((item) => {
        arr.push({
          check_list: item.check_point_id,
          assigned_to: item.assignTo || "",
          to_be_completed: item.deadlineDay || "",
        });
        if (item.assignTo === "" || item.assignTo === null) {
          assignToCounter = assignToCounter + 1;
        } else if (item.deadlineDay === "" || item.deadlineDay === null) {
          dateCounter = dateCounter + 1;
        } else if (item.deadLineDateError !== "") {
          dateErrorCounter = dateErrorCounter + 1;
        }
      });
    });
    formData.append("assignment_id", id);
    formData.append(
      "checklist_assignment",
      arr.length > 0 ? JSON.stringify(arr) : ""
    );
    if (assignToCounter > 0) {
      toast.error("Please assign all checklist");
      setIsLoading(false);
    } else if (dateCounter > 0) {
      toast.error("Please select date for all checklist and sections");
      setIsLoading(false);
    } else if (dateErrorCounter > 0) {
      toast.error("Please check seleted date range");
      setIsLoading(false);
    } else {
      try {
        axiosInstance
          .post("audit.api.AssignQuestionnaire", formData)
          .then((res) => {
            if (res?.data?.message?.status === true) {
              setIsLoading(false);
              toast.success("Checklist Assigned");
              history.replace({
                pathname: `${previousPath}`,
                state: {
                  audit_name,
                },
              });
            } else {
              setIsLoading(false);
              toast.error("Please add checkpoints first");
            }
          });
      } catch (err) {
        setIsLoading(false);
      }
    }
  };

  const getUserList = async () => {
    const { data, status } = await axiosInstance.post(
      "audit.api.getUserByRole"
    );
    if (status === 200) {
      const { User_list } = data?.message;
      const dropDownList = User_list?.map((item) => {
        return {
          value: item.email,
          label: item.first_name,
        };
      });
      setUserList(dropDownList);
    }
  };

  useEffect(() => {
    getUserList();
    fetchAndSetAuditBasicDetail(id);
  }, []);

  return (
    <Container variant="contentWithoutOverflow">
      <IconButton
        onClick={() => {
          history.goBack();
        }}
        variant="iconButtonRound"
        description={<MdKeyboardArrowLeft />}
        size="none"
      />
      <Text
        heading="h1"
        text="Assign CheckList To Team"
        variant="stepperSubHeading"
      />
      <div className={styles.questionnaireForm} ref={selectRef}>
        <BackDrop isLoading={isLoading} />
        <div className={styles.questionnaireFormHeader}>
          <Text heading="p" text="Checklist Form" variant="stepperSubHeading" />
          <div className={styles.questionnaireFormHeaderOptions}>
            <div className={styles.inputGroupRowReverse}>
              <CreatableSelect
                styles={customStyle}
                placeholder="Select"
                onChange={superDropDownAssignTo}
                options={userList}
                menuPortalTarget={document?.body}
                isDisabled={data?.length === 0}
                // value={null}
              />
            </div>
            <Button
              description="preveiw allocation"
              variant="preview"
              disabled={data?.length === 0}
              onClick={() => handleOpen()}
            />
          </div>
        </div>
        <PreviewAllocation
          open={open}
          handleClose={handleClose}
          data={data}
          type="checklist"
        />
        <div
          className={styles.questionnaireFormMain}
          style={{ height: tableScrollableHeight }}
        >
          <table className={styles.questionnaireFormTable}>
            <thead>
              <th>
                <Text
                  heading="p"
                  text="section name"
                  variant="smallTableHeading"
                />
              </th>
              <th>
                <Text
                  heading="p"
                  text="Deadline Starts from"
                  variant="smallTableHeading"
                />
              </th>
              <th>
                <Text
                  heading="p"
                  text="Assign to"
                  variant="smallTableHeading"
                />
              </th>
            </thead>

            {/* General Details */}
            {data?.map((items, index) => {
              return (
                <tbody key={index}>
                  <tr>
                    <td className={styles.questionnaireFormSectionName}>
                      <Text
                        heading="p"
                        text={items.section}
                        variant="stepperSubHeadingBold"
                      />
                      <IconButton
                        variant="iconButtonRound"
                        icon={
                          items.expand ? <MdExpandMore /> : <MdExpandLess />
                        }
                        size="none"
                        onClick={() => expandFunction(index)}
                      />
                    </td>
                    <td>
                      <DatePicker
                        placeholder="Select Deadline"
                        format="DD MMM YYYY"
                        disabled={
                          !dateAccessArray.includes(userTypeNo) &&
                          dateAccessArray.includes(Number(items?.completed_by))
                            ? true
                            : false
                        }
                        onChange={(date, dateString) => {
                          dropDownChangeDeadline(
                            date,
                            dateString,
                            index,
                            items.buffer_period,
                            items.duration_of_completion
                          );
                        }}
                        value={
                          !items.deadlineDay ? "" : moment(items.deadlineDay)
                        }
                        style={{
                          minWidth: "50px",
                          height: "45px",
                          borderRadius: "10px",
                        }}
                        disabledDate={(current) => {
                          let startDate = moment(start_date);
                          let endDate = getAssignmentEndDate(
                            start_date,
                            items.buffer_period,
                            items.duration_of_completion
                          );
                          return (
                            (current &&
                              (current < startDate || current > endDate)) ||
                            (current &&
                              current.isSameOrAfter(endDate, "day")) ||
                            moment(current).isBefore(moment(), "day")
                          );
                        }}
                      />
                      <br />
                      {items.error && (
                        <span style={{ color: "red" }}>
                          {items.deadLineDateError}
                        </span>
                      )}
                    </td>

                    <td className={styles.questionnaireFormAssignTo}>
                      <CreatableSelect
                        styles={customStyle}
                        placeholder="Select"
                        value={
                          userList?.filter(
                            (user) => user.value === items.assignTo
                          ).length > 0
                            ? userList?.filter(
                                (user) => user.value === items.assignTo
                              )
                            : [
                                {
                                  label: items.assignTo,
                                  value: items.assignTo,
                                },
                              ]
                        }
                        onChange={(e) => dropDownAssignTo(e, index)}
                        options={userList}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="3">
                      <table className={styles.questionnaireFormTable}>
                        {items.expand && (
                          <>
                            <thead>
                              <th>
                                <Text
                                  heading="p"
                                  text="checkpoint"
                                  variant="smallTableHeading"
                                />
                              </th>
                              <th>
                                <Text
                                  heading="p"
                                  text="Deadline Starts from"
                                  variant="smallTableHeading"
                                />
                              </th>
                              <th>
                                <Text
                                  heading="p"
                                  text="Assign to"
                                  variant="smallTableHeading"
                                />
                              </th>
                            </thead>
                            {items?.checklist?.map((item, i) => {
                              return (
                                <tbody key={i}>
                                  <tr>
                                    <td
                                      className={
                                        styles.questionnaireFormSectionName
                                      }
                                    >
                                      <Text
                                        heading="p"
                                        text={item.check_point}
                                        variant="stepperSubHeadingBold"
                                      />
                                    </td>
                                    <td
                                      className={
                                        styles.questionnaireFormDeadline
                                      }
                                    >
                                      <DatePicker
                                        placeholder="Select DeadLine"
                                        format="DD MMM YYYY"
                                        disabled={
                                          !dateAccessArray.includes(
                                            userTypeNo
                                          ) &&
                                          dateAccessArray.includes(
                                            Number(item?.completed_by)
                                          )
                                            ? true
                                            : false
                                        }
                                        onChange={(date, dateString) => {
                                          subDropDownDeadline(
                                            date,
                                            dateString,
                                            index,
                                            i,
                                            item.buffer_period,
                                            item.duration_of_completion
                                          );
                                        }}
                                        style={{
                                          minWidth: "50px",
                                          height: "45px",
                                          borderRadius: "10px",
                                        }}
                                        value={
                                          !item.deadlineDay
                                            ? ""
                                            : moment(item.deadlineDay)
                                        }
                                        disabledDate={(current) => {
                                          let startDate = moment(start_date);
                                          let endDate = getAssignmentEndDate(
                                            start_date,
                                            item.buffer_period,
                                            item.duration_of_completion
                                          );
                                          return (
                                            (current &&
                                              (current < startDate ||
                                                current > endDate)) ||
                                            (current &&
                                              current.isSameOrAfter(
                                                endDate,
                                                "day"
                                              )) ||
                                            moment(current).isBefore(
                                              moment(),
                                              "day"
                                            )
                                          );
                                        }}
                                      />
                                      <br />
                                      {item.error && (
                                        <span style={{ color: "red" }}>
                                          {item.deadLineDateError}
                                        </span>
                                      )}
                                    </td>
                                    <td
                                      className={
                                        styles.questionnaireFormAssignTo
                                      }
                                    >
                                      <CreatableSelect
                                        styles={customStyle}
                                        placeholder="Select"
                                        value={
                                          userList?.filter(
                                            (user) =>
                                              user.value === item.assignTo
                                          ).length > 0
                                            ? userList?.filter(
                                                (user) =>
                                                  user.value === item.assignTo
                                              )
                                            : [
                                                {
                                                  label: item.assignTo,
                                                  value: item.assignTo,
                                                },
                                              ]
                                        }
                                        onChange={(e) =>
                                          subDropDownAssignTo(e, index, i)
                                        }
                                        options={userList}
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              );
                            })}
                          </>
                        )}
                      </table>
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
          <div className={styles.buttonContainer}>
            <Button
              description="Save"
              onClick={() => {
                onDataSubmit();
              }}
            />
            <Button
              description="Cancel"
              variant="preview"
              onClick={() => {
                history.replace(`${previousPath}`);
              }}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CheckListForm;
