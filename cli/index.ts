import chalk from "chalk";
import Cursed from "./lib/cursed";
import Command from "./lib/command";

const cursed = new Cursed(process.stdout);

export { Cursed, Command };

export default cursed;
