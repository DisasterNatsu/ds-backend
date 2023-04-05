import jwt from "jsonwebtoken";
import { mySqlConnection } from "../mySqlConnection.js";

export const adminAuth = (req, res, next) => {
	// Getting the token from header

	const token = req.header("disaster-scans-token");

	try {
		// Checking if there is a token

		if (!token) {
			return res.status(401).json({ message: "Not authorised!" });
		} else {
			// Verifying the Token

			const isVerified = jwt.verify(token, process.env.USER_JWT_PASSWORD);

			// Checking if verified

			if (!isVerified) {
				return res.status(401).json({ message: "Not authorised!" });
			} else {
				req.user = isVerified.email;
				next();
			}
		}
	} catch (error) {
		return res.status(200).json(error);
	}
};
