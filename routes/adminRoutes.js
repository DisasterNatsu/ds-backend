import express from "express";
import { LogIn, AdminAuthjwt, Register } from "../controllers/adminLogIn.js";

const Router = express.Router();

Router.post("/log-in", LogIn);
Router.post("/isAuth", AdminAuthjwt);
Router.post("/register", Register);

export default Router;
