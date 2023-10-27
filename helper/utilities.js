import fs, { promises } from "fs";
import { LIST_DIR, OUTPUT_TEXT_DIR, OUTPUT_JSON_DIR } from "../constants/dir.constants.js";

export const transformFileContents = async (dir = LIST_DIR, dirOutput = OUTPUT_TEXT_DIR) => {
	// read file into array of lines
	const fileContent = await promises.readFile(dir, { encoding: "utf-8" });
	const lines = fileContent.split("\n");
	const list = lines.map((line) => line.split(" "));
	const domains = list.map((line) => line.pop());
	// transfer the list into a new file
	await promises.writeFile(dirOutput, domains.join("\n"));
};

export const getDomainsFromTxt = async (dirList = LIST_DIR) => {
	// read file into array of lines
	const fileContent = await promises.readFile(dirList, { encoding: "utf-8" });
	const lines = fileContent.split("\n");
	// split lines by space
	const list = lines.map((line) => line.split(" ").filter(Boolean));
	// get last item of each line
	const domains = list.map((line) => ({ url: line.pop() }));
	return domains;
};

export const createOutputTextFile = (domains = [], outputDir = OUTPUT_TEXT_DIR) => {
	console.log("Writing domains to file...");
	const file = fs.createWriteStream(outputDir);
	file.on("error", (err) => console.error(err));
	domains.forEach((domain) => file.write(domain.url + "\n"));
	file.end();
	console.log("Wrote domains to file: %s", outputDir);
};

export const createOutputJsonFile = async (domains = [], outputDir = OUTPUT_JSON_DIR, options) => {
	const { spacing = 4 } = options || {};
	console.log("Writing domains to file...");
	try {
		const fileStream = fs.createWriteStream(outputDir, { encoding: "utf8" });
		fileStream.write("[");
		for (let idx = 0; idx < domains.length; idx++) {
			if (idx > 0) fileStream.write(",");
			const domain = domains[idx];
			const domainObj = {
				id: 5000 + idx,
				priority: 1,
				action: { type: "block" },
				condition: {
					urlFilter: `*://${domain.url}/*`,
					resourceTypes: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
				}
			};
			fileStream.write(JSON.stringify(domainObj, null, spacing));
		}
		fileStream.write("]");
		fileStream.end();
		console.log("Wrote domains to file: %s", outputDir);
	} catch (err) {
		console.error(err);
	}
};

export const convertTxtToJson = async (dirText = OUTPUT_TEXT_DIR, dirJson = OUTPUT_JSON_DIR) => {
	const domains = await getDomainsFromTxt(dirText);
	await createOutputJsonFile(domains, dirJson);
};
