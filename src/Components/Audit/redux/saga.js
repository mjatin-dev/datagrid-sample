import { toast } from "react-toastify";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { v4 as uuidv4 } from "uuid";

import api from "../../../CommonModules/GlobalData/api";
import {
  setAssignmentCheckpoints,
  setAssignmentList,
  setAssignmentQuestionnarie,
  setQuestionList,
  setTemplateId,
  setMarkAsCompleteData,
  setMarkAsCompleteModalClose
} from "./actions";
import {
  ADD_NEW_SECTION,
  ASSIGNMENT_GET_ASSIGNMENT_CHECKPOINTS,
  ASSIGNMENT_GET_ASSIGNMENT_LIST,
  ASSIGNMENT_GET_ASSIGNMENT_QUESTIONNARIE,
  GET_QUESTION_LIST,
  MARK_AS_COMPLETE_SET_DATA,
  MARK_AS_COMPLETE_MODAL_ISCLOSE
} from "./types";
import auditApis from "../api/index";
import {
  createUpdateAuditTemplateActions,
  createUpdateAuditTemplateTypes,
} from "./createUpdateTemplatesActions";
import {
  auditTemplateActions,
  auditTemplateTypes,
} from "./auditTemplateActions";
import {
  subAuditorModuleActions,
  subAuditorModuleTypes,
} from "./subAuditorModuleActions";
import {
  submitAnswerModalActions,
  submitAnswerModalTypes,
} from "./submitAnswersModalActions";
import { assignIn } from "lodash";

function* addSection(action) {
  try {
    const { data } = yield call(api.addSection, action.payload);
    if (data.message.status) {
    } else {
    }
  } catch (error) {}
}

function* getQuestionList(action) {
  try {
    const { data } = yield call(api.getQuestionList, action.payload);
    if (
      data.message.status &&
      data.message?.Question_reference_options?.length > 0
    ) {
      yield put(
        setQuestionList({
          questionList: data.message.Question_reference_options,
        })
      );
    } else {
    }
  } catch (error) {}
}
function* getAuditCategoriesList() {
  try {
    const { data, status } = yield call(auditApis.fetchAuditCategoriesList);
    if (status === 200 && data && data?.message?.status) {
      let categoriesList = data?.message?.audit_catagory_list || [];
      categoriesList =
        [...categoriesList]?.map((element) => ({
          value: element,
          label: element,
        })) || [];

      yield put(
        createUpdateAuditTemplateActions.setAuditCategoriesList(categoriesList)
      );
    } else {
      toast.error(
        data?.message?.status_response || "Unable to fetch Audit Categories."
      );
    }
  } catch (error) {
    toast.error("Something went wrong");
  }
}

function* getAuditTemplateDetails({ payload }) {
  try {
    yield put(createUpdateAuditTemplateActions.setLoading(true));
    const { data, status } = yield call(
      auditApis.fetchAuditTempateDetails,
      payload
    );
    if (status === 200 && data?.message?.status) {
      const details = data?.message?.data;
      const {
        audit_category,
        audit_description,
        audit_template_name,
        buffer_period,
        duration_of_completion,
        file,
        reference_files,
        frequently_asked_question,
      } = details;

      yield put(
        createUpdateAuditTemplateActions.setAuditScopeBasicDetails({
          ...data,
          basicDetails: {
            audit_template_id: payload,
            audit_category,
            audit_description,
            audit_template_name,
            buffer_period: String(buffer_period || 0),
            duration_of_completion,
          },
          circularFilesList: file || [],
          attachmentsList: reference_files || [],
          faqsList:
            frequently_asked_question?.length > 0
              ? frequently_asked_question
              : [{ audit_question: "", audit_answer: "" }],
        })
      );
      yield put(createUpdateAuditTemplateActions.setLoading(false));
    } else {
      toast.error(
        data?.message?.status_response ||
          "Unable to fetch Audit Template Details"
      );
      yield put(createUpdateAuditTemplateActions.setLoading(false));
    }
  } catch (error) {
    toast.error("Something went wrong");
    yield put(createUpdateAuditTemplateActions.setLoading(false));
  }
}

