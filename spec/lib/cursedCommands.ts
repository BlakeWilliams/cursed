import path from "path";
import type { Cursed, Command } from "@cursed/cli";
import Runner from "./runner";

export default (spec: Runner) => {
  return function (cursed: Cursed) {
    cursed
      .addCommand("test <filter>", async (args: string[]) => {
        if (args.length) {
          for (const arg of args) {
            const file =
              process.cwd() + "/" + path.relative(process.cwd(), arg);

            await import(file);
          }
          await spec.run();
        } else {
          await spec
            .importTests(process.cwd() + "/test")
            .then(() => spec.run());
        }
      })
      .describe("runs tests");
  };
};
