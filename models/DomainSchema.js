import mongoose, { Schema } from "mongoose";
import moment from "moment";
const domainSchema = new Schema({
	url: { type: String, unique: true, required: true },
	createdAt: { type: Number, default: moment().valueOf() }
});
const Domain = mongoose.model("Domains", domainSchema);
export default Domain;
