import assert from "../lib/assert"
import Spec, { Runner } from "../lib/spec"

Spec.test("runner runs tests", async () => {
  const runner = new Runner()
  runner.reporter = undefined

  let called = false

  runner.test("fake", () => {
    called = true
  })

  await runner.run()
  assert(called)
})

Spec.test("runner times out tests", async () => {
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

Spec.test("throws when test name is duplicated", async () => {
  const runner = new Runner()
  runner.reporter = undefined
  runner.testTimeout = 100

  runner.test("dupe", () => {})

  const error = await assert.throws(() => {
    runner.test("dupe", () => {})
  })

  assert.match(/Duplicate.*dupe/, error.message)
})
