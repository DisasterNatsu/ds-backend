import multer from "multer";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export const CoversUpload = (req, res, next) => {
	const __dirname = path.resolve();
	let dir = path.join(__dirname, "temp");
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, dir);
		},

		filename: function async(req, file, cb) {
			const fileName = file.originalname.toLowerCase().split(" ").join("-");
			cb(null, uuidv4() + "-" + fileName);
		},
	});
	const upload = multer({
		storage: storage,
		fileFilter: (req, file, cb) => {
			if (
				file.mimetype == "image/png" ||
				file.mimetype == "image/jpg" ||
				file.mimetype == "image/jpeg" ||
				file.mimetype == "image/webp"
			) {
				cb(null, true);
			} else {
				cb(null, false);
				return cb(
					new Error("Only .png, .jpg, .jpeg and .webp formats are allowed!")
				);
			}
		},
	}).single("coverImage");

	upload(req, res, (err) => {
		if (err) {
			console.log(err);
		} else {
			next();
		}
	});
};
