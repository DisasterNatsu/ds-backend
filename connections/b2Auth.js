import B2 from "backblaze-b2";
import dotenv from "dotenv";
dotenv.config();

const b2 = new B2({
	applicationKeyId: process.env.BLACKBLAZE_ACCOUNT_ID, // or accountId: 'accountId'
	applicationKey: process.env.BLACKBLAZE_MASTER_APPLICATION_ID, // or masterApplicationKey
});

export const B2Auth = async () => {
	try {
		await b2.authorize(); // must authorize first (authorization lasts 24 hrs)
	} catch (err) {
		console.log("Error getting bucket:", err);
	}
};