function* postAuditScopeBasicDetailsFiles({ payload }) {
  try {
    yield put(createUpdateAuditTemplateActions.setLoading(true));
    const { data, status } = yield call(auditApis.updateAuditTemplate, payload);
    if (status === 200 && data?.message?.status) {
      const { audit_template_id } = data?.message;
      const id = audit_template_id || payload?.get("audit_template_id");
      yield put(
        createUpdateAuditTemplateActions.getAuditScopeBasicDetails(
          audit_template_id || payload?.get("audit_template_id")
        )
      );
      yield put(setTemplateId(id));
      toast.success("File uploaded successfully.");
      yield put(createUpdateAuditTemplateActions.setLoading(false));
    } else {
      toast.error(data?.message?.status_response || "Something went wrong.");
      yield put(createUpdateAuditTemplateActions.setLoading(false));
    }
  } catch (error) {
    yield put(createUpdateAuditTemplateActions.setLoading(false));
    toast.error("Unable to upload file.");
  }
}

function* deleteAuditScopeBasicDetailsFile({ payload }) {
  try {
    yield put(createUpdateAuditTemplateActions.setLoading(true));
    const { data, status } = yield call(
      auditApis.deleteAuditScopeBasicDetailsFile,
      { file_id: payload.file_id }
    );
    if (status === 200 && data?.message?.status) {
      yield put(
        createUpdateAuditTemplateActions.getAuditScopeBasicDetails(
          payload.audit_template_id
        )
      );
      toast.success("File successfully deleted.");
      yield put(createUpdateAuditTemplateActions.setLoading(false));
    } else {
      yield put(createUpdateAuditTemplateActions.setLoading(false));
      toast.error(data?.message?.status_response);
    }
  } catch (error) {
    yield put(createUpdateAuditTemplateActions.setLoading(false));
    toast.error("Unable to delete file.");
  }
}

function* postAuditScopeBasicDetails({ payload }) {
  const { type, formData } = payload;
  const stepper = yield select(
    (state) => state?.AuditReducer?.CreateUpdateAuditTemplate?.stepperState
  );
  const step = stepper.stepperAcitveSlide;
  try {
    yield put(createUpdateAuditTemplateActions.setLoading(true));
    const { data, status } = yield call(
      auditApis.updateAuditTemplate,
      formData
    );
    if (status === 200 && data?.message?.status) {
      const template_name = formData?.get("audit_template_name");
      toast.success(`${template_name || "Template"} saved successfully.`);
      const id = data?.message?.audit_template_id;
      yield put(setTemplateId(formData.get("audit_template_id") || id));
      if (type === "next") {
        yield put(
          createUpdateAuditTemplateActions.setStepper({
            ...stepper,
            stepperAcitveSlide: step + 1,
            stepperCompletedSlides: [...stepper.stepperCompletedSlides, step],
          })
        );
      }
      yield put(createUpdateAuditTemplateActions.setLoading(false));
    } else {
      toast.error(data?.message?.status_response || "Something went wrong!");
      yield put(createUpdateAuditTemplateActions.setLoading(false));
    }
  } catch (error) {
    toast.error("Unable to save details.");
    yield put(createUpdateAuditTemplateActions.setLoading(false));
  }
}

function* getAuditTemplatesList({ payload }) {
  try {
    const { data, status } = yield call(auditApis.fetchAuditTemplateDashboard);
    if (status === 200 && data?.message?.status) {
      let templateList = data?.message?.data || [];
      templateList = templateList.map((template) => ({
        ID: uuidv4(),
        ...template,
      }));
      const custom = [...templateList]?.filter(
        (template) => template.is_standard === 0
      );
      const standard = [...templateList]?.filter(
        (template) => template.is_standard === 1
      );

      yield put(
        auditTemplateActions.setAuditTemplatesList({
          custom,
          standard,
        })
      );
    } else {
      toast.error(data?.message?.status_response || "Something went wrong");
      yield put(auditTemplateActions.setAuditTemplatesList({}));
    }
  } catch (error) {
    toast.error("Unable to fetch Audit Templates.");
    yield put(auditTemplateActions.setAuditTemplatesList({}));
  }
}

