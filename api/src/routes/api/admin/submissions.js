import express from "express";
import passport from "passport";
import pool from "../../../database/connection";

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

router.get(
  "/submissions",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    let conn;
    const { status } = req.query;

    try {
      conn = await pool.getConnection();
      let queryString =
        "SELECT `id`, `artist_name` AS `artistName`, `title`, `description`, " +
        "`art_file` AS `artFile`, `preview_art` AS `previewArt`, `status`, " +
        "`created_at` AS `createdAt` FROM `submissions` ";
        
        if(status) {
          queryString += "WHERE `status`='" + status + "' ";
        }

        queryString +=  "ORDER BY `created_at` DESC ";

        // TODO: implement a pagination on "DELETE" "APPROVED" "REVIEWED"

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

export default router;
