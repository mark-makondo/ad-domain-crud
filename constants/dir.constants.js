import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const BASE_PATH = path.join(__dirname, "../");

export const LIST_DIR = `${BASE_PATH}/resources/list.txt`;
export const OUTPUT_TEXT_DIR = `${BASE_PATH}/output/output.txt`;
export const OUTPUT_JSON_DIR = `${BASE_PATH}/output/output.json`;
