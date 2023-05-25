import { mySqlConnection } from "../mySqlConnection.js";

export const allComicsWithId = (req, res) => {
  mySqlConnection.query("SELECT id, ComicTitle FROM comics", (err, result) => {
    if (!err && result.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(200).json({ message: "No Comics Found" });
    }
  });
};

export const chaptersWithIds = (req, res) => {
  mySqlConnection.query(
    "SELECT C.chapterID, ComicTitle, comicID, ChapterNumber, chapterDate FROM chapters C inner join(SELECT id FROM comics) Comic on C.comicID = Comic.id ORDER BY C.chapterDate DESC",
    (err, result) => {
      if (!err && result.length > 0) {
        return res.status(200).json(result);
      } else {
        console.log(err);
        return res.status(200).json(null);
      }
    }
  );
};
