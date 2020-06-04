"use strict";

const path = require("path");
const submissionsDirectory =
  NODE_ENV === "stage"
    ? "../../../artist-dashboard/source/art-submissions"
    : "../../../art-submissions";
const ABSPATH = path.join(__dirname, submissionsDirectory);
const gm = require("gm");

const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

class Media {
  constructor(path) {
    this.src = path;
  }

  thumb(request, response) {
    let image = ABSPATH + this.src;

    let extension = getFileExtension(this.src);
    let mime = extension === "jpeg" || extension === "jpg" ? "jpeg" : "png";

    try {
      let width = (request.query.w && /^\d+$/.test(request.query.w)) ? request.query.w : '80';

      response.setHeader("content-type", "image/jpeg");
      response.type(mime);
      gm(image).resize(width).stream().pipe(response);
    } catch (error) {
      next(error)
      console.log({ error });
    }
  }
}

module.exports = Media;
