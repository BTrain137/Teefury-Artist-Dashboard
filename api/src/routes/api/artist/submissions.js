import fs from "fs";
import express from "express";
import multer from "multer";
import { cleanFileName } from "../../../utils/cleanData";
import passport from "passport";

const router = express.Router();
const FILE_DIRECTORY = "submissions";
const upload = multer({
  dest: FILE_DIRECTORY,
});

// Single File
router.post(
  "/submit-art-file",
  upload.single("artFile"),
  passport.authenticate("jwt"),
  async (req, res, next) => {
    const { originalname, path: oldSubmissionPath } = req.file;
    const { artistName } = req.user;
    const newPath = `${FILE_DIRECTORY}/${artistName}/${Date.now()}_${cleanFileName(
      originalname
    )}`;

    try {
      fs.renameSync(oldSubmissionPath, newPath);
      res.json({
        field: req.body,
        image: req.file,
        newPath,
        message: "file uploaded!",
      });
    } catch (error) {
      next(error);
    }
  }
);

const cpUpload = upload.fields([
  { name: "artFile", maxCount: 1 },
  { name: "previewArt", maxCount: 1 },
]);

//Upload multiple files
router.post(
  "/submit-artwork",
  passport.authenticate("jwt"),
  cpUpload,
  async (req, res, next) => {
    const { artistName, title, description } = req.body;
    const [artFile] = req.files["artFile"];
    const [previewArt] = req.files["previewArt"];
    const artistDirectory = `${FILE_DIRECTORY}/${artistName}`
    
    // Create Artist Directory if not exist
    !fs.existsSync(artistDirectory) && fs.mkdirSync(artistDirectory);

    const artFileNewPath = `${artistDirectory}/${Date.now()}_${cleanFileName(
      artFile.originalname
    )}`;
    const previewArtNewPath = `${artistDirectory}/${Date.now()}_${cleanFileName(
      previewArt.originalname
    )}`;

    const submissionDetails = {
      artistName,
      title,
      description,
      artFile: artFileNewPath,
      previewArt: previewArtNewPath,
    };

    try {
      fs.renameSync(artFile.path, artFileNewPath);
      fs.renameSync(previewArt.path, previewArtNewPath);

      res.status(200).json({ submissionDetails });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
