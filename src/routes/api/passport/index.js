import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import pool from "../../../database/connection";
import { secret } from "../../../services/jwtConfig.js";

const router = express.Router();

router.post("/register-user", (req, res, next) => {
  passport.authenticate("register", (err, user, info) => {
    if (err) return next(err);

    req.login(user, (err) => {
      if (err) return next(err);

      const token = jwt.sign({ id: user.id, email: user.email }, secret, {
        expiresIn: 60 * 60,
      });

      res.status(200).json({
        auth: true,
        message: "User Created & Logged In",
        token,
      });
    });
  })(req, res, next);
});

router.post("/login-user", (req, res, next) => {
  passport.authenticate("login", (err, user, info) => {
    if (err) return next(err);

    if (!user) return res.status(info.status).send(info.message);

    req.login(user, async (err) => {
      if (err) return next(err);
      const { email, id, is_admin } = user;
      let currentUser;

      if (!is_admin) {
        const [
          artist,
        ] = await pool.query(
          "SELECT `artist_name` AS `artistName`, " +
            "`first_name` AS `firstName`, " +
            "`last_name` AS `lastName`, " +
            "`username_contact_email` AS `email` " +
            "FROM `artist_profile` " +
            "WHERE `username_contact_email`=?",
          [email]
        );
        currentUser = artist
      }
      else {
        currentUser = user;
      }

      const token = jwt.sign({ id, email }, secret, {
        expiresIn: 60 * 60 * 24 * 90,
      });
      return res.status(200).send({
        auth: true,
        message: "User Found & Logged In",
        token,
        currentUser,
      });
    });
  })(req, res, next);
});

router.get("/artist-profile", passport.authenticate("jwt"), (req, res) => {
  res.status(200).send({
    message: "artist found in db",
    isAuth: req.isAuthenticated(),
  });
});

export default router;
