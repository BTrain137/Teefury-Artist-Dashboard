import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../../../database/connection";
import { secret, BCRYPT_SALT_ROUNDS } from "../../../services/jwtConfig.js";

const router = express.Router();

/**
 * Basic user information sent to the client after server logs user in.
 * @typedef {{
 *    artistName:String,
 *    firstName:String,
 *    lastName:String,
 *    contactEmail:String,
 *  }} BasicUserInfo
 */

/**
 * Login and Register share the same req.login strategies
 * If a new user signs up or logins they are checked if they have an artist account
 * Brand new users will need to create an artist account
 * Also for existing artist who already have an artist account but no user account
 *
 * @param  {Object} req   The request object from express
 * @param  {Object} user  The user object from passport
 * @param  {Object} next  The next function to move along errors for express
 * @return {Promise<{token:String, currentUser:BasicUserInfo }>}
 */

const reqLogin = function (req, user, next) {
  return new Promise(async function (resolve) {
    try {
      req.login(user, async (error) => {
        if (error) return next(error);
        const { contactEmail, id, is_admin } = user;
        let currentUser;

        if (!is_admin) {
          let conn;
          try {
            conn = await pool.getConnection();
            const [
              artist,
            ] = await pool.query(
              "SELECT `artist_name` AS `artistName`, " +
                "`first_name` AS `firstName`, " +
                "`last_name` AS `lastName`, " +
                "`username_contact_email` AS `contactEmail` " +
                "FROM `artist_profile` " +
                "WHERE `username_contact_email`=?",
              [contactEmail]
            );
            conn.end();
            if (artist) {
              currentUser = artist;
            }
            // If user signed up but did not create artist profile
            else {
              currentUser = {
                contactEmail,
              };
            }
          } catch (error) {
            conn.end();
            return next(error);
          }
        } else {
          // TODO: Set up admin
          currentUser = user;
        }

        const token = jwt.sign({ id, contactEmail, is_admin }, secret, {
          expiresIn: 60 * 60 * 24 * 90,
        });

        resolve({ token, currentUser });
      });
    } catch (error) {
      next(error);
    }
  });
};

router.post("/register-user", (req, res, next) => {
  passport.authenticate("register", async (err, user, info) => {
    if (err) return next(err);

    const { token, currentUser } = await reqLogin(req, user, next);

    res.status(200).json({
      auth: true,
      message: "User Created & Logged In",
      token,
      currentUser,
    });
  })(req, res, next);
});

router.post("/signin-user", (req, res, next) => {
  passport.authenticate("signin", async (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      const { status, message } = info;
      return res.status(status || 401).json({ status, message });
    }

    const { token, currentUser } = await reqLogin(req, user, next);

    res.status(200).send({
      auth: true,
      message: "User Found & Logged In",
      token,
      currentUser,
    });
  })(req, res, next);
});

router.put(
  "/update-user",
  passport.authenticate("jwt"),
  async (req, res, next) => {
    const { id, contactEmail: oldContactEmail } = req.user;
    const { password: newPassword, contactEmail: newContactEmail } = req.body;
    let conn;

    // TODO: rewrite this.
    // Rewrite may possibly be switching into Graphql
    try {
      conn = await pool.getConnection();

      // queryString will update for password and/or username
      let queryString = "UPDATE `users` SET";
      const insertArray = [];
      let hasContactEmailChanged =
        newContactEmail && newContactEmail !== oldContactEmail ? true : false;

      // If user POST but nothing to change
      if (!newPassword && !hasContactEmailChanged) {
        return res.sendStatus(304);
      }

      if (!!newPassword) {
        const hashedPassword = await bcrypt.hash(
          newPassword,
          BCRYPT_SALT_ROUNDS
        );
        queryString += " `password`=?";
        insertArray.push(hashedPassword);
      }

      queryString += !!newPassword && hasContactEmailChanged ? ", " : " ";

      if (hasContactEmailChanged) {
        queryString += "`username_contact_email`=? ";
        insertArray.push(newContactEmail);
      }

      queryString += "WHERE `id`=?";
      insertArray.push(id);

      // "UPDATE `users` SET `password`=? WHERE `id`=?"
      // "UPDATE `users` SET `username_contact_email`=? WHERE `id`=?"
      // "UPDATE `users` SET `password`=?, `username_contact_email`=? WHERE `id`=?"
      const { affectedRows } = await pool.query(queryString, insertArray);

      if (affectedRows > 1) {
        console.log(artistName, req.user);
      }

      // Once updated is complete need to query the database for the user
      const [user] = await pool.query(
        "SELECT `id`, `is_admin`, " +
          "`username_contact_email` AS `contactEmail` " +
          "FROM `users` WHERE `id`=?",
        [id]
      );

      // Update the artist table if contract email was changed
      if (!!newContactEmail) {
        const {
          affectedRows,
        } = await pool.query(
          "UPDATE `artist_profile` SET `username_contact_email`=?" +
            "WHERE `username_contact_email`=?",
          [newContactEmail, oldContactEmail]
        );

        if (affectedRows > 1) {
          console.log(artistName, req.user);
        }
      }
      conn.end();

      const { token, currentUser } = await reqLogin(req, user, next);

      res.status(200).json({
        auth: true,
        message: "User Updated & Logged In",
        token,
        currentUser,
      });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

router.delete(
  "/delete-user",
  passport.authenticate("jwt"),
  async (req, res, next) => {
    const { id, contactEmail } = req.user;
    try {
      let conn;
      conn = await pool.getConnection();
      const {
        affectedRows,
      } = await pool.query("DELETE FROM `users` WHERE `id`=?", [id]);
      conn.end();

      if (affectedRows > 1) {
        // TODO: Report why there are more than 1 items deleted
        console.log({ id, contactEmail });
      }

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
