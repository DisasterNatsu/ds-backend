import express from "express";
import { allChapters, ChapterPages } from "../controllers/getChapters.js";

const Router = express.Router();

Router.get("/:details", allChapters);
Router.get("/:name/:number", ChapterPages);

export default Router;
