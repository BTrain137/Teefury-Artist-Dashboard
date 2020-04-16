import { all, call, put, takeLatest, select } from "redux-saga/effects";
import axios from "axios";
import ArtistActionTypes from "./artist.types";

import {
  setArtistProfile,
  artistProfileFailure,
  createArtistProfileSuccess,
  getArtistProfileSuccess,
  updateArtistProfileSuccess,
  artworkSubmitAdd,
  artworkSubmitFailed,
  artistErrorAlert,
  artistSuccessAlert,
  artworkSubmitSuccess,
} from "./artist.action";
import { selectUserJWTToken } from "../user/user.selector";

export function* setArtistProfileWithDetails({ payload: { artistProfile } }) {
  yield put(setArtistProfile(artistProfile));
}

export function* createArtistProfile({ payload: { reqBody } }) {
  try {
    const token = yield select(selectUserJWTToken);
    const {
      data: { artistProfile },
    } = yield axios.post("/api/artist/profile", reqBody, {
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
    } = yield axios.get("/api/artist/profile", {
      headers: { Authorization: `JWT ${token}` },
    });
    yield put(getArtistProfileSuccess({ artistProfile }));
  } catch (error) {
    const { status, message } = error.response.data;
    yield put(artistProfileFailure({ status, messages: [message] }));
  }
}

export function* updateArtistProfile({ payload: { reqBody } }) {
  try {
    const token = yield select(selectUserJWTToken);
    const {
      data: { artistProfile },
    } = yield axios.put("/api/artist/profile", reqBody, {
      headers: { Authorization: `JWT ${token}` },
    });
    yield put(updateArtistProfileSuccess({ artistProfile }));
  } catch (error) {
    const { status, message } = error.response.data;
    yield put(artistProfileFailure({ status, messages: [message] }));
  }
}

export function* artworkSubmit({ payload: { formData } }) {
  try {
    console.log(formData);
    const token = yield select(selectUserJWTToken);
    const {
      data: { artworkDetails },
    } = yield axios.post("/api/artist/submit-artwork", formData, {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `JWT ${token}`,
      },
    });
    yield put(artworkSubmitSuccess({ artworkDetails }));
  } catch (error) {
    const { status, message } = error.response.data;
    yield put(artworkSubmitFailed({ status, messages: [message] }));
    yield put(artistErrorAlert("Sorry Your Artwork was not loaded."));
  }
}

// start and stop spinners
export function* artSubmitSuccess({ payload: { artworkDetails } }) {
  yield put(artworkSubmitAdd({ artworkDetails }));
  yield put(
    artistSuccessAlert("YAY your master piece has been added. Thank you!")
  );
}

export function* onCreateProfileStart() {
  yield takeLatest(
    ArtistActionTypes.CREATE_ARTIST_PROFILE_START,
    createArtistProfile
  );
}

export function* onCreateProfileSuccess() {
  yield takeLatest(
    ArtistActionTypes.CREATE_ARTIST_PROFILE_SUCCESS,
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

export function* onUpdateArtistProfileStart() {
  yield takeLatest(
    ArtistActionTypes.UPDATE_ARTIST_PROFILE_START,
    updateArtistProfile
  );
}

export function* onUpdateArtistProfileSuccess() {
  yield takeLatest(
    ArtistActionTypes.UPDATE_ARTIST_PROFILE_SUCCESS,
    setArtistProfileWithDetails
  );
}

export function* onArtworkSubmitStart() {
  yield takeLatest(ArtistActionTypes.ARTWORK_SUBMIT_START, artworkSubmit);
}

export function* onArtworkSubmitSuccess() {
  yield takeLatest(ArtistActionTypes.ARTWORK_SUBMIT_SUCCESS, artSubmitSuccess);
}

export function* artistSaga() {
  yield all([
    call(onCreateProfileStart),
    call(onCreateProfileSuccess),
    call(onGetArtistProfileStart),
    call(onGetArtistProfileSuccess),
    call(onUpdateArtistProfileStart),
    call(onUpdateArtistProfileSuccess),
    call(onArtworkSubmitStart),
    call(onArtworkSubmitSuccess),
  ]);
}
