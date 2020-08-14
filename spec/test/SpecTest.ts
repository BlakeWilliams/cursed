import assert from "../lib/assert"
import Spec, { Runner } from "../lib/spec"


Spec.describe("Runner", c => {
  c.test("runs tests", async () => {
    const runner = new Runner()
    runner.reporter = undefined

    let called = false

    runner.test("fake", () => {
      called = true
    })

    await runner.run()
    assert(called)
  })

  c.test("times out tests", async () => {
    const runner = new Runner()
    runner.reporter = undefined
    runner.testTimeout = 100

    const timedOutTest = runner.test("fake", () => {
      return new Promise(() => {}) // never returns
    })

    await runner.run()
    assert(timedOutTest.failure)
    assert.match(/timed out.*100ms/, timedOutTest.failure!.message)
  })

  c.test("throws when test name is duplicated", async () => {
    const runner = new Runner()
    runner.reporter = undefined
    runner.testTimeout = 100

    runner.test("dupe", () => {})

    const error = await assert.throws(() => {
      runner.test("dupe", () => {})
    })

    assert.match(/Duplicate.*dupe/, error.message)
  })

  c.test("does not throw when test name is duplicated in different context", async () => {
    const runner = new Runner()
    runner.reporter = undefined
    runner.testTimeout = 100

    runner.describe("one", c => c.test("dupe", () => {}))
    runner.describe("two", c => c.test("dupe", () => {}))
  })

  c.test("throws when test name is duplicated in same context", async () => {
    const runner = new Runner()
    runner.reporter = undefined
    runner.testTimeout = 100

    const error = await assert.throws(() => {
      runner.describe("one", c => c.test("dupe", () => {}))
      runner.describe("one", c => c.test("dupe", () => {}))
    })


    assert.match(/Duplicate.*dupe/, error.message)
  })
})

