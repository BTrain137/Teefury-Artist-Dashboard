import ArtistActionTypes from "./artist.types";

export const setArtistProfile = (artistProfile) => ({
  type: ArtistActionTypes.SET_ARTIST_PROFILE,
  payload: artistProfile,
});

export const clearAllArtistDetails = () => ({
  type: ArtistActionTypes.CLEAR_ALL_ARTIST_DETAILS,
});

export const createArtistProfileStart = (artistDetails) => ({
  type: ArtistActionTypes.CREATE_PROFILE_START,
  payload: artistDetails,
});

export const createArtistProfileSuccess = (artistProfile) => ({
  type: ArtistActionTypes.CREATE_PROFILE_SUCCESS,
  payload: artistProfile,
});

/**
 * @param {Number} status  HTTP error status
 * @param {Array}  messages Error message in an array
 */
export const artistProfileFailure = ({ status, messages }) => ({
  type: ArtistActionTypes.ARTIST_PROFILE_FAILURE,
  payload: { status, messages },
});

export const clearArtistErrors = () => ({
  type: ArtistActionTypes.CLEAR_ARTIST_ERROR,
});
