import express from "express";
import passport from "passport";
import pool from "../../../database/connection";
import { sendMail } from "../../../services/email";

/**
 * Database quires return an array. Even if 1 item exist.
 * @typedef {{
 *   artFile:String,
 *   artistName:String,
 *   artistEmail:String,
 *   description:String,
 *   previewArt:String,
 *   status:String,
 *   title:String,
 * }} SubmissionDetails
 *
 */

const router = express.Router();

router.post(
  "/submissions",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { startAt } = req.body;

    let conn;

    try {
      conn = await pool.getConnection();
      const queryString =
        "SELECT `id`, `artist_name` AS `artistName`, `title`, `description`, " +
        "`art_file` AS `artFile`, `preview_art` AS `previewArt`, `status`, " +
        "`created_at` AS `createdAt` FROM `submissions` " +
        "ORDER BY `created_at` DESC " +
        "LIMIT " +
        startAt +
        ",100 ";

      /**
       * @return {SubmissionDetails[]}
       */
      const submissionsDetailsArr = await pool.query(queryString);
      conn.end();

      res.status(200).json({ submissionsDetailsArr });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

router.get(
  "/submissions/review/:id",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { id: submissionId } = req.params;
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString =
        "SELECT `id`, `username_contact_email` AS `artistEmail`, " +
        "`artist_name` AS `artistName`, `title`, `description`, " +
        "`art_file` AS `artFile`, `preview_art` AS `previewArt`, `status`, " +
        "`created_at` AS `createdAt` FROM `submissions` " +
        "WHERE `id`=?";
      /**
       * @return {SubmissionDetails}
       */
      const [submissionDetails] = await pool.query(queryString, [submissionId]);

      conn.end();

      res.status(200).json({ submissionDetails });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

// Change Submissions status
router.post(
  "/submissions/status",
  passport.authenticate("jwt-admin"),
  async (req, res) => {
    const { id: submissionId, status } = req.body;
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString =
        "UPDATE `submissions` SET `status`= ?" + "WHERE `id`=?";

      const { affectedRows } = await pool.query(queryString, [
        status,
        submissionId,
      ]);

      conn.end();

      res.sendStatus(202);
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

router.get(
  "/submissions/test",
  // passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    try {
      const success = await sendMail("crazy_azndriver@yahoo.com", "What up");
      console.log("success", success);
      res.sendStatus(202);
    } catch (error) {
      console.log("error ", error);
      next(error);
    }
  }
);

export default router;
