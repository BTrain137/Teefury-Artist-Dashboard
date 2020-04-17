import fs from "fs";
import express from "express";
import multer from "multer";
import { cleanFileName, cleanStringShopify } from "../../../utils/cleanData";
import passport from "passport";
import pool from "../../../database/connection";

/**
 * Database quires return an array. Even if 1 item exist.
 * @typedef {{
 *   artFile:String,
 *   artistName:String,
 *   description:String,
 *   previewArt:String,
 *   status:String,
 *   title:String,
 * }} SubmissionDetails
 *
 * The response object after inserting into database
 * @typedef {{
 *   affectedRows:Number,
 *   insertId:Number,
 *   warningStatus:Number,
 * }} InsertDatabaseResponse
 */

const router = express.Router();
const FILE_DIRECTORY = "art-submissions";
const upload = multer({
  dest: FILE_DIRECTORY,
});

// Single File, Just artFile
router.post(
  "/submit-art-file",
  upload.single("artFile"),
  passport.authenticate("jwt"),
  async (req, res, next) => {
    const { originalname, path: oldSubmissionPath } = req.file;
    const { cleanArtistName } = req.user;
    const artFileNewPath = `${FILE_DIRECTORY}/${cleanArtistName}/${Date.now()}_${cleanFileName(
      originalname
    )}`;

    let conn;

    const insertQueryString =
      "INSERT INTO `submissions` (`artist_name`, `username_contact_email`, " +
      "`title`, `description`, `art_file`) VALUES (?,?,?,?,?)";

    const insertValues = [
      artistName,
      contactEmail,
      title,
      description,
      `/api/${artFileNewPath}`,
    ];

    try {
      /**
       * @return {InsertDatabaseResponse}
       */
      const { insertId } = await pool.query(insertQueryString, insertValues);

      const selectQueryString =
        "SELECT `artist_name` AS `artistName`, `title`, `description`, " +
        "`art_file` AS `artFile`, `preview_art` AS `previewArt`, `status`, " +
        "`created_at` AS `createdAt` FROM `submissions` WHERE `id`=?";
      /**
       * @return {SubmissionDetails}
       */
      const submissionDetails = await pool.query(selectQueryString, [insertId]);

      conn.end();

      fs.renameSync(oldSubmissionPath, newPath);
      res.json({
        field: req.body,
        image: req.file,
        artFileNewPath,
        message: "file uploaded!",
        submissionDetails,
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

// Upload multiple files
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
    const artFileNewPath = `${artistDirectory}/${Date.now()}_${cleanFileName(
      artFile.originalname
    )}`;
    const previewArtNewPath = `${artistDirectory}/${Date.now()}_${cleanFileName(
      previewArt.originalname
    )}`;

    let conn;
    try {
      // Create Artist Directory if not exist
      !fs.existsSync(artistDirectory) && fs.mkdirSync(artistDirectory);
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
        `/api/${artFileNewPath}`,
        `/api/${previewArtNewPath}`,
      ];

      /**
       * @return {InsertDatabaseResponse}
       */
      const { insertId } = await pool.query(insertQueryString, insertValues);

      const selectQueryString =
        "SELECT `artist_name` AS `artistName`, `title`, `description`, " +
        "`art_file` AS `artFile`, `preview_art` AS `previewArt`, `status`, " +
        "`created_at` AS `createdAt` FROM `submissions` WHERE `id`=?";
      /**
       * @return {SubmissionDetails}
       */
      const [submissionDetails] = await pool.query(selectQueryString, [
        insertId,
      ]);

      conn.end();
      /**
       * @returns {SubmissionDetails[]}
       */
      res.status(200).json({ submissionDetails });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

// Sending all submissions to client.
// Client will be sorting the artworks by their status
router.get(
  "/submissions",
  passport.authenticate("jwt"),
  async (req, res, next) => {
    const { artistName } = req.user;
    let conn;
    try {
      conn = await pool.getConnection();
      const queryString =
        "SELECT `artist_name` AS `artistName`, `title`, `description`, " +
        "`art_file` AS `artFile`, `preview_art` AS `previewArt`, `status`, " +
        "`created_at` AS `createdAt` FROM `submissions` WHERE `artist_name`=?" +
        "ORDER BY `created_at` DESC";
      /**
       * @return {SubmissionDetails[]}
       */
      const submissionsDetailsArr = await pool.query(queryString, [artistName]);
      conn.end();

      res.status(200).json({ submissionsDetailsArr });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

export default router;
