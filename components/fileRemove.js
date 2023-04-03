import fs from "fs";

export const removeFiles = (pathName) => {
	fs.rmSync(pathName, { recursive: true });
};
