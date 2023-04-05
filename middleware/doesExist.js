import { mySqlConnection } from "../mySqlConnection.js";
import { change } from "../components/linkNameChange.js";
import { removeFiles } from "../components/fileRemove.js";
import path from "path";
import fs from "fs";
import B2 from "backblaze-b2";
import dotenv from "dotenv";

const __dirname = path.resolve();
let tempDir = path.join(__dirname, "temp");

// doesExist function checks if the comic exists

export const doesExist = async (req, res, next) => {
	const comicTitle = req.body.comicTitle;

	// Checking if the Body Title was provided

	if (!comicTitle) {
		return res
			.status(500)
			.json({ message: "The Comic Title or the Comic Id was not provided!" });
	}

	// Checking if the Comic's cover Image exists

	mySqlConnection.query(
		"SELECT CoverImage FROM comics WHERE ComicTitle = ?",
		[comicTitle],
		(err, result) => {
			if (!err && result.length > 0) {
				if (req.path === "/change-cover") {
					req.ImageId = result[0].CoverImage;
				}

				req.exists = true;
				return next();
			} else {
				req.exists = true;
				return next();
			}
		}
	);
};
