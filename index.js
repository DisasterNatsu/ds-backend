import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { Connect } from "./connections/sqlConnect.js";
import getComicRoutes from "./routes/getComicRoutes.js";
import getChapterRoutes from "./routes/getChpaters.js";
import postChapterRoutes from "./routes/postChaptersRoutes.js";
import postComicRoutes from "./routes/postComicRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import sitemapRoutes from "./routes/sitemapRoutes.js";

const app = express();

app.use("/public", express.static("./public"));

dotenv.config();

app.use(
  bodyParser.urlencoded({
    limit: "100mb",
    extended: true,
  })
);
app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.use("/comics", getComicRoutes);
app.use("/chapters", getChapterRoutes);
app.use("/postChapter", postChapterRoutes);
app.use("/postComic", postComicRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/sitemap", sitemapRoutes);

const PORT = process.env.port || 8000;

const connection = Connect();

if (connection) {
  app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
} else {
  console.log("Couldn't establish connection with MySql Server!");
}
