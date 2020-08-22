import { initHelpers } from "@cursed/cli";

export default async function (args: string[]) {
  await initHelpers.createFile("spec/specHelper.ts", specHelperContent);
  await initHelpers.createFile("spec/exampleSpec.ts", exampleSpecContent);

  await initHelpers.appendToFile(
    "./cursed.ts",
    `
export async function spec(cursed: Cursed) {
  try {
    const specHelper = await import("./spec/specHelper")
    const spec = await import("@cursed/spec")
    spec.createCursedCommands(specHelper.default)(cursed)
  } catch(e) {
    console.error("Could not load spec commands")
    console.error(e)
  }
}`
  );
}

const specHelperContent = `import spec, { assert } from "@cursed/spec"

const helpers = {}

export { assert, helpers }
export default spec
`;

const exampleSpecContent = `import spec, { assert, helpers } from "./specHelper"

spec.describe("My app", c => {
  c.test("it works", () => {
    assert(true)
  })
})
`;
