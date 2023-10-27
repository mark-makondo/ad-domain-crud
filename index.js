import fs from "fs";
import MongoDB from "./classes/MongoDB.js";
import express from "express";
import DomainSchema from "./models/DomainSchema.js";
import dotenv from "dotenv";
dotenv.config();
(async () => {
	const app = express();
	const port = process.env.PORT || 3000;
	const MONGO_URL = process.env.MONGO_URL;
	const mongoDB = new MongoDB(MONGO_URL);
	await mongoDB.connect();

	app.get("/start", async (_, res) => {
        const domains = getDomainsFromTxt();
        console.log("Saving [%s] items to database...", domains.length)
		// if an error is thrown here, it's probably because you're trying to insert duplicate items
		// and if that happens it will just skip that item and continue saving the rest
        await DomainSchema.insertMany(domains, { ordered: false });
        console.log("Saved [%s] items to database", domains.length)
		res.sendStatus(200);
	});

	// Start the server
	app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
})();

export const getDomainsFromTxt = (dirList = "./resources/list.txt") => {
	// read file into array of lines
	const fileContent = fs.readFileSync(dirList, "utf-8");
	const lines = fileContent.split("\n");
	// split lines by space
	const list = lines.map((line) => line.split(" ").filter(Boolean));
	// get last item of each line
	const domains = list.map((line) => ({ url: line.pop() }));
	return domains;
};
