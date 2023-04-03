import { mySqlConnection } from "../mySqlConnection.js";
import B2 from "backblaze-b2";
import dotenv from "dotenv";

dotenv.config();

export const postComic = (req, res) => {
	const { comicTitle, description, author, artist, status } = req.body;
	const coverImage = req.image[0];

	if (!comicTitle || !description || !status || !coverImage || !coverImage) {
		return res
			.status(500)
			.json({ message: "Some or all of the necessary data wasn't provided!" });
	}

	try {
		// MySql Connection Request

		mySqlConnection.query(
			"UPDATE comics SET CoverImage = ? WHERE ComicTitle = ?",
			[coverImage, comicTitle],
			(err, result) => {
				if (!err || result.strength > 0) {
					return res
						.status(200)
						.json({ message: "Cover Image was changed successfully!" });
				} else {
					return res.status(500).json({ message: err.message });
				}
			}
		);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
