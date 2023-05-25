import { mySqlConnection } from "../mySqlConnection.js";
import uniqueRandom from "unique-random";

export const postComic = (req, res) => {
  // Getting data from the req.body

  let {
    comicTitle,
    description,
    origin,
    status,
    genres,
    author,
    artist,
    badge,
  } = req.body;

  const coverImage = req.image;

  // Error handling

  if (!comicTitle || !description || !origin || !status || !genres) {
    return res
      .status(401)
      .json({ message: "Necessary data was not provided!" });
  }

  // Generating ID

  const random = uniqueRandom(10000, 99999);

  let id = random();

  try {
    // Checking if the comic Exists

    mySqlConnection.query(
      "SELECT id FROM comics WHERE ComicTitle = ?",
      comicTitle,
      (err, result) => {
        if (!err && result.length > 0) {
          return res.status(200).json({
            message: `A Comic with the name ${comicTitle} already exists!`,
          });
        } else {
          mySqlConnection.query(
            "INSERT INTO comics (id, ComicTitle, Description, CoverImage, Origin, Status, Genres, Author, Artist, Badges) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              id,
              comicTitle,
              description,
              coverImage,
              origin,
              status,
              genres,
              author,
              artist,
              badge,
            ],
            (err, result) => {
              if (!err && result.affectedRows > 0) {
                return res
                  .status(200)
                  .json({ message: "Comic uploaded successfully" });
              } else {
                console.log(err);
                return res.status(500).json({ message: err });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};
