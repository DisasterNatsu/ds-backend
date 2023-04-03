import { mySqlConnection } from "../mySqlConnection.js";
import { Connect } from "../connections/sqlConnect.js";
import { Disconnect } from "../connections/sqlDisonnect.js";
import bcrypt from "bcryptjs";
import jwt from "jwt";
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
	} else if (password === passwordCheck) {
		// Check if both the passwords match

		return res.status(400).json({
			message: "The passwords didn't match!",
		});
	}

	const salt = bcrypt.genSalt();
	const passwordHash = await bcrypt.hash(password, salt);

	// Try Catch

	try {
		// Establish a connection MySql

		Connect();

		// Querying into the MySql database
		mySqlConnection.query(
			"SELECT * FROM users WHERE email = ?",
			[email],
			(err, result) => {
				if (!err && result.length > 0) {
					res.status(200).json({
						message: `An account with the Email: ${email} already exists!`,
						err: err ? err : null,
					});
					Disconnect();
					return;
				} else {
					mySqlConnection.query(
						"INSERT INTO users (email, UserName, Password) VALUES (?, ?, ?)",
						[email, userName, passwordHash],
						(error, result) => {
							if (!error && result.length > 0) {
								res.status(200).json({
									message: "Account Successfully Created!",
								});
								Disconnect();
								return;
							} else {
								res.status(500).json({
									message: error.message,
								});
								Disconnect();
								return;
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
