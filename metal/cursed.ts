import type { Cursed } from "@cursed/cli";

export async function spec(cursed: Cursed) {
  try {
    const specHelper = await import("./spec/specHelper");
    const spec = await import("@cursed/spec");
    spec.createCursedCommands(specHelper.default)(cursed);
  } catch (e) {
    console.error("Could not load spec commands");
    console.error(e);
  }
}
