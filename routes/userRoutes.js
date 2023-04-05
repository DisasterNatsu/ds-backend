import express from "express";
import { Register } from "../controllers/usehHandler.js";

const Router = express.Router();

Router.post("/new", Register);

export default Router;
