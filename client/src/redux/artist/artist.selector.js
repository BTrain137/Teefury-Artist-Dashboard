import { createSelector } from "reselect";

const selectArtist = (state) => state.artist;

export const selectArtistProfile = createSelector(
  [selectArtist],
  (artist) => artist.artistProfile
);

/**
 * @returns {Object<{status:Number, messages:Array}>} 
 */
export const selectArtistError = createSelector(
  [selectArtist],
  (artist) => artist.error
);
