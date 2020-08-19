import chalk from "chalk";
import Stream from "stream";
import Cursed from "../../lib/cursed";
import { Command } from "../../index";
import Spec, { assert } from "@cursed/spec";

let cursed: Cursed;
let out: string;

Spec.describe("cursed", (c) => {
  c.beforeEach(() => {
    out = "";

    const stream = new Stream.Writable();
    stream._write = (chunk, _encoding, next) => {
      out += chunk.toString();
      next();
    };
    cursed = new Cursed(stream);

    chalk.level = 0;
  });

  c.afterEach(() => {
    chalk.level = 3;
  });

  c.test("outputs help with help", () => {
    cursed.run(["node", "script", "help"]);
    assert.match(/USAGE/, out);
  });

  c.test("outputs help with --help", () => {
    cursed.run(["node", "script", "--help"]);
    assert.match(/USAGE/, out);
  });

  c.test("outputs version with version", () => {
    cursed.run(["node", "script", "version"]);
    assert.match(/cursed version \d+\.\d+\.\d+/, out);
  });

  c.test("outputs version with --version", () => {
    cursed.run(["node", "script", "--version"]);
    assert.match(/cursed version \d+\.\d+\.\d+/, out);
  });

  c.test(
    "lists script/user defined commands when command is `commands`",
    async () => {
      cursed
        .addCommand("hello", "says hello")
        .args("user name")
        .do((args: any) => {});
      await cursed.run(["node", "script", "commands"]);

      assert.match(/hello <user name>/, out);
    }
  );

  c.test("commands get extra parameters", async () => {
    let receivedArgs: any = [];

    cursed
      .addCommand("hello", "says hello")
      .args("user name")
      .do((args: any) => {
        receivedArgs = args;
      });
    // cursed hello 'Fox Mulder'
    await cursed.run(["node", "script", "hello", "Fox Mulder"]);

    assert.equal("Fox Mulder", receivedArgs["user name"]);
  });
});
