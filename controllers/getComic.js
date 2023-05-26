import { mySqlConnection } from "../mySqlConnection.js";
import { change } from "../components/linkNameChange.js";

// Get all Comics

export const getAllComics = (req, res) => {
  mySqlConnection.query("SELECT * FROM comics", (error, rows) => {
    if (!error && rows.length > 0) {
      res.status(200).json(rows);

      return;
    } else if (error) {
      res.status(500).json({ error });
      return;
    } else {
      res.status(200).json([]);
      return;
    }
  });
};

// Get a single Comic

export const getAComic = (req, res) => {
  let comicTitle = req.params.name;

  if (!comicTitle) {
    return res.status(400).json({ message: "No Comic Title was provided" });
  }

  const reqName = change(comicTitle, true);

  // Trying Switch

  try {
    mySqlConnection.query(
      "SELECT * FROM comics WHERE ComicTitle = ? AND id = ?",
      [reqName.comicName, reqName.id],
      (error, result) => {
        if (!error && result.length > 0) {
          return res.status(200).json(result[0]);
        } else {
          console.log(error);
          return res.status(200).json({
            message: `No comic with the name ${reqName} was found!`,
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });

    return;
  }
};

// Return Last 8 Comics Uploaded

export const getLatestComic = (req, res) => {
  mySqlConnection.query(
    "SELECT id, ComicTitle, date FROM comics ORDER BY date desc LIMIT 8",
    (err, result) => {
      if (!err && result.length > 0) {
        res.status(200).json(result);
        return;
      } else {
        res.status(500).json(err);
        return;
      }
    }
  );
};

export const comicWithlastTwo = (req, res) => {
  mySqlConnection.query(
    "SELECT C.id, ComicTitle, CoverImage, Badges, chapterID, ChapterNumber, chapterDate FROM comics C LEFT JOIN(SELECT chapterID, ChapterNumber, comicID, chapterDate, row_number() OVER (partition by comicID ORDER BY chapterDate desc) as seqnum FROM chapters) Chpt on C.id = Chpt.comicID WHERE Chpt.seqnum <= 2 limit 8",
    (err, response) => {
      if (!err && response.length > 0) {
        return res.status(200).json(response);
      } else {
        console.log(err);
        return res.status(500).json(err);
      }
    }
  );
};

export const searchComics = (req, res) => {
  mySqlConnection.query(
    "SELECT id, ComicTitle, CoverImage, Date FROM comics",
    (err, result) => {
      if (!err && result.length > 0) {
        return res.status(200).json(result);
      } else {
        console.log(err);
        return res.status(404).json({ message: "No Comics Found" });
      }
    }
  );
};
