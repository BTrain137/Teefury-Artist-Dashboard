import { all, call, put, takeLatest, select } from "redux-saga/effects";
import axios from "axios";
import SubmissionActionTypes from "./submissions.types";

import {
  submissionSuccess,
  submissionAdd,
  submissionFailed,
  submissionErrorAlert,
  submissionSuccessAlert,
} from "./submissions.action";
import { selectUserJWTToken } from "../user/user.selector";

export function* submissionSubmit({ payload: { formData } }) {
  try {
    const token = yield select(selectUserJWTToken);
    const {
      data: { submissionDetails },
    } = yield axios.post("/api/artist/submit-artwork", formData, {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `JWT ${token}`,
      },
    });
    yield put(submissionSuccess({ submissionDetails }));
  } catch (error) {
    const { status, message } = error.response.data;
    yield put(submissionFailed({ status, messages: [message] }));
    yield put(submissionErrorAlert(message));
  }
}

// start and stop spinners
export function* submissionComplete({ payload: { submissionDetails } }) {
  yield put(submissionAdd({ ...submissionDetails }));
  yield put(
    submissionSuccessAlert("YAY your master piece has been added. Thank you!")
  );
}

export function* onSubmissionsStart() {
  yield takeLatest(SubmissionActionTypes.SUBMISSION_START, submissionSubmit);
}

export function* onSubmissionsSuccess() {
  yield takeLatest(
    SubmissionActionTypes.SUBMISSION_SUCCESS,
    submissionComplete
  );
}

export function* submissionsSaga() {
  yield all([call(onSubmissionsStart), call(onSubmissionsSuccess)]);
}
