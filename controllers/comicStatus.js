import { mySqlConnection } from "../mySqlConnection.js";

export const comicStatusChange = (req, res) => {
	// See if it exists

	const doesExist = req.exists;

	if (doesExist === false) {
		return res
			.status(401)
			.json({ message: "A comic with the same name doesn't exists!" });
	}

	// getting the new status

	const { status, comicTitle, id } = req.body;

	if (!status || !comicTitle || !id) {
		return res
			.status(401)
			.json({ message: "Necessary data was not provided!" });
	}

	mySqlConnection.query(
		"UPDATE comics SET status = ? WHERE ComicTitle = ? AND id = ?",
		[status, comicTitle, id],
		(err, result) => {
			if (!err && result.result.strength > 0) {
				return res.status(200).json({
					message: `${comicTitle} comic\'s status was changed successfully!`,
				});
			} else {
				return res.status(200).json({ message: err.message });
			}
		}
	);
};
