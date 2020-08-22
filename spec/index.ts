import Runner from "./lib/runner";
import Reporter, { Reportable } from "./lib/reporter";
import Test from "./lib/test";
import type Context from "./lib/context";
import createCursedCommands from "./lib/createCursedCommands";
import cursedInit from "./lib/cursedInit";
import assert from "./lib/assert";

export {
  assert,
  createCursedCommands,
  cursedInit,
  Runner,
  Reporter,
  Reportable,
  Test,
};
export type { Context };

export default new Runner();
