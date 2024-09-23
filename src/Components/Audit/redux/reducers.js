import { v4 as uuidv4 } from "uuid";
import {
  SET_SECTION_NAME,
  SET_TEMPLATE_ID,
  SET_AUDIT_ASSIGNMENT_BASIC_DETAILS,
  SET_ASSIGNMENT_ID,
  SET_AUDIT_ADDRESS_DETAILS,
  SET_AUDIT_QUASTIONARIE_DETAILS,
  SET_QUESTION_LIST,
  SET_COMPANY_DATA,
  SET_BRANCH_DATA,
  SET_DELETE_COMPANY,
  SET_DELETE_BRANCH,
  SET_EDIT_STATE,
  SET_ASSIGNMENT_DETAIL,
  ASSIGNMENT_GET_ASSIGNMENT_CHECKPOINTS,
  ASSIGNMENT_GET_ASSIGNMENT_LIST,
  ASSIGNMENT_GET_ASSIGNMENT_QUESTIONNARIE,
  ASSIGNMENT_SET_ASSIGNMENT_CHECKPOINTS,
  ASSIGNMENT_SET_ASSIGNMENT_LIST,
  ASSIGNMENT_SET_ASSIGNMENT_QUESTIONNARIE,
  MARK_AS_COMPLETE_MODAL_ISCLOSE,
  MARK_AS_COMPLETE_MODAL_ISOPEN,
  CLEAR_ASSIGNMNET_DETAIL,
  CLEAR_ASSIGNMENT_ID,
  SET_LONG_TEXT_POPUP,
} from "./types";
import { createUpdateAuditTemplateTypes } from "./createUpdateTemplatesActions";
import { auditTemplateTypes } from "./auditTemplateActions";
import { subAuditorModuleTypes } from "./subAuditorModuleActions";
import { submitAnswerModalTypes } from "./submitAnswersModalActions";

