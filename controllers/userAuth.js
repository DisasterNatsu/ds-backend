import { mySqlConnection } from "../mySqlConnection.js";
import jwt from "jsonwebtoken";

export const isAuth = (req, res) => {
	// Try Catch block

	try {
		const token = req.header("disaster-scans-token");

		if (!token) {
			return res.status(200).json({ verified: false });
		}

		// Verifying the token

		const verified = jwt.verify(token, process.env.USER_JWT_PASSWORD);

		if (!verified) {
			return res.status(200).json({ verified: false });
		} else {
			mySqlConnection.query(
				"SELECT UserName FROM users WHERE email = ?",
				verified.email,
				(error, response) => {
					if (error) {
						return res.status(200).json({ verified: false });
					}

					if (response.length > 0) {
						return res
							.status(200)
							.json({ verified: true, userName: response[0].UserName });
					} else {
						return res.status(200).json({ verified: false });
					}
				}
			);
		}
	} catch (error) {
		return res.status(200).json({ verified: false });
	}
};
