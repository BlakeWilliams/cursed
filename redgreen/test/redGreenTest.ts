import assert from "../lib/assert"
import RedGreen, { Runner } from "../lib/redgreen"

RedGreen.test("hello world", () => {
  assert(false)
})

RedGreen.test("hello world", () => {
})
