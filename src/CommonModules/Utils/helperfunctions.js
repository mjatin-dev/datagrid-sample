import moment from "moment";
import styles from "./style.module.scss";

export const auditDateFormater = (data) => {
  const value = data?.value;
  return (
    <span
      title={value ? moment(value).format("DD MMM YYYY") : "-"}
      className={styles.customDataCell}
    >
      {value ? moment(value).format("DD MMM YYYY") : "-"}
    </span>
  );
};
