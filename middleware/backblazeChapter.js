import fs from "fs";
import B2 from "backblaze-b2";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const uploadToBackBlaze = async (req, res, next) => {
	console.log("I'm here uploading to Backblaze");

	const b2 = new B2({
		applicationKeyId: process.env.BACKBLAZE_ACCOUNT_ID,
		applicationKey: process.env.BACKBLAZE_MASTER_APPLICATION_ID,
	});

	const __dirname = path.resolve();
	let tempDir = path.join(__dirname, "chapterTemp");

	const imageIds = [];
	try {
		b2.authorize().then(async () => {
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

					imageIds.push(response.data.fileId);
				});

				await Promise.all(uploadPromises);

				req.imageIds = imageIds;
				next();
			});
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
};
