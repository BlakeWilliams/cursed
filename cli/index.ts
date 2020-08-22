import chalk from "chalk";
import Cursed from "./lib/cursed";
import Command from "./lib/command";
import initHelpers from "./lib/initHelpers";

const cursed = new Cursed(process.stdout);

export { initHelpers, Cursed, Command };

export default cursed;
