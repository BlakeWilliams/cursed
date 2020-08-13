import Test, { TestFn } from "./test"
import Reporter, { Reportable } from "./reporter"

export class Runner {
  tests: Test[] = []
  reporter?: Reportable

  constructor() {
    this.reporter = new Reporter()
  }

  test(name: string, testFn: TestFn) {
    debugger
    const test = new Test(name, testFn)
    this.tests.push(test)
  }

  async run() {
    this.reporter?.testRunStart(this)
    const values = this.tests.map(test => {
      const value = test.run()
      this.reporter?.testRunResult(test)

      return value
    })
    const promises = values.filter(value => value instanceof Promise)

    await Promise.all(promises)
    await this.reporter?.testRunEnd(this)
  }
}

export default new Runner()