function* getAuditCheckpointsList({ payload }) {
  try {
    const { data, status } = yield call(
      auditApis.fetchChecklistFromTemplate,
      payload
    );
    if (status === 200 && data?.message?.status) {
      let { check_list } = data?.message;
      check_list = [...check_list].map((element) => ({
        ID: uuidv4(),
        ...element,
      }));
      yield put(
        auditTemplateActions.setAuditTemplatesCheckpointList(check_list || [])
      );
    } else {
      toast.error(data?.message?.status_response);
      yield put(auditTemplateActions.setAuditTemplatesCheckpointList([]));
    }
  } catch (error) {
    yield put(auditTemplateActions.setAuditTemplatesCheckpointList([]));
    toast.error("Something went wrong!");
  }
}
function* getAuditQuestionnarieList({ payload }) {
  try {
    const { data, status } = yield call(
      auditApis.fetchQuestionsFromTemplate,
      payload
    );
    if (status === 200 && data?.message?.status) {
      let { question_list } = data?.message;
      question_list = [...question_list].map((element) => ({
        ID: uuidv4(),
        ...element,
      }));
      yield put(
        auditTemplateActions.setAuditTemplatesQuestionnarieList(
          question_list || []
        )
      );
    } else {
      toast.error(
        data?.message?.status_response || "Unable to fetch questionnarie list"
      );
      yield put(auditTemplateActions.setAuditTemplatesQuestionnarieList([]));
    }
  } catch (error) {
    yield put(auditTemplateActions.setAuditTemplatesQuestionnarieList([]));

    toast.error("Something went wrong!");
  }
}

function* deleteAuditTemplate({ payload }) {
  const customTemplateList = yield select(
    (state) => state?.AuditReducer?.AuditTemplateData?.templates?.custom
  );
  try {
    const { data, status } = yield call(auditApis.deleteAuditTemplate, payload);
    if (data && status === 200 && data?.message?.status) {
      yield put(
        auditTemplateActions.setAuditTemplatesList({
          custom: [...customTemplateList].filter(
            (element) => element.audit_template_id !== payload
          ),
        })
      );
      toast.success(`Template successfully moved to trash.`);
    } else {
      const status_response = data?.message?.status_response;
      toast.error(status_response);
    }
  } catch (error) {
    toast.error("Something went wrong!");
  }
}

function* fetchAssignmentList({ payload }) {
  try {
    const { data, status } = yield call(auditApis.fetchAssignmentList, payload);
    if (status === 200 && data && data?.message?.status) {
      let list = data?.message?.data || [];
      list = list.map((element) => ({ ID: uuidv4(), ...element }));
      yield put(subAuditorModuleActions.setAssignmentList(list));
    } else {
      toast.error(data?.message?.status_response || "Something went wrong!");
      yield put(subAuditorModuleActions.setAssignmentList([]));
    }
  } catch (error) {
    toast.error("Something went wrong!");
    yield put(subAuditorModuleActions.setAssignmentList([]));
  }
}

function* fetchAssignmentQuestionnarie({ payload }) {
  try {
    const statusTab = yield select(
      (state) => state?.AuditReducer?.subAuditorModule?.currentStatusTab
    );
    const { data, status } = yield call(
      auditApis.fetchAssignmentQuestionnarie,
      {
        status: statusTab,
        assignment_id: payload,
      }
    );
    if (status === 200 && data && data?.message?.status) {
      let list = data?.message?.data || [];
      list = list.map((element) => ({ ID: uuidv4(), ...element }));
      yield put(subAuditorModuleActions.setAssignmentQuestionnarie(list));
    } else {
      toast.error(data?.message?.status_response || "Something went wrong!");
      yield put(subAuditorModuleActions.setAssignmentQuestionnarie([]));
    }
  } catch (error) {
    toast.error("Something went wrong!");
    yield put(subAuditorModuleActions.setAssignmentQuestionnarie([]));
  }
}
function* fetchAssignmentChecklist({ payload }) {
  try {
    const statusTab = yield select(
      (state) => state?.AuditReducer?.subAuditorModule?.currentStatusTab
    );
    const { data, status } = yield call(auditApis.fetchAssignmentChecklist, {
      status: statusTab,
      assignment_id: payload,
    });
    if (status === 200 && data && data?.message?.status) {
      let list = data?.message?.data || [];
      list = list.map((element) => ({ ID: uuidv4(), ...element }));
      yield put(subAuditorModuleActions.setAssignmentChecklist(list));
    } else {
      toast.error(data?.message?.status_response || "Something went wrong!");
      yield put(subAuditorModuleActions.setAssignmentChecklist([]));
    }
  } catch (error) {
    toast.error("Something went wrong!");
    yield put(subAuditorModuleActions.setAssignmentChecklist([]));
  }
}

