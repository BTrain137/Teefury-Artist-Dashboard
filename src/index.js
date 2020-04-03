import "./config.js";
import express from "express";
import cors from "cors";
import logger from "morgan";
import helmet from "helmet";
import path from "path";
import passport from "passport"
import routes from "./routes";
import "./database";
import "./services/passport.js";

const app = express();
const { NODE_ENV, PORT } = process.env;
const port = PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
if (NODE_ENV === "development") app.use(logger("dev"));

// API Routes
app.use(routes);

app.use((error, req, res, next) => {
  if (NODE_ENV === "development") {
    console.log("-----------------------------------------------");
    console.log("Error status: ", error.status);
    console.log("Message: ", error.message);
    console.log("Header Sent: ", res.headersSent);
    console.log("Stack: ", error.stack);
    console.log("-----------------------------------------------");
  }

  if (res.headersSent) {
    return next(error);
  }

  res.status(error.status || 500).json({
    status: error.status,
    message: error.message
  });
});

// Serve React In Production
if (NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", function(_, res) {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

app.listen(port, () => console.log(`http://localhost:${port}`));

export default app;
