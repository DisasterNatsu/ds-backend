import { mySqlConnection } from "../mySqlConnection.js";
import { change } from "../components/linkNameChange.js";

// Get all Comics

export const getAllComics = (req, res) => {
	mySqlConnection.query("SELECT * FROM comics", (error, rows) => {
		if (!error && rows.length > 0) {
			res.status(200).json(rows);

			return;
		} else {
			console.log({ error });
			res.status(500).json({ error });

			return;
		}
	});
};

// Get a single Comic

export const getAComic = (req, res) => {
	let comicTitle = req.params.name;
	// Trying Switch

	switch (comicTitle) {
		case !comicTitle:
			res.json({ message: "Comic Title was not provided!" });
			break;
		default:
			// Formating The Comic Name to match with database

			const reqName = change(comicTitle);

			try {
				mySqlConnection.query(
					"SELECT * FROM comics WHERE ComicTitle = ?",
					[reqName],
					(error, result) => {
						if (!error && result.length > 0) {
							res.status(200).json(result);
							return;
						} else {
							console.log(error);
							return res.status(200).json({
								message: `No comic with the name ${reqName} was found!`,
							});
						}
					}
				);
			} catch (error) {
				res.status(500).json({ message: error.message });

				return;
			}

			break;
	}
};

// Return Last 8 Comics Uploaded

export const getLatestComic = (req, res) => {
	mySqlConnection.query(
		"SELECT id, ComicTitle, date FROM comics ORDER BY date LIMIT 8",
		(err, result) => {
			if (!err && result.length > 0) {
				res.status(200).json(result);
				return;
			} else {
				res.status(500).json(err);
				return;
			}
		}
	);
};
