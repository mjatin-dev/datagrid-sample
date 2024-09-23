import React, { useEffect, useState } from "react";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { toast } from "react-toastify";
import { useHistory } from "react-router";
import styles from "./style.module.scss";
import Text from "../../../../../components/Text/Text";
import { Input } from "../../../../../components/Inputs/Input";
import Button from "../../../../../components/Buttons/Button";
import IconButton from "../../../../../components/Buttons/IconButton";
import axiosInstance from "../../../../../../../apiServices";
import BackDrop from "../../../../../../../CommonModules/sharedComponents/Loader/BackDrop";

const Reassign = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [deadLineList] = useState([
    { label: "7 days", value: "7" },
    { label: "14 days", value: "14" },
    { label: "21 days", value: "21" },
  ]);
  const [userList, setUserList] = useState([]);
  const history = useHistory();
  const assignmentId = history?.location?.assignment_id;

  useEffect(() => {
    getUsersList();
    getAssignmentDetail();
  }, []);

  const getUsersList = async () => {
    try {
      const resp = await axiosInstance.post("audit.api.getUserByRole");
      if (resp?.data?.message?.status) {
        const payload = resp?.data?.message?.User_list?.map((y) => {
          return {
            label: y.email,
            value: y.email,
          };
        });
        setUserList(payload);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAssignmentDetail = async () => {
    setIsLoading(true);
    try {
      const resp = await axiosInstance.get("audit.api.AssignmentDetails", {
        params: {
          assignment_id: assignmentId,
        },
      });
      if (resp?.data?.message?.data) {
        const dataSource = resp?.data?.message?.data?.question_assignment;
        const arrayUniqueByKey = [
          ...new Map(
            dataSource.map((item) => [item["questionnaire_section"], item])
          ).values(),
        ];
        const payload = arrayUniqueByKey.map((element) => {
          let temp = [];
          resp?.data?.message?.data?.question_assignment.forEach((item) => {
            if (item.questionnaire_section === element.questionnaire_section) {
              temp.push({
                section: item.questionnaire_section,
                assignTo: item.assigned_to,
                deadlineDate: item.deadline_start_from,
              });
            }
          });
          return {
            sectionId: element.question_questionnaire,
            section: element.questionnaire_section,
            deadlineDate: element.deadline_start_from,
            assignTo: element.assigned_to,
            expand: false,
            questions: temp,
          };
        });
        setQuestionList([...payload]);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
    }
  };

  const expandFunction = (index) => {
    let temp = [...questionList];
    temp[index].expand = !temp[index].expand;
    setQuestionList([...temp]);
  };

  const dropDownChangeDeadline = (event, index) => {
    let temp = [...questionList];
    temp[index].deadlineDate = event.target.value;
    setQuestionList(temp);
  };

  const dropDownAssignTo = (event, index) => {
    let temp = [...questionList];
    temp[index].assignTo = event.target.value;
    setQuestionList(temp);
  };

  const subDropDownDeadline = (event, sectionIndex, dataIndex) => {
    let temp = [...questionList];
    temp[sectionIndex].questions[dataIndex].deadlineDate = event.target.value;
    setQuestionList([...temp]);
  };

  const subDropDownAssignTo = (event, sectionIndex, dataIndex) => {
    let temp = [...questionList];
    temp[sectionIndex].questions[dataIndex].assignTo = event.target.value;
    setQuestionList([...temp]);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    let tempArr = [...questionList],
      questionArr = [];
    tempArr.map((item) => {
      questionArr.push({
        question_questionnaire: item.sectionId,
        deadline_start_from: item.deadlineDate,
        assigned_to: item.assignTo,
      });
    });
    const formData = new FormData();
    formData.append("assignment_id", assignmentId);
    formData.append(
      "question_assignment",
      questionArr.length > 0 && JSON.stringify(questionArr)
    );
    try {
      const resp = await axiosInstance.post(
        "audit.api.AssignQuestionnaire",
        formData
      );
      toast.success(
        resp?.data?.message?.status_response || "Successfully assigned"
      );
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className={styles.questionnaireForm}>
      <BackDrop isLoading={isLoading} />
      <div className={styles.questionnaireFormHeader}>
        <Text
          heading="p"
          text="Questionnaire Form"
          variant="stepperSubHeading"
        />
      </div>
      <div className={styles.questionnaireFormMain}>
        <div className={styles.questionnaireFormTable}>
          {questionList.length === 0 ? (
            <div className="text-center">No Data</div>
          ) : (
            <table>
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
              {questionList?.map((items, index) => {
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
                      <td className={styles.questionnaireFormDeadline}>
                        <Input
                          type="select"
                          variant="auditAssignmentInputBlue"
                          placeholder="Select"
                          value={items.deadlineDate || ""}
                          valueForDropDown={deadLineList}
                          onChange={(e) => {
                            dropDownChangeDeadline(e, index);
                          }}
                        />
                      </td>
                      <td className={styles.questionnaireFormAssignTo}>
                        <Input
                          type="select"
                          variant="auditAssignmentInputBlue"
                          placeholder="Select"
                          value={items.assignTo}
                          valueForDropDown={userList.filter(
                            (y) => y.value === items.assignTo
                          )}
                          onChange={(e) => dropDownAssignTo(e, index)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td colSpan="2">
                        <table className={styles.questionnaireFormTable}>
                          {items.expand && (
                            <div>
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
                                    text="Reassign to"
                                    variant="smallTableHeading"
                                  />
                                </th>
                              </thead>
                              {items?.questions?.map((item, i) => {
                                return (
                                  <tbody>
                                    <tr>
                                      <td
                                        className={
                                          styles.questionnaireFormSectionName
                                        }
                                      >
                                        <Text
                                          heading="p"
                                          text={item.section}
                                          variant="stepperSubHeadingBold"
                                        />
                                      </td>
                                      <td
                                        className={
                                          styles.questionnaireFormDeadline
                                        }
                                      >
                                        <Input
                                          type="select"
                                          variant="auditAssignmentInputBlue"
                                          placeholder="Select"
                                          value={item.deadlineDate || ""}
                                          valueForDropDown={deadLineList}
                                          onChange={(e) =>
                                            subDropDownDeadline(e, index, i)
                                          }
                                        />
                                      </td>
                                      <td
                                        className={
                                          styles.questionnaireFormAssignTo
                                        }
                                      >
                                        <Input
                                          type="select"
                                          variant="auditAssignmentInputBlue"
                                          placeholder="Select"
                                          value={item.assignTo || ""}
                                          valueForDropDown={userList}
                                          onChange={(e) =>
                                            subDropDownAssignTo(e, index, i)
                                          }
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                );
                              })}
                            </div>
                          )}
                        </table>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
              <Button
                description="Save Changes"
                disabled={isLoading}
                onClick={() => {
                  handleSubmit();
                }}
              />
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
export default Reassign;
