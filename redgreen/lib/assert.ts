import chalk from 'chalk'

export class TestError extends Error {
  constructor(message: string, context: any = TestError) {
    super(message)
    Error.captureStackTrace(this, context)
  }
}

export default function assert(value: any) {
  if (!value) {
    throw new TestError(`Expected ${value} to be truthy`, assert)
  }
}

assert.match = function(match: RegExp, string: string) {
  if (!string.match(match)) {
    throw new TestError(
      chalk`{gray Expected:} {green '${string}'}\n{gray To match:} {red ${match.toString()}}`,
      assert.match
    )
  }
}
