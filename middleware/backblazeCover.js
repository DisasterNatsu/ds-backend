import fs from "fs";
import B2 from "backblaze-b2";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const uploadToBackBlaze = async (req, res, next) => {
	const __dirname = path.resolve();
	let tempDir = path.join(__dirname, "temp");

	const filePath = path.join(tempDir, req.file.filename); // Getting the File Path

	// If the comic with the same name already exists

	if (req.exists && req.exists === true && req.path === "/new") {
		// Deleting the Image from Local Storage

		fs.rmSync(filePath, { recursive: true });

		// Returning the response

		return res.status(200).json({ message: "The Comic already exists!" });
	}

	const b2 = new B2({
		applicationKeyId: process.env.BACKBLAZE_ACCOUNT_ID,
		applicationKey: process.env.BACKBLAZE_MASTER_APPLICATION_ID,
	});

	let reqfiles = [];

	b2.authorize()
		.then(async () => {
			// Will be called when uploading a new chapter or changing cover

			const bucketId = process.env.BACKBLAZE_BUCKET_ID;

			fs.readdir(tempDir, async function (err, files) {
				if (err) {
					console.error(err);
					res.sendStatus(500).json({ message: err.message });
					return;
				}

				const uploadPromises = files.map(async (file) => {
					const fileData = fs.readFileSync(path.join(tempDir, file));
					const uploadFileName = path.join(file);
					const uploadUrl = await b2.getUploadUrl(bucketId);
					const response = await b2.uploadFile({
						uploadUrl: uploadUrl.data.uploadUrl,
						uploadAuthToken: uploadUrl.data.authorizationToken,
						filename: uploadFileName,
						data: fileData,
						mime: "image/png" || "image/jpg" || "image/jpeg" || "image/webp", // replace with the appropriate MIME type for your files
					});
					reqfiles.push(response.data.fileId);
				});

				await Promise.all(uploadPromises);

				req.image = reqfiles;

				fs.rmSync(filePath, { recursive: true });
				next();
			});
		})
		.catch((err) => {
			console.error(err);
			res.sendStatus(500);
		});
};
