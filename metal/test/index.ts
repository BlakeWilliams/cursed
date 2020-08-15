import Spec from "../../spec/lib/spec"
// @ts-ignore
import log from "why-is-node-running"


Spec.importTests(__dirname).then(() => Spec.run())
