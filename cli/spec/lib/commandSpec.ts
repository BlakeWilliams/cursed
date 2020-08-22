import spec, { assert } from "@cursed/spec";
import Command from "../../lib/command";

spec.describe("Command", (c) => {
  c.test("parses boolean flag arguments", async () => {
    let recursiveVal: boolean = false;

    const command = new Command("test", "test")
      .flag("recursive", "desc")
      .do((args: any) => {
        recursiveVal = args.recursive;
      });

    await command.run(["--recursive"]);

    assert(recursiveVal);
  });

  c.test("parses value arguments", async () => {
    let nameVal: boolean = false;

    const command = new Command("test", "test")
      .flag("name", "sets the name")
      .do((args: any) => {
        nameVal = args.name;
      });

    await command.run(["--name=Fox Mulder"]);

    assert.equal(nameVal, "Fox Mulder");
  });

  c.test("accepts positional arguments", async () => {
    let testNameVal: string = "";
    let testNumberVal: string = "";

    const command = new Command("test", "test")
      .args("testName", "testNumber")
      .do((args: any) => {
        testNameVal = args.testName;
        testNumberVal = args.testNumber;
      });

    await command.run(["test/fooTest.ts", "12"]);
    assert.equal("test/fooTest.ts", testNameVal);
    assert.equal("12", testNumberVal);
  });

  c.test("works with mixed arguments", async () => {
    let receivedArgs: any = {};

    const command = new Command("test", "desc")
      .flag("recursive", "desc")
      .flag("directory", "desc")
      .args("testName", "testNumber")
      .do((args: any) => {
        receivedArgs = args;
      });

    await command.run(["--directory=test", "--recursive", "test/fooTest.ts"]);

    assert.equal("test", receivedArgs.directory);
    assert(receivedArgs.recursive);
    assert.equal("test/fooTest.ts", receivedArgs.testName);
  });
});
