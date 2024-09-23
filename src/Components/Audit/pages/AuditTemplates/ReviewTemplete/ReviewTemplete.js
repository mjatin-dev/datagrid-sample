import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Container from "../../../components/Containers";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import styles from "./style.module.scss";
import IconButton from "../../../components/Buttons/IconButton";
import Text from "../../../components/Text/Text";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useHistory } from "react-router-dom";
const useStyle = makeStyles({
  mainDiv: {
    display: "flex",
    flexDirection: "column",
    maxHeight: "450px",
    borderRadius: "12px",
    color: "#ffffff",
  },
  mainHeadingBox: {
    display: "flex",
    height: "40px",
    justifyContent: "space-between",
    backgroundColor: "#E9E8FF",
    borderRadius: "12px",
    padding: "2px 12px",
    marginBottom: "0.5rem",
  },
  mainHeading: {
    fontFamily: "Poppins",
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "28px",
    letterSpacing: "0em",
    textAlign: "left",
    color: "#7A73FF",
  },
  itemBox: {
    display: "flex",
    flexDirection: "column",
  },
  mainRow: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
  },
  leftDiv: {
    display: "flex",
    width: "40%",
    justifyContent: "flex-start",
  },
  leftPara: {
    fontFamily: "Poppins",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "30px",
    letterSpacing: "0em",
    textAlign: "left",
    color: "#000000",
    padding: "2px 10px",
  },
  rightDiv: {
    display: "flex",
    width: "60%",
    justifyContent: "space-between",
  },
  rightPara: {
    fontFamily: "Poppins",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "30px",
    letterSpacing: "0em",
    textAlign: "left",
    color: "#000000",
    padding: "2px 10px",
  },
  rightIcon: {
    lineHeight: "30px",
    color: "#000",
    padding: "2px 10px",
  },
});
const ReviewTemplate = () => {
  const history = useHistory();
  return (
    <Container variant="content">
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
            text={"Review Template"}
            className="mb-0 ml-3"
          />
        </div>
      </div>
      <CustomAccordion heading={"Basic Amount"}>
        <CustomRow />
      </CustomAccordion>
      <CustomAccordion heading={"Basic Amount"}>
        <CustomRow />
      </CustomAccordion>
      <CustomAccordion heading={"Basic Amount"}>
        <CustomRow />
      </CustomAccordion>
      <CustomAccordion heading={"Basic Amount"}>
        <CustomRow />
      </CustomAccordion>
    </Container>
  );
};
const CustomRow = () => {
  const classes = useStyle();
  return (
    <>
      <MainRow
        rightContent2={
          <ModeEditIcon
            className={classes.rightIcon}
            sx={{ fontSize: "40px" }}
          />
        }
        leftContent="Audit Temperature"
        rightContent="Tax Audit"
      />
      <MainRow leftContent="Audit Temperature" rightContent="Tax Audit" />
      <MainRow leftContent="Audit Temperature" rightContent="Tax Audit" />
      <MainRow leftContent="Audit Temperature" rightContent="Tax Audit" />
    </>
  );
};
const MainRow = (props) => {
  const classes = useStyle();
  return (
    <>
      <div className={classes.mainRow}>
        <div className={classes.leftDiv}>
          <p className={classes.leftPara}> {props.leftContent}</p>
        </div>
        <div className={classes.rightDiv}>
          <p className={classes.rightPara}> {props.rightContent}</p>
          {props.rightContent2}
        </div>
      </div>
    </>
  );
};
const CustomAccordion = (props) => {
  const [isShowData, setIsShowData] = useState(false);
  const classes = useStyle();
  return (
    <div className={classes.mainDiv}>
      <div
        className={classes.mainHeadingBox}
        onClick={(e) => setIsShowData(!isShowData)}
      >
        <h4 className={classes.mainHeading}>{props.heading}</h4>
        {isShowData === true ? (
          <ExpandLessIcon
            sx={{ fontSize: "40px", color: "#7A73FF", cursor: "pointer" }}
          />
        ) : (
          <ExpandMoreIcon
            sx={{ fontSize: "40px", color: "#7A73FF", cursor: "pointer" }}
          />
        )}{" "}
      </div>
      {isShowData && (
        <>
          <div className={classes.itemBox}>{<>{props.children}</>}</div>
        </>
      )}
    </div>
  );
};
export default ReviewTemplate;
