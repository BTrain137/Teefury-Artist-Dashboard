import "./config.js";
import express from "express";
import cors from "cors";
import logger from "morgan";
import helmet from "helmet";
import path from 'path';
import routes from "./routes";
import "./database";

const app = express();
const { NODE_ENV, PORT, DEBUG, } = process.env;
const port = PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (DEBUG) app.use(logger("dev"));

// API Routes
app.use(routes);

// Serve React In Production
if (NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", function(_, res) {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

app.listen(port, () => console.log(`http://localhost:${port}`));

export default app;
