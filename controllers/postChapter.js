import fs from "fs";
import { mySqlConnection } from "../mySqlConnection.js";
import uniqueRandom from "unique-random";

export const postChapter = async (req, res) => {
  const { comicTitle, chapterNumber, chapterName, comicID } = req.body;
  const imageIds = req.imageIds;

  if (!comicTitle || !chapterNumber || !comicID) {
    return res.status(500).json({
      message: "Comic Title or Chapter Number or Comic ID was not provided",
    });
  } else if (!chapterName) {
    chapterName = null;
  }
  const number = Number(chapterNumber);

  // Generating ID

  const random = uniqueRandom(11111, 99999);

  let id = random();

  // Function To check if a chapter with the same chapter Number for the same comic already exists

  mySqlConnection.query(
    "SELECT pages FROM chapters WHERE comicID = ? AND ChapterNumber = ?",
    [comicID, chapterNumber],
    (err, result) => {
      if (!err && result.length > 0) {
        return res.status(200).json({
          message: "Chapter with the same chapter Number already exists",
        });
      } else {
        mySqlConnection.query(
          "INSERT INTO chapters (id, ComicTitle, chapterNumber, ChapterName, Pages, comicID) VALUES (?, ?, ?, ?, ?, ?)",
          [id, comicTitle, number, chapterName, imageIds, comicID],
          (err, result) => {
            if (!err && result.affectedRows > 0) {
              return res
                .status(200)
                .json({ message: "Chapter uploaded successfully!" });
            } else {
              console.log(err);
              return res.status(500).json({ message: err });
            }
          }
        );
      }
    }
  );
};
