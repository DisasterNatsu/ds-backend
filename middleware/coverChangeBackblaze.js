import B2 from "backblaze-b2";
import path from "path";
import fs from "fs";

export const coverChange = async (req, res, next) => {
	// Getting the old Image ID

	const imageID = req.ImageId;

	const __dirname = path.resolve(); // Defining root
	let tempDir = path.join(__dirname, "chapterTemp"); // the temp directory

	// Defining B2

	const b2 = new B2({
		applicationKeyId: process.env.BACKBLAZE_ACCOUNT_ID,
		applicationKey: process.env.BACKBLAZE_MASTER_APPLICATION_ID,
	});

	const imageIds = []; // Empty array where the file IDs will be pushed

	try {
		await b2.authorize().then(async () => {
			const bucketID = process.env.BACKBLAZE_BUCKET_ID; // Defile bucket id

			const info = await b2.getFileInfo({ fileId: imageID });

			const { fileId, fileName } = await info.data;

			const fileDelete = await b2.deleteFileVersion({
				fileId: fileId,
				fileName: fileName,
			});

			let hasDeteled = fileDelete.status;

			if (hasDeteled === 200) {
				// Reading file

				fs.readdir(tempDir, async (err, files) => {
					// Handling Error

					if (err) {
						console.error(err);
						res.sendStatus(500).json({ message: err.message });
						return;
					}

					const uploadPromises = files.map(async (file) => {
						const fileData = fs.readFileSync(path.join(tempDir, file));
						const uploadFileName = path.join(file);
						const uploadUrl = await b2.getUploadUrl(bucketID);
						const response = await b2.uploadFile({
							uploadUrl: uploadUrl.data.uploadUrl,
							uploadAuthToken: uploadUrl.data.authorizationToken,
							filename: uploadFileName,
							data: fileData,
							mime: "image/png" || "image/jpg" || "image/jpeg" || "image/webp", // replace with the appropriate MIME type for your files
						});
						imageIds.push(response.data.fileId);
					});

					await Promise.all(uploadPromises); // Waiting for all promises to be fulfilled in the function uploadPromises

					// New cover Image Id
					req.newCover = imageIds;
					return next();
				});
			}

			return res.status(400).json({ message: "Message from backblaze!" });
		});
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
