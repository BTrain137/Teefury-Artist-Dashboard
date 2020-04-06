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
  usernameField: "contactEmail",
  passwordField: "password",
  passReqToCallback: true,
  session: false,
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
          "INSERT INTO `users` (`username_contact_email`, `password`) VALUES (?, ?)";
        await pool.query(queryString, [usernameField, hashedPassword]);

        const [
          user,
        ] = await pool.query(
          "SELECT `id`, `is_admin`, `username_contact_email` AS `contactEmail` " +
            "FROM `users`  WHERE `username_contact_email`=?",
          [usernameField]
        );

        conn.end();
        return done(null, user);
      } catch (error) {
        conn.end();
        if (error.code === "ER_DUP_ENTRY") {
          error.message = "User has already been taken.";
          error.status = 409;
        }
        done(error);
      }
    }
  )
);

const passLoginOpt = {
  usernameField: "contactEmail",
  passwordField: "password",
  session: false,
};

passport.use(
  "login",
  new LocalStrategy(passLoginOpt, async (usernameField, password, done) => {
    let conn;
    try {
      conn = await pool.getConnection();

      const [user] = await pool.query(
        "SELECT `id`, `is_admin`, `password`, " +
          "`username_contact_email` AS `contactEmail` " +
          "FROM `users` WHERE `username_contact_email`=?",
        [usernameField]
      );

      if (!user) {
        conn.end();
        return done(null, false, {
          message: "User Does Not Exist.",
          status: 404,
        });
      }

      const doesPasswordMatch = await bcrypt.compare(
        password,
        user.password.toString("utf-8")
      );

      if (!doesPasswordMatch) {
        conn.end();
        return done(null, false, {
          message: "Incorrect Password",
          status: 401,
        });
      }

      conn.end();
      return done(null, user);
    } catch (error) {
      conn.end();
      if (error.code === "ER_DUP_ENTRY") {
        error.message = "User has already been taken";
        error.status = 409;
      } else {
        console.log("error.message: ", error.message);
        error.status = 500;
      }
      done(error);
    }
  })
);

const JWTOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: jwtSecret.secret,
};

passport.use(
  "jwt",
  new JWTStrategy(JWTOpts, async (jwt_payload, done) => {
    const { id } = jwt_payload;
    let conn;
    try {
      conn = await pool.getConnection();

      const [user] = await pool.query(
        "SELECT `id`, `is_admin`, " +
          "`username_contact_email` AS `contactEmail` " +
          "FROM `users` WHERE `id`=?",
        [id]
      );

      if (user) {
        conn.end();
        done(null, { ...user });
      } else {
        // 401 Unauthorized would be sent to user
        conn.end();
        done(null, false);
      }
    } catch (error) {
      conn.end();
      done(error);
    }
  })
);
