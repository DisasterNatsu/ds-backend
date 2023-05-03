import { mySqlConnection } from "../mySqlConnection.js";
import { change } from "../components/linkNameChange.js";

// Return all chapters in a comic

export const allChapters = (req, res) => {
  // Getting Comic ID and Comic Name

  let details = req.params.details;

  const { id, comicName } = change(details, true); // Second Param value is a Boolean is 'true' if it's comic and 'false' if it's chapter

  // Try Catch

  try {
    // Querying to the Database

    mySqlConnection.query(
      "SELECT chapterNumber, ChapterName, date FROM chapters WHERE ComicTitle = ? and comicID = ? ORDER BY chapterNumber DESC",
      [comicName, id],
      (error, result) => {
        if (!error && result.length > 0) {
          res.status(200).json(result);

          return;
        } else {
          return res
            .status(200)
            .json({ message: "There are no Chapters for that comic" });
        }
      }
    );
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

// Return pages of a single chapter

export const ChapterPages = (req, res) => {
  // Getting the Comic Name and Chapter Number

  const number = req.params.number.replace("-", " ").split(" ");
  const comicTitle = req.params.name;

  // Check if the Comic Name and Chapter Number was provided

  if (!comicTitle || !number) {
    return res
      .status(501)
      .json({ message: "Comic Name and/or Chapter Number was not provided!" });
  }

  // Comic Name and Chapter Number for use in database

  const reqName = change(comicTitle);
  const chapterNumber = number[1];

  // Try Catch

  try {
    // Sending Query to the database

    mySqlConnection.query(
      "SELECT * FROM chapters WHERE ComicTitle = ? AND chapterNumber = ?",
      [reqName, chapterNumber],
      (error, result) => {
        if (!error && result.length > 0) {
          return res.status(200).json(result);
        } else {
          res.status(200).json({ message: error.message });

          return;
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Return Last 8 Comics With Their last two chapters

const TopEight = (req, res) => {
  mySqlConnection.query(
    "SELECT id, ComicTitle, CoverImage FROM comic ORDER by Date DESC LIMIT 8",
    (err, result) => {
      if (!err && result.length > 0) {
        const comic = result;

        result.map((item, index) => {
          mySqlConnection.query(
            "SELECT id, ChapterNumber, Date FROM chapters WHERE ComicTitle = ? AND comicID = ?",
            [item.ComicTitle, item.id],
            (err, response) => {
              if (!err && response.length > 0) {
                ({ ...comic, data: response[0] });
              } else {
                console.log(err);
                return res.status(200).json({ message: "Something Happened" });
              }
            }
          );
        });

        return res.status(200).json(comic);
      } else {
        console.log(err);
        return res.status(200).json({ message: "Something Happened" });
      }
    }
  );
};
