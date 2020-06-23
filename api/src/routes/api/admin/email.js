import express from "express";
import passport from "passport";
import pool from "../../../database/connection";
import { sendMail } from "../../../services/email";

/**
 * Database queries return an array. Even if 1 item exist.
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

// Update Email Status and Content, and Send Email
router.put(
  "/email",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    let conn;
    const { artistEmail, subject, htmlContent, emailStatus, id } = req.body;
    const emailContent = `to: ${artistEmail}<br/>subject: ${subject}<br/>${htmlContent}`;

    try {
      conn = await pool.getConnection();
      const queryString =
        "UPDATE `submissions` " +
        "SET `email_status` = ?, `email_content` = ? " +
        "WHERE `id` = ?";

      const { affectedRows } = await pool.query(queryString, [
        emailStatus,
        emailContent,
        id,
      ]);

      await sendMail(artistEmail, subject, htmlContent);
      conn.end();

      res.sendStatus(202);
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

export default router;
