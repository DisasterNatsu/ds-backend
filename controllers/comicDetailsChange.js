import B2 from "backblaze-b2";
import fs from "fs";
import { mySqlConnection } from "../mySqlConnection.js";
import { v4 as uuidv4 } from "uuid";
import { change } from "../components/linkNameChange.js";

export const changeCover = async (req, res) => {};

export const comicTitleChange = (req, res) => {
	const Name = req.params.name;

	// Checking if the name is present

	if (!Name) {
		return res
			.status(500)
			.json({ message: "The Coming Name was not provided!" });
	}

	// Name that can be matched against the database

	const ComicName = change(Name);

	try {
		// Connecting to database

		// Checking if the comic with that coming title exists

		mySqlConnection.query(
			"SELECT id FROM comics WHERE ComicTitle = ?",
			[ComicName],
			(err, result) => {
				if (!err && result.length > 0) {
					const id = result; // Getting the Id and storing it

					// Updating the Comic Title

					mySqlConnection.query(
						"UPDATE comics SET ComicTitle = ? WHERE id = ?",
						[ComicName, id],
						(err, result) => {
							if (!err && result.length > 0) {
								return res.status(200).json({
									message: "Chapter Name has been updated successfully!",
								});
							} else {
								return res.status(500).json({ message: err.message });
							}
						}
					);
				}
			}
		);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
