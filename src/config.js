import  path from "path";
const { NODE_ENV } = process.env;
let keys = "";

if (NODE_ENV === "dev") {
  keys = require("dotenv").config({
    path: path.join(__dirname, "../.env.dev")
  });
}
else if (NODE_ENV === "production") {
  keys = require("dotenv").config({
    path: path.join(__dirname, "../.env.production")
  });
}

module.exports = keys;