const initialState = {
  currentSectionId: "",
  questionList: [],
  templateId: "",
  auditAssignmentBasicDetails: [],
  assignmentId: "",
  auditAddressDetails: [],
  auditQuastionarieDetails: [],
  auditCategoriesList: [],
  CreateUpdateAuditTemplate: {
    isLoading: false,
    auditScopeBasicDetails: {
      circularFilesList: [],
      attachmentsList: [],
      faqsList: [{ audit_question: "", audit_answer: "" }],
      basicDetails: {
        audit_template_id: "",
        audit_template_name: "",
        audit_category: "",
        buffer_period: "",
        audit_description: "",
        duration_of_completion: "",
      },
    },
    questionnarieDetails: [
      {
        id: uuidv4(),
        sectionName: "",
        completionDuration: "",
        bufferPeriod: "0",
        questionSectionId: "",
        questionnaireSection: "",
        inputs: [
          // {
          //   id: uuidv4(),
          //   reference_document: "",
          //   questionnaire_section: "",
          //   question_section_id: "",
          //   question: "",
          //   question_id: "",
          //   attachement_details: "",
          //   answer_option: "",
          //   field_type: "text-field",
          //   attachment_type: "",
          //   start_date: "",
          //   end_date: "",
          //   error: {
          //     isError: false,
          //     type: "",
          //     message: "",
          //   },
          // },
        ],
      },
    ],
    checklistDetails: [
      {
        id: uuidv4(),
        sectionName: "",
        completionDuration: "",
        bufferPeriod: "0",
        isError: false,
        questionSectionId: "",
        questionnaireSection: "",
        checkListInput: [
          // {
          //   areaForVerfication: "",
          //   documentReliedUpon: "",
          //   regulatoryRef: "",
          //   checklist_section: "",
          //   checklist_section_id: "",
          //   check_point_id: "",
          //   consequenceOfNonCompliance: "",
          //   severity: "",
          //   regulatoryDescription: "",
          //   start_date: "",
          //   end_date: "",
          //   attachment_format: "",
          //   id: uuidv4(),
          //   how_to_verify: "",
          //   penalty: "",
          //   error: {
          //     isError: false,
          //     type: "",
          //     message: "",
          //   },
          // },
        ],
      },
    ],
    reviewDetails: {
      scopeDetails: {},
      questionnarieDetails: [],
      checklistDetails: [],
    },
    stepperState: {
      stepperAcitveSlide: 1,
      stepperCompletedSlides: [],
    },
  },
  AuditTemplateData: {
    isLoading: false,
    templates: {
      standard: [],
      custom: [],
    },
    questionnarie: [],
    checklist: [],
  },
  CompanyData: [],
  BranchData: [],
  deleteCompany: false,
  deleteBranch: false,
  editState: false,
  assignmentDetail: {},
  subAuditorModule: {
    assignmentList: [],
    isLoading: [],
    assignmentQuestionnarie: [],
    assignmentChecklist: [],
    currentStatusTab: "all",
  },
  assignmentData: {
    currentAssignmentId: "",
    currentTab: "",
    assignmentList: [],
    checklist: [],
    questionnarie: [],
    isLoading: false,
  },
  submitAnswerModalStatus: {
    questionId: "",
    assignmentId: "",
    templateId: "",
    fieldType: "",
    question: "",
    answer_option: "",
    isLoading: false,
    isOpen: false,
    isError: false,
    isSuccess: false,
    evalString: "",
    answer: "",
    selectedAnswers: [],
    compliedState:{
      isComplied: false,
      status: "",
    }
  },
  markAsCompleteModal: {
    isOpen: false,
    status: "",
    questionId: "",
    assignmentId: "",
    question: "",
    section: "",
    heading: "",
    isSuccess: false,
  },
  longTextPopupModal: {
    isOpen: false,
    data: "",
    heading: "",
  },
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_SECTION_NAME:
      return { ...state, sectionName: payload.sectionName };
    case SET_TEMPLATE_ID:
      return { ...state, templateId: payload };

    case SET_QUESTION_LIST:
      return { ...state, questionList: payload.questionList };

    case SET_AUDIT_ASSIGNMENT_BASIC_DETAILS:
      return { ...state, auditAssignment: payload };

    case SET_ASSIGNMENT_ID:
      return { ...state, assignmentId: payload };
    case CLEAR_ASSIGNMENT_ID:
      return { ...state, assignmentId: "" };
    case SET_AUDIT_ADDRESS_DETAILS:
      return { ...state, auditAddressDetails: payload };
    case SET_AUDIT_QUASTIONARIE_DETAILS:
      return { ...state, auditQuastionarieDetails: payload };
    case createUpdateAuditTemplateTypes.SET_STEPPER:
      return {
        ...state,
        CreateUpdateAuditTemplate: {
          ...state?.CreateUpdateAuditTemplate,
          stepperState: {
            ...state?.CreateUpdateAuditTemplate.stepperState,
            ...payload,
          },
        },
      };
    case createUpdateAuditTemplateTypes.SET_LOADING:
      return {
        ...state,
        CreateUpdateAuditTemplate: {
          ...state?.CreateUpdateAuditTemplate,
          isLoading: payload,
        },
      };
    case createUpdateAuditTemplateTypes.SET_AUDIT_CATEGORIES_LIST:
      return {
        ...state,
        auditCategoriesList: [...payload],
      };
    case createUpdateAuditTemplateTypes.SET_AUDIT_SCOPE_BASIC_DETAILS:
      return {
        ...state,
        CreateUpdateAuditTemplate: {
          ...state?.CreateUpdateAuditTemplate,
          auditScopeBasicDetails: {
            ...state?.CreateUpdateAuditTemplate?.auditScopeBasicDetails,
            ...payload,
          },
        },
      };
    case createUpdateAuditTemplateTypes.SET_QUESTIONNARIE_DETAILS:
      return {
        ...state,
        CreateUpdateAuditTemplate: {
          ...state?.CreateUpdateAuditTemplate,
          questionnarieDetails: [...payload],
        },
      };
    case createUpdateAuditTemplateTypes.CLEAR_QUESTIONNARIE_DETAILS:
      return {
        ...state,
        CreateUpdateAuditTemplate: {
          ...state?.CreateUpdateAuditTemplate,
          questionnarieDetails: [
            {
              id: uuidv4(),
              sectionName: "",
              completionDuration: "",
              bufferPeriod: "0",
              questionSectionId: "",
              questionnaireSection: "",
              inputs: [
                //   {
                //     id: uuidv4(),
                //     reference_document: "",
                //     questionnaire_section: "",
                //     question_section_id: "",
                //     question: "",
                //     question_id: "",
                //     attachement_details: "",
                //     answer_option: "",
                //     field_type: "text-field",
                //     attachment_type: "",
                //     start_date: "",
                //     end_date: "",
                //     error: {
                //       isError: false,
                //       type: "",
                //       message: "",
                //     },
                //   },
              ],
            },
          ],
        },
      };
    case createUpdateAuditTemplateTypes.SET_CHECKLIST_DETAILS:
      return {
        ...state,
        CreateUpdateAuditTemplate: {
          ...state?.CreateUpdateAuditTemplate,
          checklistDetails: [...payload],
        },
      };
    case createUpdateAuditTemplateTypes.CLEAR_CHECKLIST_DETAILS:
      return {
        ...state,
        CreateUpdateAuditTemplate: {
          ...state?.CreateUpdateAuditTemplate,
          checklistDetails: [
            {
              id: uuidv4(),
              sectionName: "",
              completionDuration: "",
              bufferPeriod: "0",
              isError: false,
              questionSectionId: "",
              questionnaireSection: "",
              checkListInput: [
                // {
                //   areaForVerfication: "",
                //   documentReliedUpon: "",
                //   regulatoryRef: "",
                //   checklist_section: "",
                //   checklist_section_id: "",
                //   check_point_id: "",
                //   consequenceOfNonCompliance: "",
                //   severity: "",
                //   regulatoryDescription: "",
                //   start_date: "",
                //   end_date: "",
                //   attachment_format: "",
                //   id: uuidv4(),
                //   how_to_verify: "",
                //   penalty: "",
                //   error: {
                //     isError: false,
                //     type: "",
                //     message: "",
                //   },
                // },
              ],
            },
          ],
        },
      };
    case createUpdateAuditTemplateTypes.CLEAR_ALL_STATE:
      return {
        ...state,
        templateId: "",
        auditAddressDetails: [],
        CreateUpdateAuditTemplate: {
          isLoading: false,
          auditScopeBasicDetails: {
            circularFilesList: [],
            attachmentsList: [],
            faqsList: [{ audit_question: "", audit_answer: "" }],
            basicDetails: {
              audit_template_id: "",
              audit_template_name: "",
              audit_category: "",
              buffer_period: "",
              audit_description: "",
              duration_of_completion: "",
            },
          },
          questionnarieDetails: [
            {
              id: uuidv4(),
              sectionName: "",
              completionDuration: "",
              bufferPeriod: "0",
              questionSectionId: "",
              questionnaireSection: "",
              inputs: [
                //   {
                //     id: uuidv4(),
                //     reference_document: "",
                //     questionnaire_section: "",
                //     question_section_id: "",
                //     question: "",
                //     question_id: "",
                //     attachement_details: "",
                //     answer_option: "",
                //     field_type: "text-field",
                //     attachment_type: "",
                //     start_date: "",
                //     end_date: "",
                //     error: {
                //       isError: false,
                //       type: "",
                //       message: "",
                //     },
                //   },
              ],
            },
          ],
          checklistDetails: [
            {
              id: uuidv4(),
              sectionName: "",
              completionDuration: "",
              bufferPeriod: "0",
              isError: false,
              questionSectionId: "",
              questionnaireSection: "",
              checkListInput: [
                // {
                //   areaForVerfication: "",
                //   documentReliedUpon: "",
                //   regulatoryRef: "",
                //   checklist_section: "",
                //   checklist_section_id: "",
                //   check_point_id: "",
                //   consequenceOfNonCompliance: "",
                //   severity: "",
                //   regulatoryDescription: "",
                //   start_date: "",
                //   end_date: "",
                //   attachment_format: "",
                //   how_to_verify: "",
                //   penalty: "",
                //   id: uuidv4(),
                //   error: {
                //     isError: false,
                //     type: "",
                //     message: "",
                //   },
                // },
              ],
            },
          ],
          reviewDetails: {
            scopeDetails: {},
            questionnarieDetails: [],
            checklistDetails: [],
          },
          stepperState: {
            stepperAcitveSlide: 1,
            stepperCompletedSlides: [],
          },
        },
      };

    case auditTemplateTypes.SET_AUDIT_TEMPLATES_LIST:
      return {
        ...state,
        AuditTemplateData: {
          ...state.AuditTemplateData,
          isLoading: false,
          templates: {
            ...state?.AuditTemplateData?.templates,
            ...payload,
          },
        },
      };
    case auditTemplateTypes.GET_AUDIT_TEMPLATES_LIST:
      return {
        ...state,
        AuditTemplateData: {
          ...state.AuditTemplateData,
          isLoading: true,
          templates: {
            ...state?.AuditTemplateData?.templates,
          },
        },
      };
    case auditTemplateTypes.DELETE_AUDIT_TEMPLATE:
      return {
        ...state,
        AuditTemplateData: {
          ...state.AuditTemplateData,
          isLoading: true,
          templates: {
            ...state?.AuditTemplateData?.templates,
          },
        },
      };

    case auditTemplateTypes.SET_TEMPLATE_CHECKPOINTS_LIST:
      return {
        ...state,
        AuditTemplateData: {
          ...state.AuditTemplateData,
          checklist: [...payload],
        },
      };
    case auditTemplateTypes.CLEAR_TEMPLATE_CHECKPOINTS_LIST:
      return {
        ...state,
        AuditTemplateData: {
          ...state.AuditTemplateData,
          checklist: [],
        },
      };
    case auditTemplateTypes.SET_TEMPLATE_QUESTIONNARIE_LIST:
      return {
        ...state,
        AuditTemplateData: {
          ...state.AuditTemplateData,
          questionnarie: [...payload],
        },
      };
    case auditTemplateTypes.CLEAR_TEMPLATE_QUESTIONNARIE_LIST:
      return {
        ...state,
        AuditTemplateData: {
          ...state.AuditTemplateData,
          questionnarie: [],
        },
      };

    case SET_COMPANY_DATA:
      return { ...state, CompanyData: payload };
    case SET_BRANCH_DATA:
      return { ...state, BranchData: payload };

    case SET_DELETE_COMPANY:
      return { ...state, deleteCompany: payload };

    case SET_DELETE_BRANCH:
      return { ...state, deleteBranch: payload };
    case SET_EDIT_STATE:
      return { ...state, editState: payload };

    case SET_ASSIGNMENT_DETAIL:
      return { ...state, assignmentDetail: payload };
    case CLEAR_ASSIGNMNET_DETAIL:
      return { ...state, assignmentDetail: {} };
    case subAuditorModuleTypes.FETCH_ASSIGNMENT_LIST:
      return {
        ...state,
        subAuditorModule: {
          ...state.subAuditorModule,
          isLoading: true,
        },
      };
    case subAuditorModuleTypes.SET_ASSIGNMENT_LIST:
      return {
        ...state,
        subAuditorModule: {
          ...state?.subAuditorModule,
          isLoading: false,
          assignmentList: payload,
        },
      };
    case subAuditorModuleTypes.FETCH_ASSIGNMENT_QUESTIONNARIE:
      return {
        ...state,
        subAuditorModule: {
          ...state.subAuditorModule,
          isLoading: true,
        },
      };
    case subAuditorModuleTypes.SET_ASSIGNMENT_QUESTIONNARIE:
      return {
        ...state,
        subAuditorModule: {
          ...state.subAuditorModule,
          assignmentQuestionnarie: payload,
        },
      };
    case subAuditorModuleTypes.FETCH_ASSIGNMENT_CHECKLIST:
      return {
        ...state,
        subAuditorModule: {
          ...state.subAuditorModule,
          isLoading: true,
        },
      };
    case subAuditorModuleTypes.SET_ASSIGNMENT_CHECKLIST:
      return {
        ...state,
        subAuditorModule: {
          ...state.subAuditorModule,
          assignmentChecklist: payload,
        },
      };
    case subAuditorModuleTypes.SET_STATUS_TAB:
      return {
        ...state,
        subAuditorModule: {
          ...state?.subAuditorModule,
          currentStatusTab: payload,
        },
      };

    case ASSIGNMENT_GET_ASSIGNMENT_LIST:
      return {
        ...state,
        assignmentData: {
          ...state?.assignmentData,
          isLoading: true,
        },
      };
    case ASSIGNMENT_GET_ASSIGNMENT_QUESTIONNARIE:
      return {
        ...state,
        assignmentData: {
          ...state?.assignmentData,
          isLoading: true,
          currentAssignmentId: payload,
          currentTab: "questionnarie",
        },
      };
    case ASSIGNMENT_GET_ASSIGNMENT_CHECKPOINTS:
      return {
        ...state,
        assignmentData: {
          ...state?.assignmentData,
          isLoading: true,
          currentAssignmentId: payload,
          currentTab: "checkpoints",
        },
      };
    case ASSIGNMENT_SET_ASSIGNMENT_LIST:
      return {
        ...state,
        assignmentData: {
          ...state?.assignmentData,
          isLoading: false,
          assignmentList: payload,
        },
      };
    case ASSIGNMENT_SET_ASSIGNMENT_QUESTIONNARIE:
      return {
        ...state,
        assignmentData: {
          ...state?.assignmentData,
          isLoading: false,
          questionnarie: payload,
        },
      };
    case ASSIGNMENT_SET_ASSIGNMENT_CHECKPOINTS:
      return {
        ...state,
        assignmentData: {
          ...state?.assignmentData,
          isLoading: false,
          checklist: payload,
        },
      };
    case submitAnswerModalTypes.OPEN_MODAL:
      return {
        ...state,
        submitAnswerModalStatus: {
          ...state?.submitAnswerModalStatus,
          ...payload,
        },
      };
    case submitAnswerModalTypes.CLOSE_MODAL:
      return {
        ...state,
        submitAnswerModalStatus: {
          questionId: "",
          assignmentId: "",
          templateId: "",
          fieldType: "",
          question: "",
          answer_option: "",
          isLoading: false,
          isOpen: false,
          isError: false,
          isSuccess: false,
          answer: "",
          evalString: "",
          selectedAnswers: [],
          compliedState:{
            isComplied: false,
            status: "",
          }
        },
      };
    case submitAnswerModalTypes.SUBMIT_DATA_REQUEST:
      return {
        ...state,
        submitAnswerModalStatus: {
          ...state?.submitAnswerModalStatus,
          isLoading: true,
          isSuccess: false,
          isError: false,
        },
      };
    case submitAnswerModalTypes.SUBMIT_DATA_SUCCESS:
      return {
        ...state,
        submitAnswerModalStatus: {
          ...state?.submitAnswerModalStatus,
          isLoading: false,
          isSuccess: true,
          isError: false,
        },
      };
    case submitAnswerModalTypes.SUBMIT_DATA_FAILED:
      return {
        ...state,
        submitAnswerModalStatus: {
          ...state?.submitAnswerModalStatus,
          isLoading: false,
          isError: true,
          isSuccess: false,
        },
      };
    case submitAnswerModalTypes.GET_SUBMITED_ANSWER:
      return {
        ...state,
        submitAnswerModalStatus: {
          ...state?.submitAnswerModalStatus,
          isLoading: true,
          isError: false,
          isSuccess: false,
        },
      };
    case submitAnswerModalTypes.SET_SUBMITED_ANSWER:
      return {
        ...state,
        submitAnswerModalStatus: {
          ...state?.submitAnswerModalStatus,
          ...payload,
        },
      };
    case submitAnswerModalTypes.SET_ANSWRS_INPUT:
      return {
        ...state,
        submitAnswerModalStatus: {
          ...state?.submitAnswerModalStatus,
          ...payload,
        },
      };
    case MARK_AS_COMPLETE_MODAL_ISOPEN:
      return {
        ...state,
        markAsCompleteModal: {
          ...state.markAsCompleteModal,
          ...payload,
        },
      };
    case MARK_AS_COMPLETE_MODAL_ISCLOSE:
      return {
        ...state,
        markAsCompleteModal: {
          ...state.markAsCompleteModal,
          isOpen: false,
          status: "",
          questionId: "",
          assignmentId: "",
          question: "",
          section: "",
          heading: "",
          isSuccess: true,
        },
      };
    case SET_LONG_TEXT_POPUP:
      return {
        ...state,
        longTextPopupModal: {
          ...state.longTextPopupModal,
          isOpen: payload?.isOpen || false,
          data: payload?.data || "",
          heading: payload?.heading || "",
        },
      };
    default:
      return state;
  }
};

export default reducer;
