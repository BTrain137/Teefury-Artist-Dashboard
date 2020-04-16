import SubmissionActionTypes from "./submissions.types";

const INITIAL_STATE = {
  submissions: [],
  submissionSuccessAlert: "",
  submissionErrorAlert: "",
  error: null,
};

const submissionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SubmissionActionTypes.CLEAR_ALL_SUBMISSIONS_DETAILS:
      return {
        ...state,
        ...INITIAL_STATE,
      };
    case SubmissionActionTypes.SUBMISSION_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case SubmissionActionTypes.SUBMISSION_ADD:
      return {
        ...state,
        submissions: [...state.submissions, action.payload],
      };
    case SubmissionActionTypes.SUBMISSIONS_SUCCESS_ALERT:
      return {
        ...state,
        submissionSuccessAlert: action.payload,
      };
    case SubmissionActionTypes.SUBMISSIONS_SUCCESS_ALERT_CLEAR:
      return {
        ...state,
        submissionSuccessAlert: "",
      };
    case SubmissionActionTypes.SUBMISSIONS_ERROR_ALERT:
      return {
        ...state,
        submissionErrorAlert: action.payload,
      };
    case SubmissionActionTypes.SUBMISSIONS_ERROR_ALERT_CLEAR:
      return {
        ...state,
        submissionErrorAlert: "",
      };
    default:
      return state;
  }
};

export default submissionReducer;
