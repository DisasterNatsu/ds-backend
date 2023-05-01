import { mySqlConnection } from "../mySqlConnection.js";

// doesExist function checks if the comic exists

export const doesExist = async (req, res, next) => {
  const comicTitle = req.body.comicTitle;

  // Checking if the Body Title was provided

  if (!comicTitle) {
    return res
      .status(500)
      .json({ message: "The Comic Title or the Comic Id was not provided!" });
  }

  // Checking if the Comic's cover Image exists

  mySqlConnection.query(
    "SELECT CoverImage FROM comics WHERE ComicTitle = ?",
    [comicTitle],
    (err, result) => {
      if (!err && result.length > 0) {
        if (req.path === "/change-cover") {
          req.ImageId = result[0].CoverImage;
        }

        req.exists = true;
        return next();
      } else {
        req.exists = false;

        return next();
      }
    }
  );
};
