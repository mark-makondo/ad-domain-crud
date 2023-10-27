import mongoose from "mongoose";

export default class MongoDB {
	constructor(url) {
		this.url = url || "mongodb://localhost:27017/mydatabase";
	}

	async connect() {
		try {
			console.log("Connecting to MongoDB...");
			await mongoose.connect(this.url, { useNewUrlParser: true, useUnifiedTopology: true });
			console.log("Connected to MongoDB");
		} catch (error) {
			console.error("Error connecting to MongoDB: ", error.message);
		}
	}
}
