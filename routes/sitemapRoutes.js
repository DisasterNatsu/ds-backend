import express from "express";
import {
  allComicsWithId,
  chaptersWithIds,
} from "../controllers/sitemapHandler.js";

const Router = express.Router();

Router.get("/comics", allComicsWithId);
Router.get("/chapters", chaptersWithIds);

export default Router;
