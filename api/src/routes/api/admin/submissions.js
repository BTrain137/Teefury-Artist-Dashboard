import fs from "fs";
import path from "path";
import express from "express";
import passport from "passport";
import pool from "../../../database/connection";

/**
 * Database queries return an array. Even if 1 item exists.
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
 * @typedef {{
 *   firstName:String,
 *   lastName:String,
 *   artFile:String,
 *   artistName:String,
 *   artistEmail:String,
 *   description:String,
 *   previewArt:String,
 *   status:String,
 *   title:String,
 * }} SubmissionDetailsEdit
 *
 */

const router = express.Router();

router.get(
  "/submissions/:status",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    let conn;
    const { status } = req.params;

    try {
      conn = await pool.getConnection();
      let queryString =
        "SELECT `id`, `artist_name` AS `artistName`, `title`, `description`, " +
        "`art_file` AS `artFile`, `preview_art` AS `previewArt`, `status`, " +
        "`created_at` AS `createdAt` FROM `submissions` ";

      if (status) {
        queryString += "WHERE `status`='" + status + "' ";
      }

      queryString += "ORDER BY `created_at` DESC ";

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
        "SELECT `submissions`.`id`, `submissions`.`username_contact_email` AS `artistEmail`, " +
        "`artist_profile`.`first_name` AS `firstName`, `artist_profile`.`last_name` AS `lastName`, " +
        "`submissions`.`artist_name` AS `artistName`, `submissions`.`title`, `description`, " +
        "`submissions`.`art_file` AS `artFile`, `submissions`.`preview_art` AS `previewArt`, `submissions`.`status`, " +
        "`submissions`.`created_at` AS `createdAt` " +
        "FROM `submissions` INNER JOIN `artist_profile` " +
        "ON `submissions`.`username_contact_email`=`artist_profile`.`username_contact_email` " +
        "WHERE `submissions`.`id`=?";

      /**
       * @return {SubmissionDetailsEdit}
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
  async (req, res, next) => {
    const { id: submissionId, status } = req.body;
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString =
        "UPDATE `submissions` SET `status` = ? WHERE `id` = ?";

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

// Update Title/Description/Submission Status
router.put(
  "/submissions",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { title, description, status, id } = req.body;
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString =
        "UPDATE `submissions` " +
        "SET `title` = ?, `description` = ?, `status` = ? " +
        "WHERE `id` = ?";

      const { affectedRows } = await pool.query(queryString, [
        title,
        description,
        status,
        id,
      ]);

      conn.end();

      res.sendStatus(202);
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

// Delete declined submissions' art file
router.delete(
  "/submissions/declined-all-art-files",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    let conn;

    try {
      conn = await pool.getConnection();

      const querySelect =
        "SELECT `id`, `art_file` FROM `submissions` " +
        "WHERE `status` = 'DECLINED' AND `art_file` != ''";

      const allDecSubArr = await pool.query(querySelect);

      for (let i = 0; i < allDecSubArr.length; i++) {
        const { id, art_file } = allDecSubArr[i];
        if (art_file) {
          // Delete Art File
          try {
            const artDiskLocation = path.join(
              __dirname,
              art_file.replace("/api/", "../../../../../")
            );
            fs.unlinkSync(artDiskLocation);
            console.log({ artDiskLocation });
          } catch (error) {
            console.log("File Not Found");
          }

          // Update Database
          const queryUpdate =
            "UPDATE `submissions` SET `art_file` = ? WHERE `id` = ?";
          const { affectedRows } = await pool.query(queryUpdate, ["", id]);
          console.log({ affectedRows });
        }
      }

      conn.end();
      res.sendStatus(202);
    } catch (error) {
      console.log(error);
      conn.end();
      next(error);
    }
  }
);

// Delete declined submissions' art file by id
router.delete(
  "/submissions/declined-art-file/:id",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { id } = req.params;
    let conn;

    try {
      conn = await pool.getConnection();

      const querySelect =
        "SELECT `art_file` FROM `submissions` " +
        "WHERE `id` = ? AND `art_file` != ''";

      const allDecSubArr = await pool.query(querySelect, [id]);
      console.log(allDecSubArr);

      for (let i = 0; i < allDecSubArr.length; i++) {
        const { art_file } = allDecSubArr[i];
        if (art_file) {
          // Delete Art File
          try {
            const artDiskLocation = path.join(
              __dirname,
              art_file.replace("/api/", "../../../../../")
            );
            fs.unlinkSync(artDiskLocation);
            console.log({ artDiskLocation });
          } catch (error) {
            console.log("File Not Found");
          }

          // Update Database
          const queryUpdate =
            "UPDATE `submissions` SET `art_file` = ? WHERE `id` = ?";
          const { affectedRows } = await pool.query(queryUpdate, ["", id]);
          console.log({ affectedRows });
        }
      }

      conn.end();
      res.sendStatus(202);
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

export default router;
