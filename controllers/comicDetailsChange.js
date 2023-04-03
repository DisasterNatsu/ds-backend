import B2 from "backblaze-b2";
import fs from "fs";
import { mySqlConnection } from "../mySqlConnection.js";
import { v4 as uuidv4 } from "uuid";
import { Connect } from "../connections/sqlConnect.js";
import { Disconnect } from "../connections/sqlDisonnect.js";
import { change } from "../components/linkNameChange.js";

export const changeCover = async (req, res) => {
	const ID = req.oldId;
	const comicName = change(req.params.name);

	// Error Handling if no ID

	if (!ID) {
		return res.status(500).json({ message: "No 'fileId' was provided" });
	}

	// Authorizing B2

	const b2 = new B2({
		applicationKeyId: process.env.BACKBLAZE_ACCOUNT_ID,
		applicationKey: process.env.BACKBLAZE_MASTER_APPLICATION_ID,
	});

	const auth = await b2.authorize();
	const bucketId = process.env.BACKBLAZE_BUCKET_ID;

	// Getting The file Name

	const Name = await b2.getFileInfo({ fileId: ID });

	// Deleting previous Cover Image From Backblaze

	const deleted = await b2.deleteFileVersion({
		fileId: ID,
		fileName: Name.data.fileName,
	});

	// Handling error

	if (deleted.data.status !== 200) {
		return res.status(500).json({ message: deleted.data.code });
	}

	// Getting the path name

	const __dirname = path.resolve();
	const tempDir = path.join(__dirname, "temp");

	// A variable to store the new File ID for database

	let fileID;

	// Uploading the new file to backblaze

	fs.readdir(tempDir, async function (err, files) {
		if (err) {
			console.error(err);
			res.sendStatus(500).json({ message: err.message });
			return;
		}

		let v4 = uuidv4() + "-";

		for (const file of files) {
			const fileData = fs.readFileSync(path.join(tempDir, file));
			const uploadFileName = path.join(v4, file);
			const uploadUrl = await b2.getUploadUrl(bucketId);
			const response = await b2.uploadFile({
				uploadUrl: uploadUrl.data.uploadUrl,
				uploadAuthToken: uploadUrl.data.authorizationToken,
				filename: uploadFileName,
				data: fileData,
				mime: "image/png" || "image/jpg" || "image/jpeg" || "image/webp", // replace with the appropriate MIME type for your files
			});
			fileID = response.data.fileId;
		}

		// Connecting to Database

		Connect();

		// Adding the new Id to the database

		try {
			mySqlConnection.query(
				"UPDATE comics SET CoverImage = ? WHERE ComicTitle = ?",
				[fileID, comicName],
				(err, result) => {
					if (!err && result.length > 0) {
						Disconnect();

						// Returning The successful status and the file ID

						return res.status(200).json({
							message: "The Cover Image changed successfully!",
							id: fileID,
						});
					} else {
						Disconnect();
						return res.status(500).json({ message: err.message });
					}
				}
			);
		} catch (error) {
			Disconnect();
			return res.status(500).json({ message: error.message });
		}
	});
};

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

		Connect();

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
								res.status(200).json({
									message: "Chapter Name has been updated successfully!",
								});
								Disconnect();
								return;
							} else {
								res.status(500).json({ message: err.message });
								Disconnect();
								return;
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
