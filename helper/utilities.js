const fs = require("fs");


export const transformFileContents = (dirList, dirOutput ="./output/output.txt") => {
    const dir = "./list.txt";
    // read file into array of lines
    const fileContent = fs.readFileSync(dir, "utf-8");
    const lines = fileContent.split("\n");
    const list = lines.map((line) => line.split(" "));
    const domains = list.map((line) => line.pop());
    // transfer the list into a new file
    fs.writeFileSync(dirOutput, domains.join("\n"));
}