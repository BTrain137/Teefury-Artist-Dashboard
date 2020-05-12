import express from "express";
import passport from "passport";
import pool from "../../../database/connection";

/**
 * Database quires return an array. Even if 1 item exist.
 * @typedef {{
 *   dbRowId:Number,
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
    const { startAt, maxDisplay } = req.body;
    const defaultStartAt = startAt ? startAt : 1;
    const defaultMax = maxDisplay ? maxDisplay : 1000;

    let conn;

    try {
      conn = await pool.getConnection();
      const queryString =
        "SELECT `id` as `dbRowId`, `order_created_at`, `order`, `product_title`, " +
        "`vendor`, `product_type`, `order_id` as `commissions_amount`, `commissions_paid` " +
        "FROM `orders` " +
        "LIMIT " +
        defaultStartAt +
        "," +
        defaultMax;

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

router.put(
  "/commissions/update",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { dbRowIds, isPaid, startAt } = req.body;
    const defaultStartAt = startAt ? startAt : 0;

    let ids = "`id`=" + dbRowIds.shift();

    if (dbRowIds.length > 0) {
      ids += dbRowIds
        .map((id) => {
          return " OR `id`=" + id;
        })
        .join("");
    }

    let conn;
    try {
      conn = await pool.getConnection();
      const queryUpdate =
        "UPDATE `orders` SET `commissions_paid`=? WHERE (" + ids + ");";

      const { affectedRows } = await pool.query(queryUpdate, [isPaid]);

      const queryString =
        "SELECT `id` as `dbRowId`, `order_created_at`, `order`, `product_title`, " +
        "`vendor`, `product_type`, `order_id` as `commissions_amount`, `commissions_paid` " +
        "FROM `orders` " +
        "LIMIT " +
        defaultStartAt +
        ",100";

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

router.post(
  "/commissions/dates",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { startAt, startDate, endDate, maxDisplay } = req.body;
    const defaultMax = maxDisplay ? maxDisplay : 1000;
    // const defaultStartAt = startAt ? startAt * defaultMax : 0;
    let conn;

    try {
      conn = await pool.getConnection();
      let queryString =
        "SELECT `id` as `dbRowId`, `order_created_at`, `order`, `product_title`, " +
        "`vendor`, `product_type`, `order_id` as `commissions_amount`, `commissions_paid` " +
        "FROM `orders` ";

      if (startDate && endDate) {
        queryString +=
          "WHERE `order_created_at` BETWEEN '" +
          startDate +
          "' AND '" +
          endDate +
          "' ";
      }

      // queryString += "LIMIT " + defaultStartAt + "," + defaultMax;
      queryString += "LIMIT 0," + defaultMax;

      /**
       * @return {CommissionsDetails[]}
       */
      const commissionsDetailsArr = await pool.query(queryString);
      conn.end();

      res.status(200).json({ commissionsDetailsArr });
      // res.sendStatus(200)
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

router.get(
  "/commissions/payouts",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString = "SELECT * FROM payouts";

      const commissionsPayouts = await pool.query(queryString);
      conn.end();

      res.status(200).json({ commissionsPayouts });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

router.post(
  "/commissions/payout",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { rowData } = req.body;
    const { commissions_payout, product_type } = rowData;
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString =
        "INSERT INTO `payouts` (`product_type`, `commissions_payout`) VALUES (?,?)";
      const queryValue = [product_type, commissions_payout];

      const result = await pool.query(queryString, queryValue);
      conn.end();

      rowData.id = result.insertId;

      res.status(200).json({ tableRowData: rowData });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

router.put(
  "/commissions/payout",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { rowData } = req.body;
    const { id, product_type, commissions_payout } = rowData;
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString =
        "UPDATE `payouts` SET `product_type`=?, `commissions_payout`=? WHERE `id`=?";
      const queryValue = [product_type, commissions_payout, id];

      const { affectedRows } = await pool.query(queryString, queryValue);
      conn.end();

      res.status(200).json({ tableRowData: rowData });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

router.delete(
  "/commissions/payout",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { rowData } = req.body;
    const { id } = rowData;
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString = "INSERT  WHERE `id`=?";

      const result = await pool.query(queryString, [id]);
      conn.end();

      console.log(result);

      res.status(200).json({ tableRowData: rowData });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

export default router;
