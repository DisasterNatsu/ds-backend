export const change = (value, comic) => {
	let reqDetails = value;

	if (comic) {
		for (let i = 0; i < reqDetails.length; i++) {
			reqDetails = reqDetails.replace("-", " ");
		}
		const newValue = reqDetails;

		let Value = newValue.split(" ");

		let ID = Value.splice(0, 1);

		const Name = Value;

		for (let i = 0; i < Name.length; i++) {
			Name[i] = Name[i][0].toUpperCase() + Name[i].substr(1);
		}

		const changedName = Name.join(" ");

		const returnValue = { id: parseInt(ID[0]), comicName: changedName };

		return returnValue;
	} else {
		for (let i = 0; i < reqDetails.length; i++) {
			reqDetails = reqDetails.replace("-", " ");
		}
		const newValue = reqDetails;

		let Value = newValue.split(" ");

		let chaterId = Value[0];
		let chapterNumber = Value[Value.length - 1];

		const returnValue = {
			chapterID: parseInt(chaterId),
			chapterNumber: parseInt(chapterNumber),
		};

		return returnValue;
	}
};
