import assert from "../lib/assert"
import RedGreen, { Runner } from "../lib/redgreen"

RedGreen.test("runner runs tests", async () => {
  const runner = new Runner()
  runner.reporter = undefined

  let called = false

  runner.test("fake", () => {
    called = true
  })

  await runner.run()
  assert(called)
})

RedGreen.test("runner times out tests", async () => {
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
