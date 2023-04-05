import express from "express";
import { CoversUpload } from "../middleware/coverFile.js";
import { uploadToBackBlaze } from "../middleware/backblazeCover.js";
import { doesExist } from "../middleware/doesExist.js";
import { postComic } from "../controllers/postComic.js";

const Router = express.Router();

Router.post("/new", CoversUpload, doesExist, uploadToBackBlaze, postComic);
Router.post("/change-cover", CoversUpload, doesExist, uploadToBackBlaze);

export default Router;
