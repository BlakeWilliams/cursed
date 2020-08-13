import Test, { TestFn } from "./test"
import Reporter, { Reportable } from "./reporter"

export class Runner {
  tests: Test[] = []
  reporter?: Reportable
  testTimeout: number = 5000

  constructor() {
    this.reporter = new Reporter()
  }

  test(name: string, testFn: TestFn): Test {
    const test = new Test(name, testFn)
    this.tests.push(test)

    return test
  }

  async run() {
    this.reporter?.testRunStart(this)
    const testRuns = this.tests.map(async (test) => {
      await test.runWithTimeout(this.testTimeout)
      this.reporter?.testRunResult(test)
    })

    await Promise.all(testRuns)
    await this.reporter?.testRunEnd(this)
  }
}

export default new Runner()
