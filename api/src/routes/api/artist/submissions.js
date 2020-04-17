import fs from "fs";
import express from "express";
import multer from "multer";
import { cleanFileName, cleanStringShopify } from "../../../utils/cleanData";
import passport from "passport";
import pool from "../../../database/connection";

/**
 *
 * @typedef {{
 *   artFile:String,
 *   artistName:String,
 *   description:String,
 *   previewArt:String,
 *   status:String,
 *   title:String,
 * }} SubmissionDetails
 */

const router = express.Router();
const FILE_DIRECTORY = "submissions";
const upload = multer({
  dest: FILE_DIRECTORY,
});

// Single File
router.post(
  "/submit-art-file",
  upload.single("artFile"),
  passport.authenticate("jwt"),
  async (req, res, next) => {
    const { originalname, path: oldSubmissionPath } = req.file;
    const { artistName } = req.user;
    const newPath = `${FILE_DIRECTORY}/${artistName}/${Date.now()}_${cleanFileName(
      originalname
    )}`;

    try {
      fs.renameSync(oldSubmissionPath, newPath);
      res.json({
        field: req.body,
        image: req.file,
        newPath,
        message: "file uploaded!",
      });
    } catch (error) {
      next(error);
    }
  }
);

const cpUpload = upload.fields([
  { name: "artFile", maxCount: 1 },
  { name: "previewArt", maxCount: 1 },
]);

//Upload multiple files
router.post(
  "/submit-artwork",
  passport.authenticate("jwt"),
  cpUpload,
  async (req, res, next) => {
    const { title, description } = req.body;
    const { contactEmail, cleanArtistName, artistName } = req.user;
    const [artFile] = req.files["artFile"];
    const [previewArt] = req.files["previewArt"];
    const artistDirectory = `${FILE_DIRECTORY}/${cleanArtistName}`;
    let conn;

    // Create Artist Directory if not exist
    !fs.existsSync(artistDirectory) && fs.mkdirSync(artistDirectory);

    const artFileNewPath = `${artistDirectory}/${Date.now()}_${cleanFileName(
      artFile.originalname
    )}`;
    const previewArtNewPath = `${artistDirectory}/${Date.now()}_${cleanFileName(
      previewArt.originalname
    )}`;

    try {
      conn = await pool.getConnection();

      fs.renameSync(artFile.path, artFileNewPath);
      fs.renameSync(previewArt.path, previewArtNewPath);

      const insertQueryString =
        "INSERT INTO `submissions` (`artist_name`, `username_contact_email`, " +
        "`title`, `description`, `art_file`, `preview_art`) VALUES (?,?,?,?,?,?)";

      const insertValues = [
        artistName,
        contactEmail,
        title,
        description,
        `/${artFileNewPath}`,
        `/${previewArtNewPath}`,
      ];

      // { affectedRows: 1, insertId: 2, warningStatus: 0 }
      const { insertId } = await pool.query(insertQueryString, insertValues);

      const selectQueryString =
        "SELECT `artist_name` AS `artistName`, `title`, `description`, " +
        "`art_file` AS `artFile`, `preview_art` AS `previewArt`, `status` " +
        "FROM `submissions` WHERE `id`=?";
      const submissionDetails = await pool.query(selectQueryString, [insertId]);

      conn.end();
      /**
       * @returns {SubmissionDetails}
       */
      res.status(200).json({ submissionDetails });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

export default router;
