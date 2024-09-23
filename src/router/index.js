import React from "react";
import { Route } from "react-router-dom";

import ComplianceLanding from "../Components/ComplianceLandingPage";
import TeamMember from "../Components/TeamMemberFlow/DashBoard";
import DashBoardView from "../Components/OnBoarding/SubModules/DashBoardCO/components/DashBoardView";
import OnBoarding from "../Components/OnBoarding/SubModules/GetStarted";
import ComplianceDemo from "../Components/ComplianceModule";
import ComplianceDemoEnd from "../Components/ComplianceModule/ComplianceDemo7";
import PersonalDetails from "../Components/OnBoarding/SubModules/PersonalDetails";
import CoDashboard from "../Components/CoDashboard";
import AssignTask from "../Components/OnBoarding/SubModules/AssignTask";
import VerifyEmailErrorPage from "../Components/OnBoarding/SubModules/VerifyEmail";
import EmailVerifiedPage from "../Components/OnBoarding/SubModules/EmailVerify";
import NewEmailVerification from "../Components/OnBoarding/SubModules/NewEmailVerification";

import TeamMemberFlowPersonalDetails from "../Components/TeamMemberFlow/VerificationFlow/components/PersonalDetails";
import TeamMemberFlowOTP from "../Components/TeamMemberFlow/VerificationFlow/components/OTPVerification";
import OTPVerificationCO from "../Components/OnBoarding/SubModules/VerifyOTP";
import DashBoardCO from "../Components/OnBoarding/SubModules/DashBoardCO/components";
import SIGNUPPOP from "../Components/TeamMemberFlow/index";
import CompanyDetails from "../Components/OnBoarding/SubModules/CompanyDetails";
import VerifyOTPCO from "../Components/OnBoarding/SubModules/VerifyOTP";
import YouAreDone from "../Components/OnBoarding/SubModules/YourAreDone";

import Governance from "../Components/OnBoarding/SubModules/Governance";

import CoPersonal from "../Components/OnBoarding/SubModules/DashBoardCO/components/CoSetting/CoPersonal/index";
import PersonalDetailsTM from "../Components/TeamMemberFlow/VerificationFlow/components/PersonalDetails";
import Login from "../Components/Authectication/components/Login";
import ForgotPassword from "../Components/Authectication/components/ForgotPassword";
import ChangePassword from "../Components/Authectication/components/ChangePassword";
import RedirectToDashboard from "../Components/OnBoarding/SubModules/redirectToLogin";

import CoSetting from "../Components/OnBoarding/SubModules/DashBoardCO/components/CoSetting";
import UserProfileVerifcation from "../Components/UserVerification/components/PersonalDetails";
import UserOTPVerifcation from "../Components/UserVerification/components/OTPVerification";
import UserVerificationProcess from "../Components/UserVerification/components";
import CalendarView from "../Components/OnBoarding/SubModules/DashBoardCO/components/CalendarView/components";
import BoardView from "../Components/OnBoarding/SubModules/DashBoardCO/components/BoardView";
import MultiCompanyQuickOverView from "../Components/OnBoarding/SubModules/DashBoardCO/components/DashBoardView/component/MultiCompanyView/index";
import MultiTeamMemberView from "../Components/OnBoarding/SubModules/DashBoardCO/components/DashBoardView/component/MultiTeamMemberView/index";
import PendingAction from "../Components/OnBoarding/SubModules/DashBoardCO/components/DashBoardView/component/PendingAction/index";
import RiskAndDelaysTaskList from "../Components/OnBoarding/SubModules/DashBoardCO/components/DashBoardView/component/RiskAndDelaysTaskList/index";
import ExperReview from "../Components/ExpertReviewModule";
import Thankyou from "../CommonModules/sharedComponents/Thankyou";
import Invoice from "../Components/OnBoarding/SubModules/DashBoardCO/components/CoSetting/CoAccount/Invoice/Invoice";
import AuditAssignment from "../Components/Audit/pages/AuditAssignment";
import ReviewTemplate from "../Components/Audit/pages/AuditTemplates/ReviewTemplete/ReviewTemplete";

