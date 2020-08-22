import { Cursed } from "./";

export async function spec(cursed: Cursed) {
  try {
    const specHelper = await import("./spec/specHelper");
    const spec = await import("@cursed/spec");
    // @ts-ignore
    spec.createCursedCommands(specHelper.default)(cursed);
  } catch (e) {
    console.error("Could not load spec commands");
    console.error(e);
  }
}
