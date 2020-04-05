import pool from "./connection.js";
let conn;

const init = function () {
  return new Promise(async (resolve, reject) => {
    try {
      conn = await pool.getConnection();

      //Check if database exist
      const rows = await pool.query(
        "SELECT SCHEMA_NAME   FROM INFORMATION_SCHEMA.SCHEMATA  WHERE SCHEMA_NAME = 'artist_dashboard'"
      );
      console.log("rows[0].SCHEMA_NAME", rows[0].SCHEMA_NAME);

      // Insert
      const insert = await pool.query(
        "INSERT INTO `artist_profile` (`first_name`, `last_name`, `artist_name`, `phone`, `username_contact_email`, `paypal_email`, `social_facebook`, `social_instagram`, `social_twitter`, `international`) " +
          "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          "Tom",
          "Thomas",
          "locoMotive",
          "",
          "tom@email.com",
          "tom@email.com",
          "",
          "",
          "",
          true,
        ]
      );
      // console.log(insert); // { affectedRows: 1, insertId: 1, warningStatus: 0 }

      setTimeout(
        async (arr) => {
          // Update
          const update = await pool.query(
            "UPDATE `artist_profile` SET first_name=? WHERE artist_name=?",
            arr
          );
          resolve(update);
        },
        5000,
        ["Henry", "locoMotive"]
      );
    } catch (error) {
      console.log("error");
      reject(error);
    }
  });
};

// init()
//   .then(results => {
//     console.log(results); // { affectedRows: 1, insertId: 0, warningStatus: 0 }
//     console.log("connection end");
//     conn.end();
//   })
//   .catch(err => {
//     console.log(err);
//     // console.log("err.message", err.message);
//     // console.log("err.code", err.code);
//     // console.log("connection end");
//     conn.end();

//     // Duplicate Error Code.
//     // errno: 1062,
//     // sqlState: '23000',
//     // code: 'ER_DUP_ENTRY'
//   });

const login = function () {
  return new Promise(async function (resolve, reject) {
    try {
      conn = await pool.getConnection();
      const usernameField = "btran@teefury.com";

      const [
        user,
      ] = await pool.query(
        "SELECT `id`, `username_contact_email`, `password` FROM `users`  WHERE `username_contact_email`=?",
        [usernameField]
      );

      const [
        artist,
      ] = await pool.query(
        "SELECT `artist_name`, `first_name`, `last_name`, `username_contact_email` AS `email` FROM `artist_profile` WHERE `username_contact_email`=?",
        // "SELECT `artist_name`, `first_name`, `last_name` FROM `artist_profile` WHERE `username_contact_email`=?",
        [usernameField]
      );

      console.log(user);
      resolve(artist);
    } catch (error) {
      reject(error);
    }
  });
};

login()
  .then((results) => {
    console.log("---------------------------------");
    console.log(results);
    console.log("connection end");
    console.log("---------------------------------");
    conn.end();
  })
  .catch((err) => {
    // console.log(err);
    console.log("err.message", err.message);
    console.log("err.code", err.code);
    console.log("connection end");
    conn.end();
  });
