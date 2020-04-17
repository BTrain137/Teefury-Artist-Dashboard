
/**
 * Clean title or vendor string to search in shopify
 * 
 * @param  {String} str  Any string to be cleaned
 * @return {String}      The same string minus special characters 
 */

export const cleanStringShopify = function(str) {
  let tempStr = str
      // Remove all special characters
      .replace(/\*\*/gi, "-")
      .replace(/!/gi, "")
      .replace(/\[/g, "")
      .replace(/\]/g, "")
      .replace(/'/g, "")
      .replace(/"/g, "")
      .replace(/\#/g, "")
      .replace(/\$/g, "")
      .replace(/\%/g, "")
      .replace(/\&/g, "")
      .replace(/\?/g, "")
      .replace(/\)/g, "")
      .replace(/\(/g, "")
      .replace(/\+/g, "")
      .replace(/\//g, "")
      .replace(/\,/g, "")
      .replace(/\~/g, "")
      .replace(/\{/g, "")
      .replace(/\}/g, "")
      .replace(/\|/g, "")
      .replace(/\}/g, "")
      .replace(/\\/g, "")
      .replace(/\:/g, "")
      .replace(/\*/g, "-")
      .replace(/\@/g, "-")
      // Remove all double spaces
      .replace(/\.\.\./g, "")
      .replace(/  /g, " ")
      // Replace some characters with dashes instead
      .replace(/ /g, "-")
      .replace(/\./g, "-")
      .replace(/\^/g, "-")

      // replace one or more hyphens with a single hyphen, globally
      .replace(/-+/g,"-") 

      // replace all hyphens at beginning and end of string.
      .replace(/^-+|-+$/g,"") 

      .toLowerCase();
  
  return tempStr;
};

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
    .replace(/[&\/\\#,+()$~%'":*?<>{}]/g, "")
    .replace(/ /g, "_")
    .toLowerCase();
};
