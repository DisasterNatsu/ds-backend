import jwt from "jsonwebtoken";
import { mySqlConnection } from "../mySqlConnection.js";
import bcrypt from "bcryptjs";

// Admin Auth

export const AdminAuthjwt = (req, res, next) => {
  try {
    const token = req.header("ds-admin-auth");

    if (!token) {
      return res.status(401).json({ message: "Not Authorised" });
    }

    const verified = jwt.verify(token, process.env.ADMIN_JWT_PASSWORD);

    if (!verified) {
      return res.status(401).json({ message: "Not Authorised!" });
    } else {
      mySqlConnection.query(
        "SELECT UserName FROM admin WHERE Email = ?",
        verified.Email,
        (error, response) => {
          if (error) {
            return res.json(error);
          } else if (response.length > 0) {
            return res.status(200).json({
              UserName: response[0],
              verified: true,
            });
          } else {
            return res.json({ message: "Not Authorised!" });
          }
        }
      );
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Admin Register

export const Register = async (req, res) => {
  const { userName, email, password, passwordCheck } = req.body;

  try {
    if (!email || !userName || !password || !passwordCheck) {
      return res.status(400).json({ message: "Not all field are populated" });
    } else if (password.length < 5) {
      return res
        .status(400)
        .json({ message: "Password must be over 5 Characters" });
    } else if (password !== passwordCheck) {
      return res.status(400).json({ message: "The passwords didn't match" });
    } else {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      mySqlConnection.query(
        "SELECT * FROM admin WHERE email = ?",
        [email],
        (error, result) => {
          if (!result.length) {
            mySqlConnection.query(
              "INSERT INTO admin (email, UserName, Password) VALUES (?, ?, ?)",
              [email, userName, passwordHash],
              (error) => {
                if (error) {
                  console.log(error);
                } else {
                  res
                    .status(200)
                    .json({ message: "Account Successfully Created!" });
                }
              }
            );
          } else if (error) {
            return res.status(500).json({ message: error.message });
          } else {
            return res
              .status(400)
              .json({ message: "An Account with This Email Already Exists!" });
          }
        }
      );
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Login

export const LogIn = (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please Provide Email and Password" });
    }
    // Authentication
    mySqlConnection.query(
      "SELECT * FROM admin WHERE Email = ?",
      email,
      async (error, result) => {
        if (error) {
          res.status(500).json({ message: error.message });
        }

        if (result.length > 0) {
          console.log(result);
          try {
            const isMatch = await bcrypt.compare(password, result[0].Password);

            if (!isMatch) {
              return res.status(400).json({ message: "Invalid Credentials" });
            } else {
              const Email = result[0].Email;
              const token = jwt.sign(
                { Email },
                process.env.ADMIN_JWT_PASSWORD,
                {
                  expiresIn: "2d",
                }
              );

              const resData = result[0];

              return res.status(200).json({
                data: {
                  token: token,
                  id: resData.id,
                  UserName: resData.UserName,
                },
              });
            }
          } catch (error) {
            return res.status(500).json({ message: error.message });
          }
        } else {
          return res.status(403).json({ message: "Not authorised!" });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
