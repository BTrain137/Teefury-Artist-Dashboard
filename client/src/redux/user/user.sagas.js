import { all, call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import UserActionTypes from "./user.types";

import {
  authorizedSuccess,
  authorizedFailure,
  setCurrentUser,
  setUserJWTToken,
  clearAllUserDetails,
} from "./user.action";

export function* unAuthorizedError(response) {
  response.data = {
    status: 401,
    message: "Something went wrong please check back later.",
  };
  yield put(authorizedFailure(response));
  yield put(clearAllUserDetails());
}

export function* signIn({ payload: { contactEmail, password } }) {
  try {
    // const { token, currentUser } = data;
    const { data } = yield axios.post("/api/signin-user", {
      contactEmail,
      password,
    });
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

export function* deleteUser({ payload: { token } }) {
  try {
    yield axios.delete("/api/delete-user", {
      headers: { Authorization: `JWT ${token}` },
    });
    yield put(clearAllUserDetails());
  } catch (error) {
    const { status } = error.response;
    if (status === 401) {
      yield unAuthorizedError(error.response);
    } else {
      yield put(authorizedFailure(error.response));
      yield put(clearAllUserDetails());
    }
  }
}

export function* setCurrentUserAfterAuth({ payload: { token, currentUser } }) {
  yield put(setCurrentUser(currentUser));
  yield put(setUserJWTToken(token));
}

export function* logout() {
  yield put(clearAllUserDetails());
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

export function* onDeleteUserStart() {
  yield takeLatest(UserActionTypes.DELETE_USER_START, deleteUser);
}

export function* onLogoutStart() {
  yield takeLatest(UserActionTypes.LOGOUT_START, logout);
}

export function* userSaga() {
  yield all([
    call(onSignInStart),
    call(onSignUpStart),
    call(onAuthorizedSuccess),
    call(onDeleteUserStart),
    call(onLogoutStart),
  ]);
}
