import express from "express";
import { Register, LogIn } from "../controllers/usehHandler.js";
import { isAuth } from "../controllers/userAuth.js";

const Router = express.Router();

Router.post("/register", Register);
Router.post("/log-in", LogIn);
Router.get("/auth", isAuth);

export default Router;
