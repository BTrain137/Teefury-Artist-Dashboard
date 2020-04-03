import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { secret } from "../../../services/jwtConfig.js";

const router = express.Router();

router.post("/register-user", (req, res, next) => {
  passport.authenticate("register", (err, user, info) => {
    if (err) return next(err);

    req.login(user, err => {
      if (err) return next(err);

      return res.status(200).send({ message: "user created" });
    });
  })(req, res, next);
});

router.post("/login-user", (req, res, next) => {
  passport.authenticate("login", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      if (info.message === "Incorrect Password") {
        return res.status(401).send(info.message);
      } else {
        return res.status(403).send(info.message);
      }
    }

    req.login(user, err => {
      if (err) return next(err);

      const token = jwt.sign({ id: user.id, email: user.email }, secret, {
        expiresIn: 60 * 60
      });
      return res.status(200).send({
        auth: true,
        token,
        message: "user found & logged in"
      });
    });
  })(req, res, next);
});

router.get("/artist-profile", passport.authenticate("jwt"), (req, res) => {
  res.status(200).send({
    message: "artist found in db",
    isAuth: req.isAuthenticated()
  });
});

export default router;

