import fs from "fs";
import B2 from "backblaze-b2";
import path from "path";

export const uploadToBackBlaze = async (req, res, next) => {
  const __dirname = path.resolve();
  let tempDir = path.join(__dirname, "temp");

  const b2 = new B2({
    applicationKeyId: process.env.BACKBLAZE_MASTER_APPLICATION_KEY_ID,
    applicationKey: process.env.BACKBLAZE_MASTER_APPLICATION_ID,
  });

  let reqfiles = [];
  try {
    await b2
      .authorize()
      .then(async () => {
        // Will be called when uploading a new chapter or changing cover

        const bucketId = process.env.BACKBLAZE_BUCKET_ID;

        fs.readdir(tempDir, async function (err, files) {
          if (err) {
            console.error(err.message);
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

          req.image = reqfiles[0];

          fs.rmdirSync(tempDir, { recursive: true });
          next();
        });
      })
      .catch((err) => {
        return res.status(500).json({ message: err });
      });
  } catch (error) {
    console.log(error.message);
  }
};