import QuestionnaireAnswer from "../Components/Audit/components/SubmitAnswerModal";
//import DashBoardAuditee from "../Components/OnBoarding/SubModules/DashBoardCO/components/Auditee/AuditeeQuestionAnswer";

//Audit DashBoard Route
import DashBoardAuditor from "../Components/OnBoarding/SubModules/DashBoardCO/components/Auditor/AuditorQuestionAnswer";
import DashBoardRemark from "../Components/OnBoarding/SubModules/DashBoardCO/components/Remark";
import ExpertSection from "Components/ComplianceLandingPage/HomeComp/ExpertSection";

import {
  isShowAuditModule,
  isShowOtherComplianceModule,
  isShowProjectModule,
  isShowSmeModule,
} from "app.config";
import PricingPage from "Components/CapmTechLandingPage/PricingPage";
import ScrollToTop from "ScrollToTop";
import Home from "Components/ComplianceLandingPage/Home";
import FAQ from "Components/CapmTechLandingPage/FAQ";
import SmeOnBoarding from "Components/OnBoarding/SubModules/DashBoardCO/components/SmeOnBoarding";
import SmeOnBoardingPreview from "Components/OnBoarding/SubModules/DashBoardCO/components/SmeOnBoarding/SmeOnBoardingPreview";
import PageNotFound from "404PageNotFound/PageNotFound";
// import Events from "Components/Events";

