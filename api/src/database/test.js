import pool from "./connection.js";

const asyncFunction = async () => {
  let conn;
  console.log("hit");
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT 1 as val");
    console.log(rows); //[ {val: 1}, meta: ... ]

    const res = await conn.query("INSERT INTO myTable value (?, ?)", [
      1,
      "mariadb"
    ]);
    return res; // { affectedRows: 1, insertId: 1, warningStatus: 0 }
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.end();
  }
}

asyncFunction();
