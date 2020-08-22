import Runner from "../lib/runner";
import spec, { assert } from "@cursed/spec";

let runner: Runner;

spec.describe("Runner", (c) => {
  c.beforeEach(() => {
    runner = new Runner();
    runner.reporter = undefined;
    runner.testTimeout = 100;
  });

  c.test("runs tests", async () => {
    let called = false;

    runner.test("fake", () => {
      called = true;
    });

    await runner.run();
    assert(called);
  });

  c.test("times out tests", async () => {
    const timedOutTest = runner.test("fake", () => {
      return new Promise(() => {}); // never returns
    });

    await runner.run();
    assert(timedOutTest.failure);
    assert.match(/timed out.*100ms/, timedOutTest.failure!.message);
  });

  c.test("throws when test name is duplicated", async () => {
    runner.test("dupe", () => {});

    const error = await assert.throws(() => {
      runner.test("dupe", () => {});
    });

    assert.match(/Duplicate.*dupe/, error.message);
  });

  c.test(
    "does not throw when test name is duplicated in different context",
    async () => {
      runner.describe("one", (c) => c.test("dupe", () => {}));
      runner.describe("two", (c) => c.test("dupe", () => {}));
    }
  );

  c.test("throws when test name is duplicated in same context", async () => {
    const error = await assert.throws(() => {
      runner.describe("one", (c) => c.test("dupe", () => {}));
      runner.describe("one", (c) => c.test("dupe", () => {}));
    });

    assert.match(/Duplicate.*dupe/, error.message);
  });

  c.test("calls context callbacks and test in correct order", async () => {
    const expected = ["before", "test", "after"];
    const received: string[] = [];

    runner.describe("test", (c) => {
      c.beforeEach(async () => {
        received.push("before");
      });

      c.afterEach(async () => {
        received.push("after");
      });

      c.test("test", async () => {
        received.push("test");
      });
    });

    await runner.run();

    assert.equal(received, expected);
  });

  c.test("grepPattern fiters out tests that don't match", async () => {
    let runTests: string[] = []
    runner.describe("test", (c) => {
      c.test("runs", async () => {
        runTests.push("runs")
      });

      c.test("also runs", async () => {
        runTests.push("also runs")
      });

      c.test("does not run", async () => {
        runTests.push("does not run")
      });
    });

    runner.grepPattern = "(also )?runs"
    await runner.run();

    assert.equal(["runs", "also runs"], runTests);
  })
});
