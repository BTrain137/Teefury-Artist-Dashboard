/**
 * @description Remove some special characters, replace space to underscore and make everything lowercase
 * @param  {String} str Input string
 * @return {String} Cleaned up string
 * @example
 * cleanArtistFileName("Screen Shot 2019-11-08.png")
 * // screen_shot_2019-11-08.png
 */
export const cleanFileName = (str) => {
  return str
    .replace(/[&/\\#,+()$~%'":*?<>{}]/g, "")
    .replace(/ /g, "_")
    .toLowerCase();
};
