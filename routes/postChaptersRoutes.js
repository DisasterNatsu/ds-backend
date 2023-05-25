import express from "express";
import ChapterMiddleWare from "../middleware/chapterUpload.js";
import { unZip } from "../middleware/unZip.js";
import { postChapter } from "../controllers/postChapter.js";
import { uploadToBackBlaze } from "../middleware/backblazeChapter.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { ProcessImages } from "../middleware/ImageProcessing.js";

const Router = express.Router();

Router.post(
  "/",
  adminAuth,
  ChapterMiddleWare,
  unZip,
  ProcessImages,
  uploadToBackBlaze,
  postChapter
);

export default Router;
