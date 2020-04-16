import fs from "fs";
import express from "express";
import multer from "multer";
import { cleanFileName } from "../../../utils/cleanData";

const router = express.Router();
const upload = multer({
  dest: "public/artist/submissions",
});

// Single File
router.post(
  "/submit-art-file",
  upload.single("artFile"),
  async (req, res, next) => {
    const { originalname, path: oldSubmissionPath } = req.file;
    const newPath = `public/artist/submissions/${Date.now()}_${cleanFileName(
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

  const artFileNewPath = `public/artist/submissions/${Date.now()}_${cleanFileName(
    artFile.originalname
  )}`;
  const previewArtNewPath = `public/artist/submissions/${Date.now()}_${cleanFileName(
    previewArt.originalname
  )}`;

  const artWorkObj = {
    artistName,
    title,
    description,
    artFile: artFileNewPath,
    previewArt: previewArtNewPath,
  }

  console.log(artWorkObj);

  try {
    fs.renameSync(artFile.path, artFileNewPath);
    fs.renameSync(previewArt.path, previewArtNewPath);

    res.status(200).json({
      // body: req.body,
      // files: req.files,
      artFileNewPath,
      previewArtNewPath,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
