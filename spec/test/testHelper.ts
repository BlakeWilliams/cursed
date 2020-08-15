import Spec from "../lib/spec"

Spec.importTests(__dirname).then(() => Spec.run())
