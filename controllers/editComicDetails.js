import { mySqlConnection } from "../mySqlConnection.js";

export const editDetails = (req, res) => {
	// Defining Necessary Data
	const { id, comicTitle, description, author, artist, origin, tags } =
		req.body;

	// Error Handling

	if (!comicTitle || !description || !id) {
		return res
			.status(401)
			.json({ message: "Necessary data was not provided!" });
	}

	try {
		mySqlConnection.query(
			"UPDATE comic SET ComicTitle = ?, Author = ?, Artist = ?, Origin = ?, Tags = ?, description = ? WHERE id = ?",
			[comicTitle, author, artist, origin, tags, description, id],
			(err, result) => {
				if (!err && result.affectedRows >= 0) {
					return res
						.status(200)
						.json({ message: "Details updated successfully!" });
				} else {
					return res.status(400).json({ message: err.message });
				}
			}
		);
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};
