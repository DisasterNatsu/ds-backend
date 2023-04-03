import express from "express";
import {
	allChapters,
	ChapterPages,
	latestChapters,
} from "../controllers/getChapters.js";

const Router = express.Router();

Router.get("/:details", allChapters);
Router.get("/:name/:number", ChapterPages);
Router.get("/top-eight/:name", latestChapters);

export default Router;
