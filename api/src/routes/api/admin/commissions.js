import express from "express";
import passport from "passport";
import pool from "../../../database/connection";
import { cleanDate } from "../../../utils/cleanData";

/**
 * Database queries return an array. Even if 1 item exist.
 * @typedef {{
 *   dbRowId:Number,
 *   order:String,
 *   order_created_at:String,
 *   product_title:String,
 *   artist:String,
 *   product_type:String,
 *   is_commissions_paid:Boolean,
 *   is_international:Boolean,
 *   paypal_email:String
 * }} CommissionsDetails
 *
 * @typedef {{
 *  artist:String,
 *  product_type:String,
 *  quantity:Number,
 *  paidAmount:Number,
 *  unpaidAmount:Number
 * }}
 * 
 * @typedef {{
 *   id: Number,
 *   commissions_payout: String,
 *   product_type: String
 * }} CommissionsPayouts
 *
 */

const router = express.Router();

router.post(
  "/commissions",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { startDate, endDate } = req.body;
    let conn;

    try {
      conn = await pool.getConnection();
      let queryString =
        "SELECT `orders`.`id` AS `dbRowId`, `orders`.`order`, `orders`.`order_created_at`, `orders`.`product_title`, " +
        "`orders`.`vendor` AS `artist`, `orders`.`quantity`, `orders`.`product_type`, " +
        "`orders`.`commissions_amount`, `orders`.`is_commissions_paid`, " +
        "`artist_profile`.`paypal_email`, `artist_profile`.`is_international` " +
        "FROM `orders` INNER JOIN `artist_profile` ON `orders`.`vendor` = `artist_profile`.`artist_name` ";

      if (startDate && endDate) {
        queryString +=
          "WHERE `order_created_at` BETWEEN '" +
          startDate +
          " 00:00:00' AND '" +
          endDate +
          " 23:59:59' ";
      }

      queryString += "ORDER BY `order_created_at` DESC ";

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

router.post(
  "/commissions/by-artist",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { startDate, endDate } = req.body;
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString =
        "SELECT `artist`, `product`, `productType`, " +
        "SUM(`quantity`) AS `quantity`, SUM(`paidAmount`) AS `paidAmount`, " + 
        "SUM(`unpaidAmount`) AS `unpaidAmount` " +
        "FROM (SELECT `vendor` AS `artist`, `product_title` AS `product`, " +  "`product_type` AS `productType`, COUNT(`product_type`) AS `quantity`, " + 
        "IF(`is_commissions_paid`, `commissions_amount` * SUM(`quantity`), 0.00) AS `paidAmount`, " + 
        "IF(NOT `is_commissions_paid`, `commissions_amount` * SUM(`quantity`), 0.00) AS `unpaidAmount` " + 
        "FROM `orders` " +
        "WHERE `order_created_at` BETWEEN '" +
        startDate + 
        " 00:00:00' AND '" +
        endDate +
        " 23:59:59' " +
        "GROUP BY `vendor`, `product_title`, `product_type`, `commissions_amount`, `is_commissions_paid`) AS subTable " + 
        "GROUP BY `artist`, `product`, `productType`";

      /**
       * @return {CommissionsDetailsByArtist[]}
       */
      const commissionsDetailsByArtistArr = await pool.query(queryString);
      conn.end();

      res.status(200).json({ commissionsDetailsByArtistArr: commissionsDetailsByArtistArr });
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
    const { dbRowIds, isPaid, startDate, endDate } = req.body;

    const todaysDate = cleanDate();
    const start = startDate ? startDate : todaysDate;
    const end = endDate ? endDate : todaysDate;

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
        "UPDATE `orders` SET `is_commissions_paid`=? WHERE (" + ids + ");";

      const { affectedRows } = await pool.query(queryUpdate, [isPaid]);

      const queryString =
        "SELECT `id` as `dbRowId`, `order_created_at`, `order`, `product_title`, " +
        "`vendor`, `product_type`, `order_id` as `commissions_amount`, `is_commissions_paid` " +
        "FROM `orders` " +
        "WHERE `order_created_at` BETWEEN '" +
        start +
        " 00:00:00' AND '" +
        end +
        " 23:59:59' " +
        "ORDER BY `order_created_at` DESC ";

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

router.get(
  "/commissions/payouts",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString = "SELECT * FROM payouts";

      /**
       * @return {CommissionsPayouts[]}
       */
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

      /**
       * @return {CommissionsDetails}
       */
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

      res.status(200).json({ tableRowData: rowData });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

export default router;
