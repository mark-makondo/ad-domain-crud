import MongoDB from "./classes/MongoDB.js";
import express from "express";
import DomainSchema from "./models/DomainSchema.js";
import { createOutputJsonFile, getDomainsFromTxt, convertTxtToJson } from "./helper/utilities.js";
import dotenv from "dotenv";
dotenv.config();
(async () => {
	const PORT = process.env.PORT || 3000;
	const MONGO_URL = process.env.MONGO_URL;
	const DOMAIN = process.env.DOMAIN;
	const app = express();
	const mongoDB = new MongoDB(MONGO_URL);
	await mongoDB.connect();

	app.get("/start", async (_, res) => {
		const domains = await getDomainsFromTxt();
		console.log("Saving [%s] items to database...", domains.length);
		// if an error is thrown here, it's probably because you're trying to insert duplicate items
		// and if that happens it will just skip that item and continue saving the rest
		await DomainSchema.insertMany(domains, { ordered: false });
		console.log("Saved [%s] items to database", domains.length);
		res.sendStatus(200);
	});

	app.get("/domains", async (_, res) => {
		console.log("Getting domains from database...");
		const domains = await DomainSchema.find({}, { url: 1 });
		console.log("Got [%s] domains from database", domains.length);
		await createOutputJsonFile(domains);
		res.sendStatus(200);
	});

	app.get("/convert", async (_, res) => {
		console.log("Converting txt to json...");
		await convertTxtToJson();
		console.log("Converted txt to json");
		res.sendStatus(200);
	});

	// Start the server
	app.listen(PORT, DOMAIN, () => console.log(`Server is running:DOMAIN[${DOMAIN}]:PORT[${PORT}]`));
})();
