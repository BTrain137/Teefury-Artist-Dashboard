import express from "express";
import passport from "passport";
import pool from "../../../database/connection";

/**
 * Database quires return an array. Even if 1 item exist.
 * @typedef {{
 *   order:String,
 *   order_created_at:String,
 *   product_title:String,
 *   vendor:String,
 *   product_type:String,
 *   commissions_paid:Boolean,
 * }} CommissionsDetails
 *
 */

const router = express.Router();

router.post(
  "/commissions",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { startAt } = req.body;
    const defaultStartAt = startAt ? startAt : 1;

    let conn;

    try {
      conn = await pool.getConnection();
      const queryString =
        "SELECT `order_created_at`, `order`, `product_title`, " +
        "`vendor`, `product_type`, `order_id` as `commissions_amount`, `commissions_paid` " +
        "FROM `orders` " +
        "LIMIT " +
        defaultStartAt +
        ",100 ";

      /**
       * @return {CommissionsDetails[]}
       */
      const commissionsDetailsArr = await pool.query(queryString);
      conn.end();

      res.status(200).json({ commissionsDetailsArr });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

export default router;
