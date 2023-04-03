import fs from "fs";
import { mySqlConnection } from "../mySqlConnection.js";

export const postChapter = async (req, res) => {
	const { comicTitle, chapterNumber, chapterName, comicID } = req.body;
	const imageIds = req.imageIds;

	if (!comicTitle || !chapterNumber || !comicID) {
		return res.status(500).json({
			message: "Comic Title or Chapter Number or Comic ID was not provided",
		});
	} else if (!chapterName) {
		chapterName = null;
	}

	// Getting Date

	var date = new Date();

	// Function To check if a chapter with the same chapter Number for the same comic already exists

	const doesExist = () => {
		mySqlConnection.query(
			"SELECT pages FROM chapters WHERE comicID = ? AND ChapterNumber = ?",
			[comicID, chapterNumber],
			(err, result) => {
				if (!err && result.length > 0) {
					return true;
				} else {
					return false;
				}
			}
		);
	};

	switch (doesExist()) {
		case false:
			// If there is no chapter for the same comic! Adding new Chapter

			mySqlConnection.query(
				"INSERT INTO chapters WHERE (ComicTitle, chapterNumber, ChapterName, Pages, comicID, date) VALUES (?,?,?,?,?,?)",
				[comicTitle, chapterNumber, chapterName, imageIds, comicID, date],
				(err, result) => {
					if (!err && result.length > 0) {
						return res
							.status(200)
							.json({ message: "Chapter uploaded successfully!" });
					} else {
						console.log(err);
						return res.status(500).json({ message: err.message });
					}
				}
			);

			break;

		default:
			return res.status(500).json({
				message: "Chapter with the same chapter Number already exists",
			});

			break;
	}

	return res.status(200).json({ message: "I'm Here!" });
};
