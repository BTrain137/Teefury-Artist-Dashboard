import ArtistActionTypes from "./artist.types";

/**
 * Complete Artist Profile
 * @typedef {{
 *    artistName:String,
 *    firstName:String,
 *    lastName:String,
 *    contactEmail:String,
 *    paypalEmail:String,
 *    phoneNumber:String,
 *    social_facebook:String,
 *    social_instagram:String,
 *    social_twitter:String,
 *    isInternational:Boolean,
 *  }} ArtistProfile
 */

/**
 * @param {ArtistProfile} artistProfile Detailed user account information
 */
export const setArtistProfile = (artistProfile) => ({
  type: ArtistActionTypes.SET_ARTIST_PROFILE,
  payload: artistProfile,
});

export const clearAllArtistDetails = () => ({
  type: ArtistActionTypes.CLEAR_ALL_ARTIST_DETAILS,
});

export const getArtistProfileStart = () => ({
  type: ArtistActionTypes.GET_ARTIST_PROFILE_START,
});

/**
 * @param {ArtistProfile} artistProfile Detailed user account information
 */
export const getArtistProfileSuccess = (artistProfile) => ({
  type: ArtistActionTypes.GET_ARTIST_PROFILE_SUCCESS,
  payload: artistProfile,
});

/**
 * @param {ArtistProfile} artistProfile Detailed user account information
 */
export const createArtistProfileStart = (artistProfile) => ({
  type: ArtistActionTypes.CREATE_PROFILE_START,
  payload: artistProfile,
});

/**
 * @param {ArtistProfile} artistProfile Detailed user account information
 */
export const createArtistProfileSuccess = (artistProfile) => ({
  type: ArtistActionTypes.CREATE_PROFILE_SUCCESS,
  payload: artistProfile,
});

/**
 * @param {Number}   status   HTTP error status
 * @param {String[]} messages Error message in an array
 */
export const artistProfileFailure = ({ status, messages }) => ({
  type: ArtistActionTypes.ARTIST_PROFILE_FAILURE,
  payload: { status, messages },
});

export const clearArtistErrors = () => ({
  type: ArtistActionTypes.CLEAR_ARTIST_ERROR,
});
