import express from "express";
import {
  getAllComics,
  getLatestComic,
  getAComic,
} from "../controllers/getComic.js";

const Router = express.Router();

Router.get("/:name", getAComic);
Router.get("/all/comics", getAllComics);
Router.get("/latest", getLatestComic);

export default Router;
