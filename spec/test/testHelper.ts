import * as glob from "glob"
import Spec from "../lib/spec"

const testFilePaths = glob.sync(__dirname + "**/*Test.ts")
const imports = testFilePaths.map(testFile => import(testFile))

Promise.all(imports).then(() => {
  return Spec.run()
})
