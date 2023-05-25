import { mySqlConnection } from "../mySqlConnection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// User Registration

export const Register = async (req, res) => {
  // Getting the necessary data from the body of the request

  const { userName, email, password, passwordCheck } = req.body;

  // Error handling

  if (!email || !userName || !password || !passwordCheck) {
    return res
      .status(400)
      .json({ message: "Necessary data was not provided!" });
  } else if (password.length < 5) {
    // Checking Password Length

    return res
      .status(400)
      .json({ message: "Password must contain 5 characters or more!" });
  } else if (password !== passwordCheck) {
    // Check if both the passwords match

    return res.status(400).json({
      message: "The passwords didn't match!",
    });
  }

  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  // Try Catch

  try {
    // Establish a connection MySql

    // Querying into the MySql database
    mySqlConnection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, result) => {
        if (!err && result.length > 0) {
          return res.status(400).json({
            message: `An account with the Email: ${email} already exists!`,
          });
        } else if (err) {
          return res.status(400).json({ message: err.message });
        } else {
          mySqlConnection.query(
            "INSERT INTO users (email, UserName, Password) VALUES (?, ?, ?)",
            [email, userName, passwordHash],
            (error, result) => {
              if (!error && result.affectedRows >= 0) {
                console.log("HEre");
                return res
                  .status(200)
                  .json({ message: "Account Successfully Created!" });
              } else {
                console.log("HEre");
                return res.status(500).json({ message: error });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const LogIn = async (req, res) => {
  // Getting The Email or UserName and Password

  const { email, password } = req.body;

  // If email or password was not provided

  if (!email || !password) {
    return res
      .status(401)
      .json({ message: "Email or Password was not provided!" });
  }

  // Try Catch

  try {
    mySqlConnection.query(
      "SELECT * FROM users WHERE Email = ?",
      email,
      async (err, result) => {
        if (err || result.length === 0) {
          return res.status(500).json({
            message: "No account with this Email Address is Registered",
          });
        }

        const confirmation = await bcrypt.compare(password, result[0].Password);

        if (confirmation === true) {
          const token = jwt.sign(
            {
              email: result[0].Email,
            },
            process.env.USER_JWT_PASSWORD,
            {
              expiresIn: "5h",
            }
          );

          return res.status(200).json({
            authToken: token,
            email: result[0].Email,
            UserName: result[0].UserName,
          });
        }

        return res
          .status(400)
          .json({ message: "Incorrect Email or Password!" });
      }
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
