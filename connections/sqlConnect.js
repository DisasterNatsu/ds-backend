import { mySqlConnection } from "../mySqlConnection.js";

export const Connect = () => {
	mySqlConnection.connect((err) => (err ? console.log(err) : ""));

	mySqlConnection.on("connect", () => {
		console.log("Connection established with local MySql server!");
	});

	return true;
};
