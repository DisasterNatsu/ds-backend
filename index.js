import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import random from "random";
import { Connect } from "./connections/sqlConnect.js";
import getComicRoutes from "./routes/getComicRoutes.js";
import getChapterRoutes from "./routes/getChpaters.js";
import postChapterRoutes from "./routes/postChaptersRoutes.js";
import postComicRoutes from "./routes/postComicRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import B2 from "backblaze-b2";
import axios from "axios";

const app = express();

app.use("/public", express.static("./public"));

dotenv.config();

app.use(
  bodyParser.json({
    limit: "100mb",
    extended: true,
  })
);
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

const PORT = process.env.port || 5000;

const connection = Connect();

if (connection) {
  app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
} else {
  console.log("Couldn't establish connection with MySql local Server!");
}

// app.post("/upload", upload.single("file"), function (req, res) {
// 	if (req.file) {
// 		const filePath = req.file.path;
// 		// Handle the file upload here
// 	} else {
// 		console.log("No file uploaded");
// 	}
// 	// console.log(req.file);
// 	// const filePath = req.file.path;
// 	const __dirname = path.resolve();
// 	const tempDir = path.join(__dirname, "temp");

// 	const imageIds = [];

// 	b2.authorize()
// 		.then(() => {
// 			const bucketId = process.env.BACKBLAZE_BUCKET_ID;

// 			fs.readdir(tempDir, async function (err, files) {
// 				if (err) {
// 					console.error(err);
// 					res.sendStatus(500);
// 					return;
// 				}

// 				for (const file of files) {
// 					const fileData = fs.readFileSync(path.join(tempDir, file));
// 					const uploadFileName = path.join("chapters", file);
// 					const uploadUrl = await b2.getUploadUrl(bucketId);
// 					const response = await b2.uploadFile({
// 						uploadUrl: uploadUrl.data.uploadUrl,
// 						uploadAuthToken: uploadUrl.data.authorizationToken,
// 						filename: uploadFileName,
// 						data: fileData,
// 						mime: "image/png" || "image/jpg" || "image/jpeg" || "image/webp", // replace with the appropriate MIME type for your files
// 					});
// 					imageIds.push(response.data.fileId);
// 				}
// 				console.log(imageIds);
// 				res.sendStatus(200);
// 			});
// 		})
// 		.catch((err) => {
// 			console.error(err);
// 			res.sendStatus(500);
// 		});
// });
