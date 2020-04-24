import express from "express";
import passport from "passport";

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
 */

const router = express.Router();

router.post(
  "/email-approve",
  passport.authenticate("jwt-admin"),
  async (req, res) => {
    const { id: submissionId, status } = req.params;
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString =
        "UPDATE `submissions` SET `status`= ?" +
        "WHERE `id`=?";
      /**
       * @return {SubmissionDetails}
       */
      const [submissionDetails] = await pool.query(queryString, [
        status,
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
