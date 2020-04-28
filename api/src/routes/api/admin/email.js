import express from "express";
import passport from "passport";
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
      artistEmail,
      subject,
      htmlContent,
    } = req.body;

    try {
      await sendMail(artistEmail, subject, htmlContent);
      res.sendStatus(202);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