export default function AppRouter() {
  return (
    <div>
      <>
        <div>
          <ScrollToTop />
          <Route exact path="/sign-up" component={OnBoarding} />

          <Route exact path="/assign-task" component={AssignTask} />
          {/* <Route exact path="/" component={CapmTechLandingPage} /> */}

          <Route exact path="/" component={Home} />
          <Route exact path="/FAQ" component={FAQ} />
          {/* <Route
            exact
            path="/compliance-landing"
            component={ComplianceLanding}
          /> */}
          <Route exact path="/on-boarding" component={OnBoarding} />
          <Route exact path="/board-view" component={BoardView} />
          <Route exact path="/team-member" component={TeamMember} />
          <Route exact path="/compliance-demo" component={ComplianceDemo} />

          <Route
            exact
            path="/compliance-demo-end"
            component={ComplianceDemoEnd}
          />
          <Route exact path="/you-are-done" component={YouAreDone} />
          <Route exact path="/co-dashboard" component={CoDashboard} />
          <Route exact path="/personal-details" component={PersonalDetails} />
          <Route exact path="/company-details" component={CompanyDetails} />
          <Route exact path="/company-personal" component={CoPersonal} />
          <Route
            exact
            path="/email-verification-info-page"
            component={VerifyEmailErrorPage}
          />
          <Route
            exact
            path="/email-verification-confirmed"
            component={EmailVerifiedPage}
          />
          <Route
            exact
            path="/new-email-verification"
            component={NewEmailVerification}
          />
          <Route
            exact
            path="/team-member-personal-info"
            component={TeamMemberFlowPersonalDetails}
          />
          <Route
            exact
            path="/team-member-secure-verification"
            component={TeamMemberFlowOTP}
          />
          <Route
            exact
            path="/otpverification-co"
            component={OTPVerificationCO}
          />
          <Route exact path="/sign-up-request" component={SIGNUPPOP} />
          <Route exact path="/otp-verification-co" component={VerifyOTPCO} />
          <Route exact path="/dashboard-view" component={DashBoardView} />
          <Route exact path="/dashboard" component={DashBoardCO} />
          {isShowOtherComplianceModule && (
            <Route path="/other-compliance/" component={DashBoardCO} />
          )}
          <Route
            exact
            path="/personal-details-team-member"
            component={PersonalDetailsTM}
          />
          <Route exact path="/login" component={Login} />
          <Route exact path="/pricing" component={PricingPage} />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route exact path="/change-password" component={ChangePassword} />

          <Route exact path="/governance" component={Governance} />

          <Route exact path="/redirect-user-dashboard" component={YouAreDone} />
          <Route
            exact
            path="/redirect-dashboard"
            component={RedirectToDashboard}
          />

          <Route exact path="/notifications" component={DashBoardCO} />

          <Route exact path="/calendar-view" component={CalendarView} />
          <Route
            exact
            path="/user-details-verification"
            component={UserProfileVerifcation}
          />
          <Route
            exact
            path="/otp-verification"
            component={UserOTPVerifcation}
          />
          <Route
            exact
            path="/user-verification-process"
            component={UserVerificationProcess}
          />
          <Route
            exact
            path="/company-quick-overview"
            component={MultiCompanyQuickOverView}
          />
          <Route
            exact
            path="/team-member-quick-overView"
            component={MultiTeamMemberView}
          />
          <Route
            exact
            path="/risk-delay-tasklist"
            component={RiskAndDelaysTaskList}
          />
          <Route
            exact
            path="/pending-action-task-list"
            component={PendingAction}
          />
          <Route exact path="/compliance-history" component={DashBoardCO} />
          <Route path="/updates" component={DashBoardCO} />
          {isShowSmeModule && (
            <>
              <Route path="/smeApplication" component={DashBoardCO} />
              <Route exact path="/join-expert" component={ExpertSection} />
              <Route path="/detail-application/:id" component={DashBoardCO} />
              <Route exact path="/new-requirements" component={DashBoardCO} />
              <Route
                exact
                path="/sme-onBoarding-preview"
                component={SmeOnBoardingPreview}
              />
              <Route exact path="/sme-onBoarding" component={SmeOnBoarding} />
            </>
          )}

          {isShowProjectModule && (
            <Route path="/project-management" component={DashBoardCO} />
          )}
          <Route path="/project-trash" component={DashBoardCO} />
          <Route exact path="/help" component={DashBoardCO} />
          <Route path="/expert-review" component={ExperReview}></Route>
          <Route exact path="/thankyou" component={Thankyou} />
          <Route exact path="/settings" component={CoSetting} />

          <Route exact path="invoice" component={Invoice} />
          {/* <Route exact path='/events' component={DashBoardCO} /> */}
          <Route exact path="invoice" component={Invoice} />
          <Route path="/events" component={DashBoardCO} />
          {/* Audit Module */}
          {isShowAuditModule && (
            <>
              <Route path="/audit-assignment" component={AuditAssignment} />
              <Route path="/review-template" component={ReviewTemplate} />
              <Route path="/user-auditee" component={DashBoardCO} />
              <Route path="/audit" component={DashBoardCO} />
              <Route path="/sub-auditee" component={DashBoardCO} />
              <Route path="/auditor" component={DashBoardCO} />
              <Route path="/sub-Auditor" component={DashBoardCO} />
              <Route
                exact
                path="/submit-answer"
                component={QuestionnaireAnswer}
              />
              <Route
                exact
                path="/dashboard-auditee"
                component={DashBoardAuditor}
              />
              <Route
                exact
                path="/dashboard-auditee/:type"
                component={DashBoardAuditor}
              />
              <Route
                exact
                path="/dashboard-auditor"
                component={DashBoardAuditor}
              />
              <Route
                exact
                path="/dashboard-auditor/:type"
                component={DashBoardAuditor}
              />
              <Route
                exact
                path="/dashboard-subauditor"
                component={DashBoardAuditor}
              />
              <Route
                exact
                path="/dashboard-subauditor/:type"
                component={DashBoardAuditor}
              />
              <Route
                exact
                path="/dashboard-remark"
                component={DashBoardRemark}
              />
              <Route
                exact
                path="/submit-answer"
                component={QuestionnaireAnswer}
              />
            </>
          )}
          {/* <Route path="*" component={PageNotFound} /> */}
          {/* <Route exact path="/dashboard-new" component={Dashboard} /> */}
        </div>
      </>
    </div>
  );
}
