import "./config.js";
import express from "express";
import cors from "cors";
import logger from "morgan";
import helmet from "helmet";
import path from "path";
import passport from "passport";
import routes from "./routes";
import "./services/passport.js";
import Media from "./services/media.js";

const app = express();
const { NODE_ENV, PORT, DEBUG } = process.env;
const port = PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
if (DEBUG) app.use(logger("dev"));

// API Routes
app.use(routes);

// Cron Jobs
require("./services/cron");

app.use("/public", express.static(path.join(__dirname, "../../public")));

// Art files submitted by artist
// /api/art-submissions/<ArtistName>/imageFile.psd
const submissionsDirectory =
  NODE_ENV === "stage"
    ? "../../artist-dashboard/source/art-submissions"
    : "../../art-submissions";
app.use("/api/art-submissions", [
  // passport.authenticate("jwt-submissions"),
  express.static(path.join(__dirname, submissionsDirectory)),
]);

// /api/art-submissions-thumb/?src=/<ArtistName/imageFile.jpg&w=80
app.get("/api/art-submissions-thumb", (req, res) => {
  if (req.query.src) {
    let image = new Media(req.query.src);
    image.thumb(req, res);
  } else {
    res.sendStatus(403);
  }
});

app.use((error, req, res, next) => {
  if (DEBUG) {
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

  if (!error.status || error.status === 500) {
    error.message = "We are experiencing some issues please check again later.";
    // TODO: Sent an alert to dev to check why there is a 500 error
  }

  res.status(error.status || 500).json({
    status: error.status,
    message: error.message,
  });
});

// Serve React In Production
if (NODE_ENV === "production" || NODE_ENV === "stage") {
  app.use(express.static(path.join(__dirname, "../../client/build")));
  app.get("*", function (_, res) {
    res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
  });
}

app.listen(port, () => console.log(`http://localhost:${port}`));

export default app;
