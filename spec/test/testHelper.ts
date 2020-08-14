import * as glob from "glob"
import Spec from "../lib/spec"

const testFilePaths = glob.sync(__dirname + "**/*Test.ts")
const imports = testFilePaths.map(testFile => import(testFile))

let done = false
function keepAlive() {
  setTimeout(() => {
    if (!done) keepAlive()
  }, 100)
}

keepAlive()
Promise.all(imports).then(() => {
  return Spec.run()
}).then(() => {
  done = true
}).catch(e => {
  done = true
  throw e
})
