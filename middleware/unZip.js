import decompress from "decompress";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export const unZip = (req, res, next) => {
	const __dirname = path.resolve();
	let dir = path.join(__dirname, "chapterTemp");

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	const originPath = path.join(__dirname, "temp", req.file.filename);

	let dist = dir;

	const reqFiles = path.join(dir, req.file.filename);

	const unZipFiles = decompress(originPath, dist, {
		map: (file) => {
			file.path = uuidv4() + "-" + file.path;

			return file;
		},
	}).then((files) => {
		fs.rmSync(originPath);
		next();
	});
};
