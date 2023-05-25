import express from "express";
import {
  getAllComics,
  getLatestComic,
  getAComic,
  comicWithlastTwo,
  searchComics,
} from "../controllers/getComic.js";

const Router = express.Router();

Router.get("/:name", getAComic);
Router.get("/search/comics", searchComics);
Router.get("/all/comics", getAllComics);
Router.get("/latest/comic", getLatestComic);
Router.get("/eight/withChapter", comicWithlastTwo);

export default Router;