function* getAssignmentChecklist({ payload }) {
  try {
    const { data, status } = yield call(
      auditApis.getChecklistFromAssignment,
      payload
    );
    if (status === 200 && data?.message?.status) {
      let questionnaireList = [...(data?.message?.question_list || [])];
      questionnaireList = [...questionnaireList].map((element) => ({
        ID: uuidv4(),
        ...element,
      }));
      yield put(setAssignmentCheckpoints([...questionnaireList]));
    } else {
      toast.error(data?.message?.status_response);
    }
  } catch (error) {
    toast.error("Something went wrong");
  }
}
function* fetchAssignmentQuestionnarieFromAssignment({ payload }) {
  try {
    const { data, status } = yield call(
      auditApis.getQuestionnarieFromAssignment,
      payload
    );
    if (status === 200 && data?.message?.status) {
      let questionnaireList = [...(data?.message?.question_list || [])];
      questionnaireList = [...questionnaireList].map((element) => ({
        ID: uuidv4(),
        ...element,
      }));

      yield put(setAssignmentQuestionnarie([...questionnaireList]));
    } else {
      toast.error(data?.message?.status_response);
    }
  } catch (error) {
    toast.error("Something went wrong");
  }
}
function* getAssignments({ payload }) {
  try {
    const { data, status } = yield call(auditApis.getAssignments);
    if (status === 200 && data?.message?.status) {
      let assignmentList = [...(data?.message?.data || [])];
      assignmentList = [...assignmentList].map((element) => ({
        ID: uuidv4(),
        ...element,
      }));
      yield put(setAssignmentList([...assignmentList]));
    } else {
      toast.error(data?.message?.status_response);
    }
  } catch (error) {
    toast.error("Something went wrong");
  }
}

function* submitQuestionnarieAnswer({ payload }) {
  const { evalString, assignmentId } = yield select(
    (state) => state?.AuditReducer?.submitAnswerModalStatus
  );
  try {
    const { data, status } = yield call(
      auditApis.addDocsInQuestionnarie,
      payload
    );
    if (status === 200 && data && data?.message?.status) {
      yield put(submitAnswerModalActions.submitDataSuccess());
      yield put(submitAnswerModalActions.closeModal());
      if (evalString && assignIn) {
        yield put(evalString(assignmentId));
      }
      toast.success(data?.message?.status_response);
    } else {
      yield put(submitAnswerModalActions.submitDataFailed());
      toast.error(data?.message?.status_response);
    }
  } catch (error) {
    yield put(submitAnswerModalActions.submitDataFailed());
    toast.error(error.message || "Something went wrong!");
  }
}

function* fetchSubmitedAnswers({ payload }) {
  try {
    const { data, status } = yield call(
      auditApis.getQuestionnarieAnswer,
      payload
    );
    if (status === 200 && data?.message?.status) {
      const { answer_text, answer_option } =
        data?.message?.question_list[0] || {};
      yield put(
        submitAnswerModalActions.setSubmitedAnswer({
          answer: answer_text,
          selectedAnswers: answer_option,
          isLoading: false,
          isError: false,
          isSuccess: true,
        })
      );
    } else {
      toast.error(data?.message?.status_response || "Something went wrong!");
      yield put(
        submitAnswerModalActions.setSubmitedAnswer({
          answer: "",
          selectedAnswers: [],
          isLoading: false,
          isError: true,
          isSuccess: false,
        })
      );
    }
  } catch (error) {
    toast.error("Something went wrong!");
    yield put(
      submitAnswerModalActions.setSubmitedAnswer({
        answer: "",
        selectedAnswers: [],
        isLoading: false,
        isError: true,
        isSuccess: false,
      })
    );
  }
}

