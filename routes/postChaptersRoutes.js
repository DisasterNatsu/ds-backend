import express from "express";
import ChapterMiddleWare from "../middleware/chapterUpload.js";
import { unZip } from "../middleware/unZip.js";
import { postChapter } from "../controllers/postChapter.js";
import { uploadToBackBlaze } from "../middleware/backblazeChapter.js";

const Router = express.Router();

Router.post("/", ChapterMiddleWare, unZip, uploadToBackBlaze, postChapter);

export default Router;
