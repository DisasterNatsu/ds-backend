import multer from "multer";
import fs from "fs";

const CoverChangeMiddle = (req, res, next) => {
	// Resolving the path

	const __dirname = path.resolve();
	const tempDir = path.join(__dirname, "temp");

	// Seeing if there is a directory and if there is, then delete it!

	if (fs.existsSync(tempDir)) {
		fs.rmdirSync(tempDir, { recursive: true });
	}

	// Making the new directory

	fs.mkdirSync(tempDir, { recursive: true });
	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, tempDir);
		},

		filename: function async(req, file, cb) {
			const fileName = file.originalname.toLowerCase().split(" ").join("-");
			cb(null, fileName);
		},
	});
	const upload = multer({
		storage: storage,
		fileFilter: (req, file, cb) => {
			if (
				file.mimetype == "image/png" ||
				file.mimetype == "image/jpg" ||
				file.mimetype == "image/jpeg"
			) {
				cb(null, true);
			} else {
				cb(null, false);
				return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
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

export default CoverChangeMiddle;
