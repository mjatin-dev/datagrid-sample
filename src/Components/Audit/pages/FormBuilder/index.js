/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import FormComponents from "../../components/FormComponents/FormComponent";
import CheckList from "./CheckList/";
import Stepper from "../../../../CommonModules/sharedComponents/Stepper";
import Text from "../../components/Text/Text";
import styles from "./style.module.scss";
import IconButton from "../../components/Buttons/IconButton";
import { MdArrowBack, MdClose } from "react-icons/md";
import CreateAuditTemplate from "../createAuditTemplate/index.jsx";
import { steps } from "../../constants/StepperSteps/steps";
import ReviewTemplateDetails from "../ReviewAndConfirm";
import Container from "../../components/Containers";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { createUpdateAuditTemplateActions } from "../../redux/createUpdateTemplatesActions";
import { setTemplateId } from "../../redux/actions";
const FormBuilder = () => {
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const [categoryList, setCategoryList] = useState([]);
  const [navigateBackToPage, setNavigateBackToPage] = useState(null);
  const isNewTemplate = searchParams.get("new_template") === "true";
  const templateId = searchParams.get("audit_template_id");
  const [sectionName, setSectionName] = useState("");
  const [headerHeight, setHeaderHeight] = useState(0);
  const stepper = useSelector(
    (state) => state?.AuditReducer?.CreateUpdateAuditTemplate?.stepperState
  );
  const dispatch = useDispatch();
  const setStepper = useCallback(
    (payload) => dispatch(createUpdateAuditTemplateActions.setStepper(payload)),
    [stepper]
  );
  const templateName = useSelector(
    (state) =>
      state?.AuditReducer?.CreateUpdateAuditTemplate?.auditScopeBasicDetails
        ?.basicDetails?.audit_template_name
  );

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
  const handleRedirectFromReviewPage = (step) => {
    if (step) {
      setStepper({
        ...stepper,
        stepperAcitveSlide: step,
        stepperCompletedSlides: stepper.stepperCompletedSlides.filter(
          (item) => item !== step
        ),
      });
    }
  };

  const navigateToHome = useCallback(() => {
    if (navigateBackToPage) {
      handleRedirectFromReviewPage(navigateBackToPage);
    } else {
      dispatch(createUpdateAuditTemplateActions.clearAllState());
      dispatch(setTemplateId(""));
      history.push("/audit");
    }
    setNavigateBackToPage(null);
  }, [navigateBackToPage]);

  useEffect(() => {
    if (!isNewTemplate && !templateId) history.replace(`/audit`);
    else if (isNewTemplate && !templateId) {
      dispatch(createUpdateAuditTemplateActions.clearAllState());
      dispatch(setTemplateId(""));
    } else if (!isNewTemplate && templateId) {
      dispatch(setTemplateId(templateId));
    }
  }, [isNewTemplate, templateId]);

  useEffect(() => {
    const _headerHeight = document
      .querySelector("." + styles.auditHeader)
      .getClientRects()[0].height;
    setHeaderHeight(_headerHeight);
  }, [stepper]);

  return (
    <Container variant="content" className={styles.maincontainer}>
      <div className={styles.auditHeader}>
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
          <IconButton
            variant="iconButtonRound"
            icon={<MdClose />}
            size="none"
            onClick={navigateToHome}
            // onClick={handleRedirectFromReviewPage}
          />
        </div>

        <div
          className={`${styles.auditHeaderButtonContainer} ${styles?.stepperContainer}`}
        >
          <Text
            heading="p"
            text={
              !isNewTemplate
                ? steps[stepper.stepperAcitveSlide - 1].editHeading +
                  templateName
                : steps[stepper.stepperAcitveSlide - 1].heading +
                  (stepper.stepperAcitveSlide !== 1 ? templateName : "")
            }
            variant="stepperMainHeading"
          />
          <Stepper steps={steps} stepper={stepper} setStepper={setStepper} />
        </div>
        <div className={styles.auditHeaderBorder}></div>
      </div>
      {/* All Audit component will render here  --start-- */}
      <div
        className={styles.auditAssignmentMain}
        style={{
          height: `calc( 100vh - ${headerHeight + 94}px )`,
        }}
      >
        {stepper.stepperAcitveSlide === 1 && (
          <CreateAuditTemplate
            next={handleNextClick}
            back={handleBackClick}
            stepper={stepper}
            templateId={templateId}
            isNewTemplate={isNewTemplate}
            categoryList={categoryList}
          />
        )}

        {stepper?.stepperAcitveSlide === 2 && (
          <FormComponents
            sectionName={sectionName}
            setSectionName={setSectionName}
            next={handleNextClick}
            back={handleBackClick}
            stepper={stepper}
            templateId={templateId}
            isNewTemplate={isNewTemplate}
          />
        )}
        {stepper?.stepperAcitveSlide === 3 && (
          <CheckList
            next={handleNextClick}
            back={handleBackClick}
            stepper={stepper}
            templateId={templateId}
            isNewTemplate={isNewTemplate}
          />
        )}
        {stepper?.stepperAcitveSlide === 4 && (
          <ReviewTemplateDetails
            setStepper={setStepper}
            templateId={templateId}
            isNewTemplate={isNewTemplate}
            setNavigateBackTo={setNavigateBackToPage}
          />
        )}
      </div>
    </Container>
  );
};

export default FormBuilder;
