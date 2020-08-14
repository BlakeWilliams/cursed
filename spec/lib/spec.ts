import Test, { TestFn } from "./test"
import Reporter, { Reportable } from "./reporter"

export class Runner {
  tests: Test[] = []
  reporter?: Reportable
  testTimeout: number = 5000
  working: boolean = false

  constructor() {
    this.reporter = new Reporter()
  }

  test(name: string, testFn: TestFn): Test {
    const test = new Test(name, testFn)
    this.tests.push(test)

    return test
  }

  async run() {
    try {
      this.startKeepAlive()
      this.reporter?.testRunStart(this)
      const testRuns = this.tests.map(async (test) => {
        await test.runWithTimeout(this.testTimeout)
        this.reporter?.testRunResult(test)
      })

      await Promise.all(testRuns)
      await this.reporter?.testRunEnd(this)
    } finally {
      this.stopKeepAlive()
    }
  }

  startKeepAlive() {
    setTimeout(() => {
      if (this.working) this.startKeepAlive()
    }, 100)
  }

  stopKeepAlive() {
    this.working = false
  }
}

export default new Runner()
