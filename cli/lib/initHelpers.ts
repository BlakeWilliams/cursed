import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";

export default {
  createFile(filePath: string, content: string) {
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, content);
    console.log(chalk`{green Creating file: ${filePath}}`);
  },

  appendToFile(filePath: string, content: string) {
    console.log(chalk`{green Appending file: ${filePath}}`);
    if (!fs.existsSync(filePath)) {
      console.log(chalk`{red file {bold ${filePath}} does not exist}`);
    }
    fs.appendFileSync(filePath, content);
  },

  info(text: string) {
    console.log(chalk`{blue ${text}}`);
  },
};
