import { mySqlConnection } from "../mySqlConnection.js";

// doesExist function checks if the comic exists

export const doesExist = async (req, res, next) => {
  const comicTitle = req.body.comicTitle;

  console.log(req);

  // Checking if the Body Title was provided

  if (!comicTitle) {
    return res.status(500).json({ message: "The Comic Title or the Comic!" });
  }

  // Checking if the Comic's cover Image exists

  mySqlConnection.query(
    "SELECT CoverImage FROM comics WHERE ComicTitle = ?",
    [comicTitle],
    (err, result) => {
      if (!err && result.length > 0) {
        return res.status(200).json({
          message: `A comic with the name ${comicTitle} already exists!`,
        });
      } else {
        return next();
      }
    }
  );
};
