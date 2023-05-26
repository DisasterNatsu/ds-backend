import fs from "fs";
import path from "path";
import sharp from "sharp";

export const ProcessImages = (req, res, next) => {
  console.log("Here");
  const __dirname = path.resolve();

  const tempDir = path.join(__dirname, "chapterTemp");
  const outputDir = path.join(__dirname, "processed");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    fs.readdir(tempDir, function (err, files) {
      console.log(tempDir, files);
      if (err) {
        console.error(err);
        res.sendStatus(500).json({ message: err.message });
        return;
      }

      files.map((file) => {
        const fileDir = path.join(tempDir, file);
        const fileNameWithoutExtention = file.split(".")[0];

        const formatImage = () => {
          sharp(fileDir).toFile(
            outputDir + `/${fileNameWithoutExtention}.webp`
          );
        };
        return formatImage();
      });

      next();
    });
  } catch (error) {
    console.log(error);
    fs.rmdirSync(tempDir, { recursive: true });
    return res.status(500).json({ message: error.message });
  }
};
