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
 *
 * DOM file input structure
 * @typedef {{
 *    lastModified:Number,
 *    lastModifiedDate:Date
 *    name:String,
 *    size:Number,
 *    type:String,
 * }} InputFile
 *
 * Error message parsed by saga sent to reducer
 * @typedef {{
 *  status?:Number,
 *  messages:Sting[],
 *}} ErrorMsg
 *
 * The detailed information about the artwork
 * @typedef {{
 *   artistName:String
 *   title:String,
 *   description:String,
 *   artFile:String,
 *   previewArt:String,
 *   status:String,
 * }} ArtworkDetails
 *
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

export const getArtistProfileSuccess = (artistProfile) => ({
  type: ArtistActionTypes.GET_ARTIST_PROFILE_SUCCESS,
  payload: artistProfile,
});

/**
 * @param {ArtistProfile} reqBody Request body object containing artist profile
 */
export const createArtistProfileStart = (reqBody) => ({
  type: ArtistActionTypes.CREATE_ARTIST_PROFILE_START,
  payload: reqBody,
});

export const createArtistProfileSuccess = (artistProfile) => ({
  type: ArtistActionTypes.CREATE_ARTIST_PROFILE_SUCCESS,
  payload: artistProfile,
});

export const updateArtistProfileStart = (reqBody) => ({
  type: ArtistActionTypes.UPDATE_ARTIST_PROFILE_START,
  payload: reqBody,
});

export const updateArtistProfileSuccess = (artistProfile) => ({
  type: ArtistActionTypes.UPDATE_ARTIST_PROFILE_SUCCESS,
  payload: artistProfile,
});

/**
 * @param {Number}   [status]   HTTP error status
 * @param {String[]} messages Error message in an array
 */
export const artistProfileFailure = ({ status, messages }) => ({
  type: ArtistActionTypes.ARTIST_PROFILE_FAILURE,
  payload: { status, messages },
});

export const clearArtistErrors = () => ({
  type: ArtistActionTypes.CLEAR_ARTIST_ERROR,
});

/**
 * @param {FormData}  formData             form data object.
 * @param {String}    formData.artistName  Artist Name associated to the artwork
 * @param {String }   formData.title       Title of the art piece
 * @param {String}    formData.description Art work description
 * @param {InputFile} formData.previewArt  The preview artwork in jpg or png
 * @param {InputFile} formData.artFile     The psd file of the artwork
 */
export const artworkSubmitStart = (formData) => ({
  type: ArtistActionTypes.ARTWORK_SUBMIT_START,
  payload: formData,
});

/**
 * @param {ArtworkDetails} artworkDetails
 */
export const artworkSubmitSuccess = (artworkDetails) => ({
  type: ArtistActionTypes.ARTWORK_SUBMIT_SUCCESS,
  payload: artworkDetails,
});

/**
 * @param {ArtworkDetails} artworkDetails
 */
export const artworkSubmitAdd = (artworkDetails) => ({
  type: ArtistActionTypes.ARTWORK_SUBMIT_ADD,
  payload: artworkDetails,
});

/**
 * @param {ErrorMsg} error
 */
export const artworkSubmitFailed = (error) => ({
  type: ArtistActionTypes.ARTWORK_SUBMIT_FAILURE,
  payload: error,
});

/**
 * @param {String} successMsg
 */
export const artistSuccessAlert = (successMsg) => ({
  type: ArtistActionTypes.ARTIST_SUCCESS_ALERT,
  payload: successMsg,
});

/**
 * @param {String} failureMsg
 */
export const artistErrorAlert = (failureMsg) => ({
  type: ArtistActionTypes.ARTIST_ERROR_ALERT,
  payload: failureMsg,
});
