import chalk from "chalk"
import Test, { TestFn } from "./test"
import Reporter, { Reportable } from "./reporter"

interface RunnerTests {
  [key: string]: Test
}

export class Runner {
  private allTests: RunnerTests = {}
  reporter?: Reportable
  testTimeout: number = 5000
  working: boolean = false

  constructor() {
    this.reporter = new Reporter()
  }

  get tests() {
    return Object.values(this.allTests)
  }

  test(name: string, testFn: TestFn): Test {
    if (this.allTests[name]) {
      throw new Error(chalk`{red Duplicate test defined:} ${name}`)
    }

    const test = new Test(name, testFn)
    this.allTests[name] = test
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
