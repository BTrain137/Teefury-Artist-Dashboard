import express from "express";
import passport from "passport";
import pool from "../../../database/connection";

const router = express.Router();

router.post(
  "/submissions",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { startAt } = req.body;
    console.log(startAt);

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
        "SELECT `id`, `artist_name` AS `artistName`, `title`, `description`, " +
        "`art_file` AS `artFile`, `preview_art` AS `previewArt`, `status`, " +
        "`created_at` AS `createdAt` FROM `submissions` " +
        "WHERE `id`=?";
      /**
       * @return {SubmissionDetails}
       */
      const [submissionDetails] = await pool.query(queryString, [
        submissionId,
      ]);

      conn.end();

      res.status(200).json({ submissionDetails });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

export default router;
