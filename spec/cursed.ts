import spec from "@cursed/spec";
import createCursedCommands from "./lib/cursedCommands";

// @ts-ignore
const commands = createCursedCommands(spec);

export default commands;
