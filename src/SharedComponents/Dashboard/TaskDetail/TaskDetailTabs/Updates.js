import axiosInstance from "apiServices";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import { UpdatesListItem } from "Components/Updates";
import { actions as adminMenuActions } from "Components/OnBoarding/SubModules/DashBoardCO/MenuRedux/actions";
import React, { useEffect, useRef, useState } from "react";
import useScrollHeight from "SharedComponents/Hooks/useScrollHeight";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";

const Updates = ({ task_id }) => {
  const [circularsList, setCircularsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const currentAdminMenu = useSelector(
    (state) => state?.adminMenu?.currentMenu
  );
  const dispatch = useDispatch();
  const mainContainerRef = useRef();
  const h = useScrollHeight(mainContainerRef, 0, [
    circularsList,
    task_id,
    isLoading,
  ]);
  const fetchUpdatesListByTaskId = async () => {
    try {
      setIsLoading(true);
      const { data, status } = await axiosInstance.post(
        "compliance.api.getTaskCirculars",
        {
          task_name: task_id,
        }
      );
      if (status === 200 && data?.message?.status) {
        const circulars = data?.message?.circular_details || [];
        setCircularsList([...circulars]);
        setIsLoading(false);
      } else {
        setCircularsList([]);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (task_id) {
      fetchUpdatesListByTaskId();
    }
  }, [task_id]);

  return (
    <div ref={mainContainerRef} className="container-fluid h-100 px-0">
      <div
        style={{
          maxHeight: h + "px",
          overflowY: "auto",
        }}
      >
        {isLoading && <Dots />}
        {!isLoading &&
          circularsList?.length > 0 &&
          circularsList?.map((item, index) => {
            return (
              <UpdatesListItem
                item={item}
                index={index}
                key={`${item.name}-${index}`}
                isShowCheckboxInput={false}
                openDrawer={() => {
                  dispatch(adminMenuActions.setCurrentMenu("updates"));
                  history.push("/updates", {
                    circular_id: item.name,
                    handleBack: true,
                    fromPathName:
                      currentAdminMenu === "dashboard"
                        ? "/dashboard-view"
                        : "/dashboard",
                    tabName: currentAdminMenu,
                  });
                }}
              />
            );
          })}
        {!isLoading && circularsList?.length === 0 && (
          <p className="my-3 text-muted">No updates found</p>
        )}
      </div>
    </div>
  );
};

export default Updates;
