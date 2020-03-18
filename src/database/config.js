import { createPool } from "mariadb";
const { DB_HOST, DB_USER, DB_PASSWORD } = process.env;

export default createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  connectionLimit: 5
});
