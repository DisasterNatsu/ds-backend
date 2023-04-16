import { mySqlConnection } from "../mySqlConnection.js";

export const postComic = (req, res) => {
	// See if it exists

	const doesExist = req.exists;

	if (doesExist === true) {
		return res
			.status(200)
			.json({ message: "A comic with the same name already exists!" });
	}

	// Getting data from the req.body

	let { comicTitle, description, origin, status, author, artist, tags, date } =
		req.body;

	const coverImage = req.image;

	// Error handling

	if (!comicTitle || !description || !origin || !status || !tags || !date) {
		return res
			.status(401)
			.json({ message: "Necessary data was not provided!" });
	}

	try {
		// Inserting the new comic into database

		mySqlConnection.query(
			"INSERT INTO comic (id, ComicTitle, Author, Artist, Tags, CoverImage, date, description, status, origin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
			[
				id,
				comicTitle,
				author,
				artist,
				tags,
				coverImage,
				date,
				description,
				status,
				origin,
			],
			(err, result) => {
				if (!err && result.length > 0) {
					return res
						.status(200)
						.json({ message: "Comic uploaded successfully" });
				} else {
					return res.status(500).json({ message: err.message });
				}
			}
		);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
