export class TestError extends Error {
  constructor(message: string, context: any = TestError) {
    super(message)
    Error.captureStackTrace(this, context)
  }
}

export default function assert(value: any, message?: string) {
  if (!value) {
    throw new TestError(message || `Expected ${value} to be truthy`, assert)
  }
}
