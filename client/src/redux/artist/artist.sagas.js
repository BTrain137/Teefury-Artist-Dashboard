import { all, call, put, takeLatest, select } from "redux-saga/effects";
import axios from "axios";
import ArtistActionTypes from "./artist.types";

import {
  setArtistProfile,
  artistProfileFailure,
  createArtistProfileSuccess,
  getArtistProfileSuccess,
} from "./artist.action";
import { selectUserJWTToken } from "../user/user.selector";

export function* createArtistProfile({ payload: { reqBody } }) {
  try {
    const token = yield select(selectUserJWTToken);
    const {
      data: { artistProfile },
    } = yield axios.post("/api/artist-profile-create", reqBody, {
      headers: { Authorization: `JWT ${token}` },
    });
    yield put(createArtistProfileSuccess({ artistProfile }));
  } catch (error) {
    const { status, message } = error.response.data;
    yield put(artistProfileFailure({ status, messages: [message] }));
  }
}

export function* getArtistProfile() {
  try {
    const token = yield select(selectUserJWTToken);
    const {
      data: { artistProfile },
    } = yield axios.get("/api/artist-profile-details", {
      headers: { Authorization: `JWT ${token}` },
    });
    yield put(getArtistProfileSuccess({ artistProfile }));
  } catch (error) {
    const { status, message } = error.response.data;
    yield put(artistProfileFailure({ status, messages: [message] }));
  }
}

export function* setArtistProfileWithDetails({ payload: { artistProfile } }) {
  yield put(setArtistProfile(artistProfile));
}

export function* onCreateProfileStart() {
  yield takeLatest(ArtistActionTypes.CREATE_PROFILE_START, createArtistProfile);
}

export function* onCreateProfileSuccess() {
  yield takeLatest(
    ArtistActionTypes.CREATE_PROFILE_SUCCESS,
    setArtistProfileWithDetails
  );
}

export function* onGetArtistProfileStart() {
  yield takeLatest(
    ArtistActionTypes.GET_ARTIST_PROFILE_START,
    getArtistProfile
  );
}

export function* onGetArtistProfileSuccess() {
  yield takeLatest(
    ArtistActionTypes.GET_ARTIST_PROFILE_SUCCESS,
    setArtistProfileWithDetails
  );
}

export function* artistSaga() {
  yield all([
    call(onCreateProfileStart),
    call(onCreateProfileSuccess),
    call(onGetArtistProfileStart),
    call(onGetArtistProfileSuccess),
  ]);
}
