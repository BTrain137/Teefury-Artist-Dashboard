import { createPool } from "mariadb";
const { DATABASEHOST, DATABASEUSER, DATABASEPASSWORD } = process.env;

export default createPool({
  host: DATABASEHOST,
  user: DATABASEUSER,
  password: DATABASEPASSWORD,
  connectionLimit: 5
});
