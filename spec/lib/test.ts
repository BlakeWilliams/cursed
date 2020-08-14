import runWithTimeout from "./runWithTimeout"

export type TestFn = () => void | Promise<any>

export default class Test {
  name: String
  testFn: TestFn
  failure?: Error

  constructor(name: string, testFn: TestFn) {
    this.name = name
    this.testFn = testFn
  }

  async run() {
    try {
      await this.testFn()
    } catch(e) {
      this.failure = e
    }
  }

  async runWithTimeout(timeout: number) {
    try {
      await runWithTimeout(this.testFn, timeout)
    } catch(e) {
      if (!this.failure) {
        this.failure = e
      }
    }
  }
}