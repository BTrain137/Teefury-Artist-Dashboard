import bcrypt from "bcrypt";
import passport from "passport";
import jwtSecret from "./jwtConfig";
import pool from "../database/connection.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";

const BCRYPT_SALT_ROUNDS = 10;

passport.serializeUser((user, done) => {
  done(null, user);
});

const passRegisterOpt = {
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true,
  session: false
};

passport.use(
  "register",
  new LocalStrategy(
    passRegisterOpt,
    async (req, usernameField, passwordField, done) => {
      let conn;
      try {
        conn = await pool.getConnection();

        // TODO: Either find one and alert or have MariaDB alert not unique
        const hashedPassword = await bcrypt.hash(
          passwordField,
          BCRYPT_SALT_ROUNDS
        );

        const queryString =
          "INSERT INTO `user` (`email`, `password`) VALUES (?, ?)";
        await pool.query(queryString, [usernameField, hashedPassword]);

        const [
          user
        ] = await pool.query(
          "SELECT `id`, `email`, `password` FROM `user`  WHERE `email`=?",
          [usernameField]
        );

        conn.end();
        return done(null, user.id);
      } catch (error) {
        conn.end();
        if (error.code === "ER_DUP_ENTRY") {
          error.message = "User has already been taken";
          error.status = 409;
        }
        done(error);
      }
    }
  )
);

const passLoginOpt = {
  usernameField: "username",
  passwordField: "password",
  session: false
};

passport.use(
  "login",
  new LocalStrategy(passLoginOpt, async (usernameField, password, done) => {
    let conn;
    try {
      conn = await pool.getConnection();

      const [
        user
      ] = await pool.query(
        "SELECT `id`, `email`, `password` FROM `user`  WHERE `email`=?",
        [usernameField]
      );

      if (!user) {
        return done(null, false, { message: "User Not Found" });
      }

      const doesPasswordMatch = await bcrypt.compare(
        password,
        user.password.toString()
      );

      if (!doesPasswordMatch) {
        return done(null, false, { message: "Incorrect Password" });
      }

      conn.end();
      return done(null, user);
    } catch (error) {
      conn.end();
      done(error);
    }
  })
);

const JWTOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: jwtSecret.secret
};

passport.use(
  "jwt",
  new JWTStrategy(JWTOpts, async (jwt_payload, done) => {
    // jwt_payload is decoded by JWTStrategy with the JWTOpts options object
    const [
      user
    ] = await pool.query("SELECT `id`, `email` FROM `user` WHERE `id`=?", [
      jwt_payload.id
    ]);

    if (user) {
      done(null, user);
    } else {
      // 401 Unauthorized would be sent to user
      done(null, false);
    }
  })
);

passport.use(
  "jwt-artist-profile",
  new JWTStrategy(JWTOpts, async (jwt_payload, done) => {
    const [
      user
    ] = await pool.query("SELECT `id`, `email` FROM `user` WHERE `id`=?", [
      jwt_payload.id
    ]);

    if (user) {
      done(null, user);
    } else {
      // 401 Unauthorized would be sent to user
      done(null, false);
    }
  })
);
