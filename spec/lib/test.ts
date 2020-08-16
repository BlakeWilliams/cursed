import runWithTimeout from "./runWithTimeout";
import type Context from "./context";

export type TestFn = () => void | Promise<any>;

export default class Test {
  name: string;
  testFn: TestFn;
  failure?: Error;
  context?: Context;

  constructor(name: string, testFn: TestFn, context?: Context) {
    this.name = name;
    this.testFn = testFn;
    this.context = context;
  }

  get nameWithContext(): string {
    if (this.context) {
      return `${this.context.name} - ${this.name}`;
    } else {
      return this.name;
    }
  }

  async runWithTimeout(timeout: number) {
    try {
      await this.context?.runBeforeEach(this);
      await runWithTimeout(this.testFn, timeout);
    } catch (e) {
      if (!this.failure) {
        this.failure = e;
      }
    } finally {
      await this.context?.runAfterEach(this);
    }
  }
}
