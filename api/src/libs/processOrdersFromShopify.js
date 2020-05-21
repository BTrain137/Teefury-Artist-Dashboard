import getOrdersFromShopify from "../libs/getOrdersFromShopify";
import pool from "../database/connection.js";
import {
  cleanDateAndTime,
  cleanIDGraphql,
} from "../utils/cleanData";
import consoleColor from "../utils/consoleColor";

const { NODE_ENV } = process.env;

/**
 * @summary Graphql does not stop at time specified but keeps going. This method stops the while loop from keep going
 * @param  {Array}  edges   Shopify cursor to paginate
 * @param  {String} dateNow The current date query for.
 * @param  {String} start   The start time in 24 hours format
 * @param  {String} end     The end time in 24 hours format
 * @return {Boolean} Cursor or Null to stop while loop
 */
const didGraphReturnPastHourMark = (edges, dateNow, start, end) => {
  const lastOrder = edges[edges.length - 1];
  const { createdAt } = lastOrder;
  const [data, time] = cleanDateAndTime(createdAt).split(" ");
  const [hour] = time.split(":");
  if (+hour > +end) {
    return true;
  } else {
    return false;
  }
};

/**
 * @summary Extract Line property from lineItems
 * @param  {Array<{node: { title:String, sku:String, vendor:String, quantity:String, product:{ productType:String} }}>} lineItems
 * @return {Array<{productTitle:String, variantSku:String, vendor:String, quantity:Number, productType:String }>}
 */

const extractLineItemProperty = (lineItems) => {
  const { edges } = lineItems;
  return edges.map(({ node }) => {
    const { title, sku, vendor, quantity, product } = node;

    const productType = product ? product.productType : "Product Deleted";

    return {
      productTitle: title,
      variantSku: sku,
      vendor,
      quantity,
      productType,
    };
  });
};

/**
 * @summary Process shopify orders
 * @param  {Array} edges  Orders
 * @return {Promise<String>} Cursor for the next set of items
 */
const storeEdgesIntoDatabase = function (edges) {
  return new Promise(async function (resolve, reject) {
    let conn;
    try {
      const orderLength = edges.length;
      const lastEdge = orderLength - 1;
      conn = await pool.getConnection();

      for (let i = 0; i < orderLength; i++) {
        const {
          node: { id: orderId, createdAt, name, lineItems },
        } = edges[i];

        const [
          queryResult,
        ] = await pool.query(
          "SELECT EXISTS(SELECT * FROM `orders` WHERE `order`=?)",
          [name]
        );

        const hasOrderBeenStored = Object.values(queryResult)[0];

        if (hasOrderBeenStored) {
          if (NODE_ENV === "development") {
            console.log({
              name,
              orderId,
              createdAt,
              lineItems,
            });
            consoleColor(
              cleanIDGraphql(orderId),
              "==============Skip==============="
            );
          }
          if (i === lastEdge) {
            conn.end();
            return resolve(edges[lastEdge].cursor);
          }
          continue;
        }

        const lineItemArr = extractLineItemProperty(lineItems);
        const lineItemLength = lineItemArr.length;
        for (let j = 0; j < lineItemLength; j++) {
          const {
            productTitle,
            variantSku,
            quantity,
            vendor,
            productType,
          } = lineItemArr[j];

          let commissionsPayout = null;

          if (productType !== "Product Deleted") {
            const [
              commissionsAmount,
            ] = await pool.query(
              "SELECT `commissions_payout` FROM `payouts` WHERE `product_type`=?",
              [productType]
            );
            
            if(!commissionsAmount) {
              console.log("==============================");
              console.error(
                `${name}, ${cleanIDGraphql(
                  orderId
                )}, ${cleanDateAndTime(
                  createdAt
                )}, ${productTitle}, ${variantSku}, ${vendor}, ${quantity}, ${productType}, ${commissionsPayout}`
              );
              return reject("Product Type Not Found")
            }
            commissionsPayout = commissionsAmount.commissions_payout;
          }

          const queryString =
            "INSERT INTO `orders` (`order`, " +
            "`order_id`, `order_created_at`, `product_title`, `variant_sku`, " +
            "`vendor`, `quantity`, `product_type`, `commissions_amount`) " +
            "VALUES (?,?,?,?,?,?,?,?,?)";

          const queryValue = [
            name,
            cleanIDGraphql(orderId),
            cleanDateAndTime(createdAt),
            productTitle,
            variantSku,
            vendor,
            quantity,
            productType,
            commissionsPayout,
          ];

          const { insertId } = await pool.query(queryString, queryValue);

          if (NODE_ENV === "development") {
            consoleColor(
              cleanIDGraphql(orderId),
              `${insertId}: ${name}, ${cleanIDGraphql(
                orderId
              )}, ${cleanDateAndTime(
                createdAt
              )}, ${productTitle}, ${variantSku}, ${vendor}, ${quantity}, ${productType}, ${commissionsPayout}`
            );
          }
        }
      }

      conn.end();
      resolve(edges[lastEdge].cursor);
    } catch (error) {
      if (conn) conn.end();
      reject(error);
    }
  });
};

/**
 * @description Process orders from shopify. Takes order data in via graphql
 *              Loops through the line items and gets its commission payouts from another table
 *              Then stores each line item in the database
 * @param  {String} date      The date to process the 
 * @param  {String} startTime 
 * @param  {String} endTime
 * 
 */

const main = async (date, startTime, endTime) => {
  let cursor = "";
  let keepLooping = true;
  try {
    while (keepLooping) {
      const {
        orders: { pageInfo, edges },
      } = await getOrdersFromShopify(cursor, date, startTime, endTime);
      const hasNextPage = pageInfo.hasNextPage;
      cursor = await storeEdgesIntoDatabase(edges);

      if (!hasNextPage || !cursor) {
        keepLooping = false;
        break;
      }
    }

    return "Done";
  } catch (error) {
    throw error;
  }
};

export default main;