function* submitMarkAsComplete({ payload }) {
  const { isSuccess } = yield select(
    (state) => state?.AuditReducer?.markAsCompleteModal
  );
  try {
    const { data, status } = yield call(
      auditApis.markAsComplete,
      payload
    );
    if (status === 200 && data && data?.message?.status) {
      yield put(setMarkAsCompleteModalClose({
        isOpen: false,
        status: "",
        questionId: "",
        assignmentId: "",
        question: "",
        section: "",
        heading: "",
        isSuccess:true
      }))
      toast.success(data?.message?.status_response);
    } else {
      toast.error(data?.message?.status_response);
      yield put(setMarkAsCompleteModalClose({
        isOpen: false,
        status: "",
        questionId: "",
        assignmentId: "",
        question: "",
        section: "",
        heading: "",
        isSuccess:false
      }))
    }
  } catch (error) {
    toast.error(error.message || "Something went wrong!");
  }
}


function* auditSaga() {
  yield takeLatest(ADD_NEW_SECTION, addSection);
  yield takeLatest(GET_QUESTION_LIST, getQuestionList);
  yield takeLatest(
    createUpdateAuditTemplateTypes.GET_AUDIT_CATEGORIES_LIST,
    getAuditCategoriesList
  );
  yield takeLatest(
    createUpdateAuditTemplateTypes.GET_AUDIT_SCOPE_BASIC_DETAILS,
    getAuditTemplateDetails
  );
  yield takeLatest(
    createUpdateAuditTemplateTypes.POST_AUDIT_SCOPE_BASIC_DETAILS_FILES,
    postAuditScopeBasicDetailsFiles
  );
  yield takeLatest(
    createUpdateAuditTemplateTypes.DELETE_AUDIT_SCOPE_BASIC_DETAILS_FILES,
    deleteAuditScopeBasicDetailsFile
  );
  yield takeLatest(
    createUpdateAuditTemplateTypes.POST_AUDIT_SCOPE_BASIC_DETAILS,
    postAuditScopeBasicDetails
  );
  yield takeLatest(
    auditTemplateTypes.GET_AUDIT_TEMPLATES_LIST,
    getAuditTemplatesList
  );
  yield takeLatest(
    auditTemplateTypes.GET_TEMPLATE_QUESTIONNARIE_LIST,
    getAuditQuestionnarieList
  );
  yield takeLatest(
    auditTemplateTypes.GET_TEMPLATE_CHECKPOINTS_LIST,
    getAuditCheckpointsList
  );
  yield takeLatest(
    auditTemplateTypes.DELETE_AUDIT_TEMPLATE,
    deleteAuditTemplate
  );
  yield takeLatest(
    subAuditorModuleTypes.FETCH_ASSIGNMENT_LIST,
    fetchAssignmentList
  );
  yield takeLatest(
    subAuditorModuleTypes.FETCH_ASSIGNMENT_QUESTIONNARIE,
    fetchAssignmentQuestionnarie
  );
  yield takeLatest(
    subAuditorModuleTypes.FETCH_ASSIGNMENT_CHECKLIST,
    fetchAssignmentChecklist
  );
  yield takeLatest(ASSIGNMENT_GET_ASSIGNMENT_LIST, getAssignments);
  yield takeLatest(
    ASSIGNMENT_GET_ASSIGNMENT_CHECKPOINTS,
    getAssignmentChecklist
  );
  yield takeLatest(
    ASSIGNMENT_GET_ASSIGNMENT_QUESTIONNARIE,
    fetchAssignmentQuestionnarieFromAssignment
  );
  yield takeLatest(
    submitAnswerModalTypes.SUBMIT_DATA_REQUEST,
    submitQuestionnarieAnswer
  );
  yield takeLatest(
    submitAnswerModalTypes.GET_SUBMITED_ANSWER,
    fetchSubmitedAnswers
  );
  yield takeLatest(
    MARK_AS_COMPLETE_SET_DATA,
    submitMarkAsComplete
  )
}

export default auditSaga;
