import React from "react";
import Modal from "@mui/material/Modal";
import styles from "./style.module.scss";
import Text from "../Text/Text";
import { MdClose } from "react-icons/md";
import IconButton from "../Buttons/IconButton";
import { formatedDate } from 'Components/Audit/constants/CommonFunction';

export default function PreviewAllocation({
  handleClose,
  open,
  data,
  type = "question",
}) {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={styles.box}>
          <div className={styles.close}>
            <IconButton
              icon={<MdClose />}
              variant="closeBtn"
              onClick={handleClose}
            />
          </div>
          <div className={styles.allocationBox}>
            {data?.map((item) => (
              <div>
                <Text heading="h1" text={item.section} />
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">
                        {type === "question" ? "Question No" : "Checklist No"}
                      </th>
                      <th scope="col">
                        {type === "question" ? "Questions" : "Checklist"}
                      </th>
                      <th scope="col">Deadline</th>
                      <th scope="col">Assign To</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(type === "question"
                      ? item?.questions
                      : item?.checklist
                    ).map((items, index) => (
                      <tr>
                        <th scope="row">{index + 1}</th>
                        <td>
                          {type === "question"
                            ? items?.question
                            : items?.check_point}
                        </td>
                        <td>
                          {items?.deadlineDay?.length > 0
                            ? formatedDate(items.deadlineDay)
                            : "-"}
                        </td>
                        <td>
                          {items?.assignTo?.length > 0 ? items.assignTo : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
