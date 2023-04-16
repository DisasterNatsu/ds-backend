import { mySqlConnection } from "../mySqlConnection.js";

export const editCover = (req, res) => {
	const { comicTitle, id } = req.body;

	// Error Handling

	if (req.exists === false) {
		return res
			.status(401)
			.json({ message: `Comic with the name of ${comicTitle} doesn't exist!` });
	}

	// The old cover image

	const coverImage = req.image[0];

	if (!comicTitle || !id) {
		return res
			.status(500)
			.json({ message: "Some or all of the necessary data wasn't provided!" });
	}

	try {
		// MySql Connection Request

		mySqlConnection.query(
			"UPDATE comics SET CoverImage = ? WHERE ComicTitle = ? AND id = ?",
			[coverImage, comicTitle, id],
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
