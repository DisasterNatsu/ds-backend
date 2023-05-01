import express from "express";
import { LogIn, AdminAuthjwt } from "../controllers/adminLogIn.js";

const Router = express.Router();

Router.post("/log-in", LogIn);
Router.post("/isAuth", AdminAuthjwt);

export default Router;
