import path from "path";
import type { Cursed, Command } from "@cursed/cli";
import Runner from "./runner";

export default (spec: Runner) => {
  return function (cursed: Cursed) {
    cursed
      .addCommand("test", "runs tests")
      .flag("grep", "only run tests matching passed in regular expression")
      .args("test").
      do(async (args: any) => {
        spec.grepPattern = args.grep

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
