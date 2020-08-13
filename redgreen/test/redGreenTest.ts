import assert from "../lib/assert"
import RedGreen, { Runner } from "../lib/redgreen"

RedGreen.test("hello world", async () => {
  const runner = new Runner()
  runner.reporter = undefined

  let called = false

  runner.test("fake", () => {
    called = true
  })

  await runner.run()
  assert(called, "Expected called to be truthy")
})

RedGreen.test("hello world", () => {
})
