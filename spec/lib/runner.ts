import chalk from "chalk";
import glob from "glob";
import Test, { TestFn } from "./test";
import Reporter, { Reportable } from "./reporter";
import Context from "./context";

interface RunnerTests {
  [key: string]: Test;
}

export default class Runner {
  private allTests: RunnerTests = {};
  reporter?: Reportable;
  grepPattern?: string;
  testTimeout: number = 5000;
  working: boolean = false;

  constructor() {
    this.reporter = new Reporter();
  }

  get tests() {
    const tests = Object.values(this.allTests);

    if (this.grepPattern) {
      const pattern = new RegExp(this.grepPattern);

      return tests.filter((test) => test.nameWithContext.match(pattern));
    } else {
      return tests;
    }
  }

  describe(name: string, fn: (context: Context) => void) {
    const context = new Context(name, this);
    context.run(fn);

    return context;
  }

  test(name: string, testFn: TestFn, context?: Context): Test {
    const test = new Test(name, testFn, context);

    if (this.allTests[test.nameWithContext]) {
      throw new Error(chalk`{red Duplicate test defined:} ${name}`);
    } else {
      this.allTests[test.nameWithContext] = test;
    }

    return test;
  }

  async importTests(root: string, pathGlob: string = "/**/*Spec.@(ts|js)") {
    const testFilePaths = glob.sync(root + pathGlob);
    const imports = testFilePaths.map((path) => import(path));

    await Promise.all(imports);
  }

  async run() {
    try {
      this.startKeepAlive();
      this.reporter?.testRunStart(this);

      for (let test of this.tests) {
        await test.runWithTimeout(this.testTimeout);
        this.reporter?.testRunResult(test);
      }

      await this.reporter?.testRunEnd(this);
    } catch (e) {
      console.log(e);
      process.exit(1);
    } finally {
      this.stopKeepAlive();
    }
  }

  startKeepAlive() {
    setTimeout(() => {
      if (this.working) this.startKeepAlive();
    }, 100);
  }

  stopKeepAlive() {
    this.working = false;
  }
}
