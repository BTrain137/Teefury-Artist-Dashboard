import { createPool } from "mariadb";
const { HOST, USER, PASSWORD } = process.env;

export default createPool({
  host: HOST,
  user: USER,
  password: PASSWORD,
  connectionLimit: 5
});
