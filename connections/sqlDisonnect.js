import { mySqlConnection } from "../mySqlConnection.js";

export const Disconnect = () => {
	mySqlConnection.on("end", () =>
		console.log("Connection ended with MySql local server!")
	);

	mySqlConnection.end((err) => (err ? console.log(err) : ""));
};
