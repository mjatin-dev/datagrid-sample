import React, { useState, useEffect } from "react";
import Collapsible from "react-collapsible";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useHistory } from "react-router";
import styles from "./style.module.scss";
import Text from "../Text/Text";
import IconButton from "../Buttons/IconButton";
import axiosInstance from "../../../../apiServices";
import BackDrop from "../../../../CommonModules/sharedComponents/Loader/BackDrop";

const Remark = () => {
  const history = useHistory();
  const checkPointId = history?.location?.state?.checkPointId || "";
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    getChecklistInfo();
  }, []);

  //function to get branch list
  const getChecklistInfo = async () => {
    const payload = { check_point_id: checkPointId };
    try {
      const resp = await axiosInstance.post(
        "audit.api.GetChecklistInfo",
        payload
      );
      if (resp) {
        const { message } = resp?.data;
        if (message?.status) {
          let arrList = [];
          for (const [index, [key, value]] of Object.entries(
            Object.entries(message.data)
          )) {
            arrList.push({
              title: key,
              points: value?.split("\n") || [],
              open: value && index == 0 ? true : false,
            });
          }
          setDataSource(arrList);
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error.message);
      setIsLoading(false);
    }
  };

  const openCloseCollapsible = (index) => {
    let itemList = [...dataSource];
    if (!itemList[index].open) {
      itemList[index].open = true;
      setDataSource(itemList);
    } else {
      itemList[index].open = false;
      setDataSource(itemList);
    }
  };

  const getTitle = (title) => {
    let res = "";
    if (title) {
      let str = title.replaceAll("_", " ");
      res = str.charAt(0).toUpperCase() + str.slice(1);
    }
    return res;
  };

  return (
    <div className="">
      <BackDrop isLoading={isLoading} />
      <div className="row co-dashboard">
        <div className="col-12">
          <div className="co-dash-notification-grid-right m-0">
            <div className={`${styles.content}`}>
              <div className={styles.header}>
                <div className="d-flex mb-3">
                  <IconButton
                    onClick={() => {
                      history.goBack();
                    }}
                    variant="iconButtonRound"
                    description={<MdKeyboardArrowLeft />}
                    size="none"
                  />
                  <Text
                    heading="p"
                    variant="stepperMainHeading"
                    text={"Remark"}
                    className="mb-0 ml-3"
                  />
                </div>
              </div>
              {dataSource.map((items, index) => {
                return (
                  <div key={index}>
                    <div
                      className={`${styles.remarkCard} flex justify-between align-center`}
                    >
                      <div className={styles.title}>
                        {getTitle(items.title)}
                      </div>
                      <div
                        className={
                          items.points.length > 0 ? "" : styles.pointerNone
                        }
                      >
                        {items.open ? (
                          <AiOutlineUp
                            onClick={() => openCloseCollapsible(index)}
                          />
                        ) : (
                          <AiOutlineDown
                            onClick={() => openCloseCollapsible(index)}
                          />
                        )}
                      </div>
                    </div>
                    <Collapsible
                      transitionTime={400}
                      transitionCloseTime={500}
                      easing="linear"
                      overflowWhenOpen="inherit"
                      open={items.open}
                    >
                      {items.points.map((item, i) => {
                        return (
                          <div className="" key={i}>
                            {i % 2 === 0 ? (
                              <div className={styles.remarkTitle}>
                                {getTitle(item)}
                              </div>
                            ) : (
                              <div className={styles.remarkDesc}>{item}</div>
                            )}
                          </div>
                        );
                      })}
                    </Collapsible>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Remark;
