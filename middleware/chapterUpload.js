import multer from "multer";
import fs from "fs";
import path from "path";

const ChapterMiddleWare = (req, res, next) => {
  const __dirname = path.resolve();
  let dir = path.join(__dirname, "temp");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, dir);
    },

    filename: function async(req, file, cb) {
      const fileName = file.originalname.toLowerCase().split(" ").join("-");
      cb(null, fileName);
    },
  });
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "application/zip" ||
        "application/octet-stream" ||
        "application/x-zip-compressed" ||
        "multipart/x-zip"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Only .zip allowed!"));
      }
    },
  }).single("pages");

  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      next();
    }
  });
};

export default ChapterMiddleWare;
