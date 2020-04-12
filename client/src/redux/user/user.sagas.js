import { all, call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import UserActionTypes from "./user.types";

import {
  authorizedSuccess,
  authorizedFailure,
  setCurrentUser,
  setUserJWTToken,
} from "./user.action";

export function* signIn({ payload: { contactEmail, password } }) {
  try {
    const { data } = yield axios.post("/api/signin-user", {
      contactEmail,
      password,
    });
    // const { token, currentUser } = data;
    yield put(authorizedSuccess(data));
  } catch (error) {
    yield put(authorizedFailure(error.response));
  }
}

export function* signUp({ payload: { contactEmail, password } }) {
  try {
    const { data } = yield axios.post("/api/register-user", {
      contactEmail,
      password,
    });
    yield put(authorizedSuccess(data));
  } catch (error) {
    yield put(authorizedFailure(error.response));
  }
}

export function* setCurrentUserAfterAuth({ payload: { token, currentUser } }) {
  yield put(setCurrentUser(currentUser));
  yield put(setUserJWTToken(token));
}

export function* onSignInStart() {
  yield takeLatest(UserActionTypes.SIGN_IN_START, signIn);
}

export function* onSignUpStart() {
  yield takeLatest(UserActionTypes.SIGN_UP_START, signUp);
}

export function* onAuthorizedSuccess() {
  yield takeLatest(UserActionTypes.AUTHORIZED_SUCCESS, setCurrentUserAfterAuth);
}

export function* userSaga() {
  yield all([
    call(onSignInStart),
    call(onSignUpStart),
    call(onAuthorizedSuccess),
  ]);
}
