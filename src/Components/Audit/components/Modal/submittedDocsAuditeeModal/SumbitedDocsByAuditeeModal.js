import React, { useEffect, useRef, useState } from "react";
import Modal from "@mui/material/Modal";
import styles from "./style.module.scss";
import { MdClose } from "react-icons/md";
import IconButton from "Components/Audit/components/Buttons/IconButton";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import Text from "Components/Audit/components/Text/Text";
import { SubmitedDocsAuditee } from "../../CustomCells/SubmittedDocs";

export default function SubmittedDocsByAuditeeModal({
  setShowSubmittedDocsByAuditee,
  open,
  data,
  setSubmittedDocsByAuditeeData,
  getCheckpoints,
}) {
  const content = useRef(null);
  const [QuestionData, setQuestionData] = useState([]);
  const [allExpanded, setAllExpanded] = useState(false);

  useEffect(() => {
    if (data) {
      let tempArray = [];
      data?.map((item) => {
        tempArray.push({
          ...item,
          isExpanded: false,
        });
      });
      setQuestionData(tempArray);
    }
  }, [data]);

  const SubmitedDocsFunction = (data) =>
    SubmitedDocsAuditee(data, getCheckpoints, "checkpoints");

  const onHandleExpandOpen = (e, item, index) => {
    e.stopPropagation();
    let TempFaqData = [...QuestionData];

    TempFaqData.map((item, Eindex) => {
      if (Eindex === index) {
        TempFaqData[Eindex].isExpanded = true;
      }
    });
    setQuestionData(TempFaqData);
  };

  const onHandleExpandClose = (e, item, index) => {
    e.stopPropagation();
    let TempFaqData = [...QuestionData];
    TempFaqData[index].isExpanded = false;
    setQuestionData(TempFaqData);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={() => {
          setShowSubmittedDocsByAuditee(false);
          setQuestionData([]);
          setSubmittedDocsByAuditeeData([]);
          setAllExpanded(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={styles.box}>
          <div className={styles.closeBtn}>
            <Text heading="h1" text={`Submited By Auditee`} size="medium" />
            <IconButton
              icon={<MdClose />}
              variant="exitBtn"
              onClick={() => {
                setShowSubmittedDocsByAuditee(false);
                setQuestionData([]);
                setSubmittedDocsByAuditeeData([]);
                setAllExpanded(false);
              }}
            />
          </div>
          <div className={styles.auditee__questionAnswers__box}>
            {QuestionData?.map((item, index) => {
              return (
                <>
                  <div className="accordian__main pb-3 pt-3" key={index}>
                    <div
                      className="accordian__div__main__container"
                      onClick={(e) => {
                        item.isExpanded
                          ? onHandleExpandClose(e, item, index)
                          : onHandleExpandOpen(e, item, index);
                      }}
                    >
                      <h1
                        className={`${
                          item.isExpanded
                            ? "accordian__question__isActive"
                            : "accordian__question"
                        }`}
                      >
                        {index + 1}. {item.question}
                      </h1>
                      {item.isExpanded ? (
                        <BsChevronUp
                          style={{
                            color: "black",
                            marginLeft: "auto",
                            width: "50px",
                            height: "25px",
                            cursor: "pointer",
                          }}
                          onClick={(e) => onHandleExpandClose(e, item, index)}
                        />
                      ) : (
                        <BsChevronDown
                          style={{
                            color: "black",
                            marginLeft: "auto",
                            width: "50px",
                            height: "25px",
                            cursor: "pointer",
                          }}
                          onClick={(e) => onHandleExpandOpen(e, item, index)}
                        />
                      )}
                    </div>
                  </div>
                  <div
                    className="accordian__main"
                    ref={content}
                    style={{
                      ...(!item.isExpanded
                        ? { maxHeight: "0px" }
                        : {
                            maxHeight: `${
                              content?.current?.scrollHeight + 36
                            }px`,
                          }),
                    }}
                  >
                    <div className="accordian__div__main__container">
                      <h1 className="accordion__expanded__description">
                        {item.answer_type === "attachment"
                          ? SubmitedDocsFunction(item)
                          : item.answer_text}
                      </h1>
                    </div>
                  </div>
                </>
              );
            })}
            {QuestionData?.length > 1 && (
              <>
                <div className="accordian__main pb-3 pt-3">
                  <div
                    className="accordian__div__main__container"
                    onClick={() => {
                      allExpanded
                        ? setAllExpanded(false)
                        : setAllExpanded(true);
                    }}
                  >
                    <h1
                      className={`${
                        allExpanded
                          ? "accordian__question__isActive"
                          : "accordian__question"
                      }`}
                    >
                      {QuestionData?.length + 1}. All
                    </h1>
                    {allExpanded ? (
                      <BsChevronUp
                        style={{
                          color: "black",
                          marginLeft: "auto",
                          width: "50px",
                          height: "25px",
                          cursor: "pointer",
                        }}
                        onClick={(e) => setAllExpanded(false)}
                      />
                    ) : (
                      <BsChevronDown
                        style={{
                          color: "black",
                          marginLeft: "auto",
                          width: "50px",
                          height: "25px",
                          cursor: "pointer",
                        }}
                        onClick={(e) => setAllExpanded(true)}
                      />
                    )}
                  </div>
                </div>
                <div
                  className="accordian__main"
                  ref={content}
                  style={{
                    ...(!allExpanded
                      ? { maxHeight: "0px" }
                      : {
                          maxHeight: `${content?.current?.scrollHeight + 36}px`,
                        }),
                  }}
                >
                  <div
                    className="accordian__div__main__container"
                    style={{ display: "flex", flexWrap: "wrap" }}
                  >
                    {QuestionData?.map((allItem,allIndex) => {
                      return (
                        <h1 className="accordion__expanded__description" key={allIndex}>
                          {allItem.answer_type === "attachment"
                            ? SubmitedDocsFunction(allItem)
                            : allItem.answer_text}
                        </h1>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
