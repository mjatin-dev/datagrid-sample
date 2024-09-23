import { Button } from "@mui/material";
import { Modal } from "react-responsive-modal";
import axiosInstance from "apiServices";
import ReAssignTasksModal from "Components/ReAssignTasks";
import apiServices from "../../Components/OnBoarding/SubModules/DashBoardCO/api";
import React, { useState } from "react";
import { getUserListByUserType } from "CommonModules/helpers/tasks.helper";
import { toast } from "react-toastify";
import { getInitialName } from "CommonModules/helpers/GetIntialName.helper";
import DeactivateAndDeleteModal from "Components/ProjectManagement/components/Modals/DeactivateAndDeleteModal";
import deleteIcon from "../../assets/ERIcons/projectDeleteIcon.svg";
import styles from "./style.scss";
import ReAssignTasksToUserModal from "Components/ReassignTaskToUser";
import moment from "moment";
import NoResultFound from "CommonModules/sharedComponents/NoResultFound";

function DeactivatedUsers({
  fields,
  reactivateUser,
  deactivateUser,
  isShowActionOn = true,
}) {
  const { getUsersByRole } = apiServices;
  const [teamMemberData, setMemberData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);

  const [confirmation, setConfirmation] = useState(false);
  const [email, setEmail] = useState("");

  const [isShowReAssignModal, setIsShowReAssignModal] = useState(false);
  const [reAssignUserType, setReAssignUserType] = useState(null);
  const [reAssignUserId, setReAssignUserId] = useState(null);
  const [memberList, setMemberList] = useState([]);
  const [user, setUser] = useState("");
  const [isDelete, setIsDelete] = useState(false);

  const getSettingData = async () => {
    try {
      const { data, status } = await axiosInstance.get(
        `/compliance.api.getUserList`,
        {
          params: {
            isFromAssignPage: false,
          },
        }
      );
      if (status === 200 && data?.message?.length > 0) {
        if (typeof data?.message === "object") {
          setMemberData(data?.message);
        } else {
          setMemberData([]);
        }
        setIsLoading(false);
        getUserGroup();
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getUserGroup = () =>
    axiosInstance
      .get(`compliance.api.getUserGroup`)
      .then((res) => {
        if (res?.data?.message?.data) {
          let _tempDepartmentList = res?.data?.message?.data || [];
          _tempDepartmentList = [..._tempDepartmentList].map((item) => ({
            label: item,
            value: item,
          }));
          setDepartmentList([..._tempDepartmentList]);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });

  const getMembers = (role, user) => {
    getUsersByRole()
      .then((response) => {
        const { data } = response;
        const { message } = data;
        if (message && message?.length !== 0) {
          const roles = role?.split(",");
          setUser(user);
          setMemberList(
            getUserListByUserType(
              message,
              roles?.includes("Compliance Officer")
                ? 3
                : roles?.includes("Approver")
                ? 5
                : roles?.includes("Team Member")
                ? 4
                : ""
            ).filter((item) => item.email !== user)
          );
          setIsDelete(true);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const deactivateUserRequest = (assignedUser) => {
    deactivateUser(assignedUser, email);
    setIsShowReAssignModal(false);
  };

  return (
    <>
      {isDelete && (
        <div className={styles.deleteModal}>
          <Modal
            blockScroll={false}
            classNames={{
              modalContainer: "customReAssignModalContainerMobile",
              modal: "customReAssignModalMobile",
            }}
            open={isDelete}
            center={true}
            showCloseIcon={false}
            onClose={() => setIsDelete(false)}
            //modalId="governance"
            styles={{ width: 373, height: 210, overflow: "hidden" }}
            onOverlayClick={() => setIsDelete(false)}
          >
            <div className="model-design-delete-company big-height">
              <div className="delete-record-title">Approve Request?</div>
              <div className="delete-desc">
                Are you sure you want to approve the request&nbsp;? All assigned
                tasks will be deleted. You will have to re-assign those tasks to
                other members.
              </div>

              <div className="last-two-model-btn" style={{ marginTop: 20 }}>
                <button
                  className="btn cancel-delete"
                  onClick={() => {
                    setIsShowReAssignModal(true);
                    setIsDelete(false);
                  }}
                >
                  Reassign Task
                </button>
                <button
                  onClick={() => {
                    setIsDelete(false);
                  }}
                  className="btn cancel-delete"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deactivateUser("", email);
                    setIsDelete(false);
                  }}
                  className="btn delete-Record"
                >
                  Approve
                </button>
              </div>
            </div>
          </Modal>
        </div>
      )}
      <ReAssignTasksToUserModal
        recallMemberList={getSettingData}
        openModal={isShowReAssignModal}
        setShowModal={setIsShowReAssignModal}
        userType={reAssignUserType}
        userId={reAssignUserId}
        memberList={memberList}
        user={user}
        deactivateUser={deactivateUserRequest}
      />

      <DeactivateAndDeleteModal
        iconSrc={deleteIcon}
        visible={confirmation}
        Text="Are you sure, you want to reject this request?"
        onSubmit={() => {
          reactivateUser(email);
          setConfirmation(false);
        }}
        onClose={() => setConfirmation(false)}
      />
      {fields?.length > 0 ? (
        <table className="table co-company-details-tbl table_legenda">
          <thead>
            <tr>
              <th className="tw-20" clscope="col">
                Full name
              </th>

              <th className="tw-20" scope="col">
                role
              </th>
              <th className="tw-30" scope="col">
                Reason
              </th>
              <th className="tw-20" scope="col">
                Requested On
              </th>
              {isShowActionOn && (
                <th className="tw-15" scope="col">
                  Action On
                </th>
              )}
              <th className="tw-20" scope="col">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {fields?.length > 0 &&
              fields.map((item, index) => {
                return (
                  <tr className="focusRemove">
                    <td style={{ paddingLeft: "0px" }}>
                      <div
                        className="holding-list-bold-title-background"
                        style={{ padding: "0 !important" }}
                      >
                        <span className="circle-dp">
                          {getInitialName(item.full_name)}
                        </span>
                        <div className="nameCirle"> {item.full_name} </div>
                      </div>
                    </td>

                    <td>
                      <div className="contact-team"> {item.designation}</div>
                    </td>
                    <td>
                      <div
                        className="contact-team"
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "100%",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {" "}
                        {item.reason}
                      </div>
                    </td>
                    <td>
                      <div className="contact-team">
                        {" "}
                        {item.request_date
                          ? moment(item.request_date).format(
                              "DD MMM YYYY hh:mm A"
                            )
                          : "-"}
                      </div>
                    </td>
                    {isShowActionOn && (
                      <td>
                        <div className="contact-team">
                          {" "}
                          {item.deactivate_status === "Approved"
                            ? item.approve_date
                              ? moment(item.approve_date).format(
                                  "DD MMM YYYY hh:mm A"
                                )
                              : "-"
                            : item.deactivate_status === "Rejected"
                            ? item?.reject_date
                              ? moment(item.reject_date).format(
                                  "DD MMM YYYY hh:mm A"
                                )
                              : "-"
                            : "-"}
                        </div>
                      </td>
                    )}

                    <td style={{ paddingLeft: "7px" }}>
                      <div className="contact-team d-flex">
                        {item.deactivate_status === "Pending" ? (
                          <>
                            <Button
                              sx={{
                                color: "#6c5dd3",
                                cursor: "pointer",
                              }}
                              size="small"
                              onClick={() => {
                                getMembers(item.role, item.email);
                                setEmail(item.email);
                              }}
                            >
                              Approve
                            </Button>
                            <Button
                              sx={{
                                color: "red",
                                cursor: "pointer",
                              }}
                              size="small"
                              onClick={() => {
                                setConfirmation(true);
                                setEmail(item.email);
                              }}
                            >
                              reject
                            </Button>
                          </>
                        ) : item.deactivate_status === "Approved" ? (
                          <Button
                            sx={{
                              color: "#6c5dd3",
                              cursor: "pointer",
                            }}
                            size="small"
                          >
                            Approved
                          </Button>
                        ) : (
                          <Button
                            sx={{
                              color: "red",
                              cursor: "pointer",
                            }}
                            size="small"
                          >
                            rejected
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      ) : (
        // <p className="text-center text-muted">No Request Found</p>
        <NoResultFound text="No Request Found" />
      )}
    </>
  );
}

export default DeactivatedUsers;
