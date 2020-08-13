import * as glob from "glob"
import RedGreen from "../lib/redgreen"

const testFilePaths = glob.sync(__dirname + "**/*Test.ts")
const imports = testFilePaths.map(testFile => import(testFile))

Promise.all(imports).then(_ => {
  RedGreen.run()
})
