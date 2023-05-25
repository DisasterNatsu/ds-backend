import fs from "fs";
import path from "path";
import sharp from "sharp";

export const ProcessImages = (req, res) => {
  const __dirname = path.resolve();

  const testDir = path.join(__dirname, "test");
  const outputDir = path.join(__dirname, "processed");

  fs.readdir(testDir, function (err, files) {
    console.log(testDir, files);
    if (err) {
      console.error(err);
      res.sendStatus(500).json({ message: err.message });
      return;
    }

    files.map((file) => {
      const fileDir = path.join(testDir, file);
      const fileNameWithoutExtention = file.split(".")[0];
      console.log(fileNameWithoutExtention);

      const formatImage = () => {
        sharp(fileDir).toFile(outputDir + `/${fileNameWithoutExtention}.webp`);
      };
      return formatImage();
    });

    return res.status(200).json({ message: "Testing" });
  });
};
