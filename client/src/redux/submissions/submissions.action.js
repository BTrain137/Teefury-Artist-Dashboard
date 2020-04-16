import SubmissionActionTypes from "./submissions.types";

/**
 * The detailed information about the artwork
 * @typedef {{
 *   artistName:String
 *   title:String,
 *   description:String,
 *   artFile:String,
 *   previewArt:String,
 *   status:String,
 * }} SubmissionDetails
 *
 * Error message parsed by saga sent to reducer
 * @typedef {{
 *   status?:Number,
 *   messages:Sting[],
 * }} ErrorMsg
 *
 */

/**
 * @param {FormData}  formData             form data object.
 * @param {String}    formData.artistName  Artist Name associated to the artwork
 * @param {String }   formData.title       Title of the art piece
 * @param {String}    formData.description Art work description
 * @param {InputFile} formData.previewArt  The preview artwork in jpg or png
 * @param {InputFile} formData.artFile     The psd file of the artwork
 */
export const submissionStart = (formData) => ({
  type: SubmissionActionTypes.SUBMISSION_START,
  payload: formData,
});

/**
 * @param {SubmissionDetails} submissionDetails
 */
export const submissionSuccess = (submissionDetails) => ({
  type: SubmissionActionTypes.SUBMISSION_SUCCESS,
  payload: submissionDetails,
});

/**
 * @param {SubmissionDetails} submissionDetails
 */
export const submissionAdd = (submissionDetails) => ({
  type: SubmissionActionTypes.SUBMISSION_ADD,
  payload: submissionDetails,
});

/**
 * @param {ErrorMsg} error
 */
export const submissionFailed = (error) => ({
  type: SubmissionActionTypes.SUBMISSION_FAILURE,
  payload: error,
});

/**
 * @param {String} successMsg
 */
export const submissionSuccessAlert = (successMsg) => ({
  type: SubmissionActionTypes.SUBMISSIONS_SUCCESS_ALERT,
  payload: successMsg,
});

export const submissionSuccessAlertClear = () => ({
  type: SubmissionActionTypes.SUBMISSIONS_SUCCESS_ALERT_CLEAR,
});

/**
 * @param {String} failureMsg
 */
export const submissionErrorAlert = (failureMsg) => ({
  type: SubmissionActionTypes.SUBMISSIONS_ERROR_ALERT,
  payload: failureMsg,
});

export const submissionErrorAlertClear = () => ({
  type: SubmissionActionTypes.SUBMISSIONS_ERROR_ALERT_CLEAR,
});
