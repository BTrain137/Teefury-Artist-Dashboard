import { all, call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import UserActionTypes from "./user.types";

import {
  signInSuccess,
  signInFailure,
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
    yield put(signInSuccess(data));
  } catch (error) {
    // This will go through the reducer and set all states
    // Which then a component that
    console.log("=================================");
    console.log(error);
    console.log(error.response);
    console.log("=================================");
    yield put(signInFailure(error.response));
  }
}

export function* setCurrentUserAfterSignIn({
  payload: { token, currentUser },
}) {
  yield put(setCurrentUser(currentUser));
  yield put(setUserJWTToken(token));
}

export function* onSignInStart() {
  yield takeLatest(UserActionTypes.SIGN_IN_START, signIn);
}

export function* onSignInSuccess() {
  yield takeLatest(UserActionTypes.SIGN_IN_SUCCESS, setCurrentUserAfterSignIn);
}

export function* userSaga() {
  yield all([call(onSignInStart), call(onSignInSuccess)]);
}
