import { all, call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import ArtistActionTypes from "./artist.types";

import {
  setArtistProfile,
  artistProfileFailure,
  createArtistProfileSuccess,
} from "./artist.action";

export function* createArtistProfile({ payload: { token, reqBody } }) {
  try {
    const {
      data: { artistProfile },
    } = yield axios.post("/api/artist-profile-create", reqBody, {
      headers: { Authorization: `JWT ${token}` },
    });
    console.log({ artistProfile });
    yield put(createArtistProfileSuccess({ artistProfile }));
  } catch (error) {
    const { status, message } = error.response.data;
    yield put(artistProfileFailure({ status, messages: [message] }));
  }
}

// Additional Step but however follows saga pattern of Start Success Failure
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

export function* artistSaga() {
  yield all([call(onCreateProfileStart), call(onCreateProfileSuccess)]);
}
