import express from "express";
import { Register, LogIn } from "../controllers/userHandler.js";
import { isAuth } from "../controllers/userAuth.js";

const Router = express.Router();

Router.post("/register", Register);
Router.post("/log-in", LogIn);
Router.post("/auth", isAuth);

export default Router;
