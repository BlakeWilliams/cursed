import chalk from "chalk";
import * as path from "path";
import type Test from "./test";
import Runner from "./runner";

let TRACE_REGEX = /(\/.*)+(:\d+:\d+)$/;

export interface Reportable {
  testRunStart(runner: Runner): void | Promise<any>;
  testRunEnd(runner: Runner): void | Promise<any>;
  testRunResult(test: Test): void | Promise<any>;
}

export default class Reporter implements Reportable {
  failures: Test[] = [];
  successes: Test[] = [];

  testRunStart(runner: Runner) {
    process.stdout.write(
      `Starting test suite with ${runner.tests.length} tests...\n\n`
    );
  }

  testRunResult(test: Test) {
    if (test.failure) {
      process.stdout.write(chalk`{red .}`);
      this.failures.push(test);
    } else {
      process.stdout.write(chalk`{green .}`);
      this.successes.push(test)
    }
  }

  testRunEnd(runner: Runner) {
    const passingCount = this.successes.length
    const skippedCount = runner.tests.length - (this.failures.length + this.successes.length)

    process.stdout.write("\n\n");
    process.stdout.write(chalk`  {green ${passingCount} passing tests}\n`);
    if (skippedCount != 0) {
      process.stdout.write(chalk`  {yellow ${skippedCount} skipped tests}\n`);
    }
    process.stdout.write(
      chalk`  {red ${this.failures.length} failing tests}\n`
    );

    if (this.failures.length > 0) {
      this.failures.forEach((test: Test, index: number) => {
        process.stdout.write(
          chalk`\n{red ${index + 1})} ${test.nameWithContext}`
        );

        const exceptionPath = this.exceptionTestPath(test.failure!);

        if (exceptionPath) {
          process.stdout.write(chalk` {gray ${exceptionPath}}\n`);
        }

        process.stdout.write("\n");
        process.stdout.write(
          `   ${test.failure!.message.split("\n").join("\n   ")}\n`
        );
      });
    }
  }

  exceptionTestPath(exception: Error): string | undefined {
    if (exception.stack) {
      const stack = exception.stack.split("\n");
      const firstTrace = stack.find((x) => x.match(/^\s+at/));

      if (firstTrace) {
        const traceParts = firstTrace.match(TRACE_REGEX);

        if (traceParts && traceParts.length >= 3) {
          const [_, filePath, lineNumbers] = traceParts;
          return `./${path.relative(process.env.PWD!, filePath)}${lineNumbers}`;
        }
      }
    }
  }
}
