import fs from "fs";
import B2 from "backblaze-b2";
import path from "path";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

export const uploadToBackBlaze = async (req, res, next) => {
  // Defining backblaze masterkey and application key

  const b2 = new B2({
    applicationKeyId: process.env.BACKBLAZE_MASTER_APPLICATION_KEY_ID,
    applicationKey: process.env.BACKBLAZE_MASTER_APPLICATION_ID,
  });

  const __dirname = path.resolve(); // Defining directory
  let tempDir = path.join(__dirname, "processed"); // the temp directory

  try {
    await b2.authorize().then(async () => {
      const bucketId = process.env.BACKBLAZE_BUCKET_ID;

      fs.readdir(tempDir, async function (err, files) {
        if (err) {
          console.error(err);
          res.sendStatus(500).json({ message: err.message });
          return;
        }

        // Unique id

        let uid = uuidv4();

        // Reading file from temp Dir and upload to backblaze

        const uploadPromises = files.map(async (file) => {
          const fileData = fs.readFileSync(path.join(tempDir, file));
          const uploadFileName = path.join(uid, file); // changing file name to uniques
          const uploadUrl = await b2.getUploadUrl(bucketId); // Getting upload URL and auth token
          const response = await b2.uploadFile({
            uploadUrl: uploadUrl.data.uploadUrl,
            uploadAuthToken: uploadUrl.data.authorizationToken,
            filename: uploadFileName,
            data: fileData,
            mime: "image/png" || "image/jpg" || "image/jpeg" || "image/webp", // replace with the appropriate MIME type for your files
          });

          return response.data.fileId;
        });

        req.imageIds = await Promise.all(uploadPromises);

        fs.rmdirSync(tempDir, { recursive: true }); // Removing Files From Temp Dir
        next();
      });
    });
  } catch (error) {
    fs.rmdirSync(tempDir, { recursive: true }); // Removing Files From Temp Dir
    return res.status(500).json({ message: error.message });
  }
};
