import * as glob from "glob"
import RedGreen from "../lib/redgreen"

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
  return RedGreen.run()
}).then(() => {
  done = true
}).catch(e => {
  done = true
  throw e
})
