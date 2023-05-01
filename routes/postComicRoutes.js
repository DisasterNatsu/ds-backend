import express from "express";
import { CoversUpload } from "../middleware/coverFile.js";
import { uploadToBackBlaze } from "../middleware/backblazeCover.js";
import { coverChange } from "../middleware/coverChangeBackblaze.js";
import { doesExist } from "../middleware/doesExist.js";
import { postComic } from "../controllers/postComic.js";
import { editCover } from "../controllers/editComics.js";
import { editDetails } from "../controllers/editComicDetails.js";
import { comicStatusChange } from "../controllers/comicStatus.js";

const Router = express.Router();

Router.post("/new", CoversUpload, uploadToBackBlaze, postComic);
Router.post("/change-cover", CoversUpload, doesExist, coverChange, editCover);
Router.post("/edit-details", doesExist, editDetails);
Router.post("/status-change", doesExist, comicStatusChange);

export default Router;
