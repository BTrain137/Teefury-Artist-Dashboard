import fs from "fs";
import express from "express";
import multer from "multer";
import { cleanFileName } from "../../../utils/cleanData";

const router = express.Router();
const FILE_DIRECTORY = "public/artist/submissions";
const upload = multer({
  dest: FILE_DIRECTORY,
});

// Single File
router.post(
  "/submit-art-file",
  upload.single("artFile"),
  async (req, res, next) => {
    const { originalname, path: oldSubmissionPath } = req.file;
    const newPath = `${FILE_DIRECTORY}/${Date.now()}_${cleanFileName(
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
router.post("/submit-artwork", cpUpload, async (req, res, next) => {
  const { artistName, title, description } = req.body;
  const [artFile] = req.files["artFile"];
  const [previewArt] = req.files["previewArt"];

  const artFileNewPath = `${FILE_DIRECTORY}/${Date.now()}_${cleanFileName(
    artFile.originalname
  )}`;
  const previewArtNewPath = `${FILE_DIRECTORY}/${Date.now()}_${cleanFileName(
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
});

export default router;
