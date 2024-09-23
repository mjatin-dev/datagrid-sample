import React, { useEffect, useState, useRef } from "react";
import styles from "./style.module.scss";
import Text from "../../components/Text/Text";
import IconButton from "../../components/Buttons/IconButton";
import { MdArrowBack, MdClose } from "react-icons/md";
import Stepper from "../../../../CommonModules/sharedComponents/Stepper";
import QuestionnaireForm from "./QuestionnaireForm";
import AssignmentBasicDetails from "./AssignmentBasicDetails";
import AddressDetails from "./AddressDetails";
import ReviewDetails from "./ReviewDetails";
import { useHistory } from "react-router";
import {
  clearAssignmentDetails,
  clearAssignmentId,
  setAssignmentDetail,
} from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import CreateMultipleAssignment from "./CreateMultipleAssignment";
import MultipleAssignmentDetail from "./MultipleAssignmentDetail";
import { createUpdateAuditTemplateActions } from "Components/Audit/redux/createUpdateTemplatesActions";
import { useLocation } from "react-router";
import axiosInstance from "apiServices";

const AuditAssignment = () => {
  const history = useHistory();

  const scrollToTopRef = useRef(null);
  const state = useSelector((state) => state);
  const location = useLocation();

  const [data, setData] = useState([]);
  const [values, setValues] = useState({
    assignment_id: "",
    audit_template_name: "",
    audit_name: "",
    company_name: "",
    audit_scope: "",
    audit_description: "",
    start_date: "",
    audit_deadline: "",
    buffer_duration: "",
    auditor_firm_name: "",
    auditor_name: "",
    auditor_email: "",
    auditor_designation: "",
    auditor_mobile_no: "",
    auditor_mobile_country_code: "91",
  });
  const [auditTeamDetails, setAuditTeamDetails] = useState([
    {
      team_member: "",
      team_member_email: "",
      designation: "",
      mobile_no: "",
      country_code: "91",
      EmailErr: "",
      MobileErr: "",
      CountryCodeErr: "",
      DesignationErr: "",
      TeamMemberErr: "",
    },
  ]);
  const [branchData, setBranchData] = useState({
    address_title: "",
    address_line1: "",
    pincode: "",
    state: "",
    city: "",
    branch_auditee_incharge: "",
    auditee_incharge_email: "",
  });
  const [headerHeight, setHeaderHeight] = useState(0);
  const dispatch = useDispatch();
  const [stepper, setStepper] = useState({
    stepperAcitveSlide: 1,
    stepperCompletedSlides: [],
  });
  const searchParams = new URLSearchParams(history?.location?.search);
  const assignmentId = searchParams.get("id");

  const [isMultiple, setIsMultiple] = useState(false);
  const [multipleAssignmentStep, setMultiplesAssignmentStep] = useState(0);

  const [multiAssignmentList, setMultiAssignmentList] = useState([]);

  const [tab, setTab] = useState(1);
  const assignment_id = new URLSearchParams(location.search).get("id");

  const auditAssignmentSteps = [
    {
      id: 1,
      text: "Add Audit Scope",
      heading: "Create Audit Assignment",
      editHeading: "Edit Audit Assignment",
    },
    {
      id: 2,
      text: "Add Additional Details",
      heading: "Add Additional Details",
      editHeading: "Edit Additional Details",
    },
    {
      id: 3,
      text: "Assign Questionnaire",
      heading: `Assign ${values?.audit_name || ""} Questionnaire`,
      editHeading: `Edit Assign ${values?.audit_name || ""} Questionnaire`,
    },
    {
      id: 4,
      text: "Review Audit Assignment",
      heading: "Review Assignment Details",
      editHeading: "Review Edited Assignment Details",
    },
  ];

  // --- Function for next click
  const handleNextClick = (step) => {
    if (step) {
      setStepper({
        ...stepper,
        stepperAcitveSlide: step + 1,
        stepperCompletedSlides: [...stepper.stepperCompletedSlides, step],
      });
    }
  };

  // --- Function for back click
  const handleBackClick = (step) => {
    if (step) {
      setStepper({
        ...stepper,
        stepperAcitveSlide: step - 1,
        stepperCompletedSlides: stepper.stepperCompletedSlides.filter(
          (item) => item !== step
        ),
      });
    }
  };

  // to set Questionnaarie form
  const getAddedSection = () => {
    let sections = state?.AuditReducer?.assignmentDetail?.question_assignment;
    let getSections = new Set(
      sections?.map((element) => element.questionnaire_section)
    );

    let requiredData = getSections?.map((element) => {
      let temp = [];
      state?.AuditReducer?.assignmentDetail?.question_assignment.forEach(
        (item) => {
          if (item.questionnaire_section === element) {
            temp.push({
              ...item,
              assignTo: item.assigned_to,
              deadlineDay: item.to_be_completed || "",
              expand: false,
              error: false,
              deadLineDateError: "",
            });
          }
        }
      );
      return {
        section: element,
        questions: temp,
        expand: false,
        deadLineDateError: "",
        error: false,
        completed_by: sections.filter(
          (item) => item.questionnaire_section === element
        )[0].completed_by,
        deadlineDay: sections.filter(
          (item) => item.questionnaire_section === element
        )[0].to_be_completed,
        assignTo:
          sections.filter((item) => item.questionnaire_section === element)[0]
            .assigned_to || null,
        duration_of_completion: sections.filter(
          (item) => item.questionnaire_section === element
        )[0].duration_of_completion,
        buffer_period: sections.filter(
          (item) => item.questionnaire_section === element
        )[0].buffer_period,
      };
    });

    setData([...requiredData]);
  };

  // to fetch question and sections from Template id
  const getSectionAndQuestion = () => {
    try {
      axiosInstance
        .get("audit.api.getQuestionFromAudit", {
          params: {
            audit_template_id:
              values?.audit_template_name || state?.AuditReducer?.templateId,
          },
        })
        .then((res) => {
          if (res?.data?.message?.question_list) {
            let section_data = res?.data?.message?.question_list || [];
            let sections = [...res?.data?.message?.question_list]?.map(
              (item) => item.questionnaire_section
            );
            sections = [...new Set([...sections])];
            let requiredData = [...sections]?.map((element) => {
              let temp = [];
              section_data.forEach((item) => {
                if (item.questionnaire_section === element) {
                  temp.push({
                    ...item,
                    assignTo: "",
                    error: false,
                    deadLineDateError: "",
                  });
                }
              });
              return {
                section: element,
                error: false,
                questions: temp,
                expand: false,
                assignTo: "",
                deadlineDay: "",
                deadLineDateError: "",
                duration_of_completion: section_data.filter(
                  (item) => item.questionnaire_section === element
                )[0].duration_of_completion,
                buffer_period: section_data.filter(
                  (item) => item.questionnaire_section === element
                )[0].buffer_period,
              };
            });
            setData(requiredData);
          }
        });
    } catch (err) {}
  };

  useEffect(() => {
    if (assignment_id) {
      getAddedSection();
    } else {
      getSectionAndQuestion();
    }
  }, [values?.audit_template_name]);

  useEffect(() => {
    return () => {
      dispatch(setAssignmentDetail({}));
      dispatch(clearAssignmentDetails({}));
      dispatch(clearAssignmentId());
      dispatch(createUpdateAuditTemplateActions.clearAllState());
    };
  }, []);

  useEffect(() => {
    scrollToTopRef.current.scrollTo(0, 0);
    const _headerHeight = document
      .querySelector("." + styles.auditHeader)
      .getClientRects()[0].height;
    setHeaderHeight(_headerHeight);
  }, [stepper]);

  return (
    <div className={styles.auditAssignment}>
      <div className={styles.auditHeader}>
        <div className={styles.header}>
          <div className="d-flex mb-3 justify-content-between">
            <Text
              heading="p"
              variant="stepperMainHeading"
              text={
                !assignmentId
                  ? auditAssignmentSteps[stepper?.stepperAcitveSlide - 1]
                      ?.heading
                  : auditAssignmentSteps[stepper?.stepperAcitveSlide - 1]
                      ?.editHeading
              }
              className="mb-0"
            />

            <IconButton
              variant="iconButtonRound"
              onClick={() => {
                history.goBack();
                dispatch(setAssignmentDetail({}));
                dispatch(clearAssignmentDetails({}));
                dispatch(clearAssignmentId());
                dispatch(createUpdateAuditTemplateActions.clearAllState());
              }}
              icon={<MdClose />}
              size="none"
            />
          </div>

          <div>
            <div
              className={`${styles.tab} ${tab === 1 && styles.tabActive}`}
              onClick={() => setTab(1)}
            >
              Single
            </div>
            <div
              className={`${styles.tab} ${tab === 2 && styles.tabActive}`}
              onClick={() => setTab(2)}
            >
              Multiple
            </div>
          </div>
        </div>
        <div
          className={`${styles.auditHeaderButtonContainer} ${
            stepper?.stepperAcitveSlide < 2 ? styles.rightAlign : ""
          }`}
        >
          {stepper?.stepperAcitveSlide > 1 && (
            <IconButton
              onClick={() => handleBackClick(stepper?.stepperAcitveSlide)}
              variant="iconButtonRound"
              icon={<MdArrowBack />}
              size="none"
            />
          )}
        </div>
        {tab === 1 && (
          <div
            className={`${styles.auditHeaderButtonContainer} ${styles?.stepperContainer}`}
          >
            <Text heading="p" text="" variant="stepperMainHeading" />

            <Stepper
              steps={auditAssignmentSteps}
              setStepper={setStepper}
              stepper={stepper}
            />
          </div>
        )}

        <div className={styles.auditHeaderBorder}></div>
      </div>
      <div
        className={styles.auditAssignmentMain}
        style={{
          height:
            stepper?.stepperAcitveSlide !== 3 &&
            `calc( 100vh - ${headerHeight + 90}px )`,
        }}
        ref={scrollToTopRef}
      >
        {tab === 1 && (
          <div>
            {stepper?.stepperAcitveSlide === 1 && (
              <AssignmentBasicDetails
                next={handleNextClick}
                stepper={stepper}
                values={values}
                setValues={setValues}
              />
            )}
            {stepper?.stepperAcitveSlide === 2 && (
              <AddressDetails
                next={handleNextClick}
                stepper={stepper}
                auditTeamDetails={auditTeamDetails}
                setAuditTeamDetails={setAuditTeamDetails}
                branchData={branchData}
                setBranchData={setBranchData}
              />
            )}
            {stepper?.stepperAcitveSlide === 3 && (
              <QuestionnaireForm
                next={handleNextClick}
                stepper={stepper}
                values={values}
                data={data}
                setData={setData}
              />
            )}
            {stepper?.stepperAcitveSlide === 4 && (
              <ReviewDetails back={handleBackClick} stepper={stepper} />
            )}
          </div>
        )}

        {tab === 2 && (
          <div>
            {multipleAssignmentStep === 0 && (
              <CreateMultipleAssignment
                setIsMultiple={setIsMultiple}
                isMultiple={isMultiple}
                multipleAssignmentStep={multipleAssignmentStep}
                setMultipleAssignmentStep={setMultiplesAssignmentStep}
                setMultiAssignmentList={setMultiAssignmentList}
              />
            )}

            {multipleAssignmentStep === 1 && (
              <MultipleAssignmentDetail
                setIsMultiple={setIsMultiple}
                isMultiple={isMultiple}
                multipleAssignmentStep={multipleAssignmentStep}
                setMultipleAssignmentStep={setMultiplesAssignmentStep}
                multiAssignmentList={multiAssignmentList}
              />
            )}
          </div>
        )}

        {/* auditAssignmentMain ends here */}
      </div>
    </div>
  );
};

export default AuditAssignment;
