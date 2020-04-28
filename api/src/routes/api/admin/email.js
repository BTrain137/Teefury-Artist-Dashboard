import express from "express";
import passport from "passport";
import pool from "../../../database/connection";
import { sendMail } from "../../../services/email";

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
  "/email",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const {
      // Artwork
      id: submissionId,
      status,
      // Artist Email
      artistEmail,
      subject,
      htmlContent,
    } = req.body;
    let conn;

    console.log({
      // Artwork
      id: submissionId,
      status,
      // Artist Email
      artistEmail,
      subject,
      htmlContent,
    });

    try {
      conn = await pool.getConnection();
      const queryString =
        "UPDATE `submissions` SET `status`= ? " +
        "WHERE `id`=?";
      /**
       * @return {SubmissionDetails}
       */
      const { affectedRows } = await pool.query(queryString, [
        status,
        submissionId,
      ]);

      conn.end();

      if(subject !== "DO NOT SEND") {
        const emailResult = await sendMail(artistEmail, subject, htmlContent);
        console.log({emailResult});
        return res.sendStatus(202);
      }
      res.sendStatus(200);
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

export default router;
