import chalk from "chalk";
import Parser from "./lib/cursed";
import Command from "./lib/command";

const parser = new Parser(process.stdout);

export { Command };

export default parser;
