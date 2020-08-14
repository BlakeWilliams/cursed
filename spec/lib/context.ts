import type { Runner } from "./spec"
import Test, { TestFn } from "./test"

type CallbackFn = (test: Test) => void | Promise<any>

export default class Context {
  name: string
  runner: Runner
  private beforeEachFn?: CallbackFn
  private afterEachFn?: CallbackFn

  constructor(name: string, runner: Runner) {
    this.name = name
    this.runner = runner
  }

  beforeEach(fn: CallbackFn) {
    this.beforeEachFn = fn
  }

  afterEach(fn: CallbackFn) {
    this.afterEachFn = fn
  }

  async runBeforeEach(test: Test) {
    await this.beforeEachFn?.(test)
  }

  async runAfterEach(test: Test) {
    await this.afterEachFn?.(test)
  }

  test(name: string, testFn: TestFn) {
    return this.runner.test(name, testFn, this)
  }

  run(fn: (context: this) => void) {
    fn.call(undefined, this)
  }
}
