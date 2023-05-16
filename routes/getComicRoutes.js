import express from "express";
import {
  getAllComics,
  getLatestComic,
  getAComic,
  comicWithlastTwo,
} from "../controllers/getComic.js";

const Router = express.Router();

Router.get("/:name", getAComic);
Router.get("/all/comics", getAllComics);
Router.get("/latest/comic", getLatestComic);
Router.get("/eight/withChapter", comicWithlastTwo);

export default Router;
