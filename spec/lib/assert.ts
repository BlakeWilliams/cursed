import chalk from "chalk";

export class TestError extends Error {
  constructor(message: string, context: any = TestError) {
    super(message);
    Error.captureStackTrace(this, context);
  }
}

export default function assert(value: any) {
  if (!value) {
    throw new TestError(`Expected ${value} to be truthy`, assert);
  }
}

assert.equal = function (received: any, expected: any) {
  if (Array.isArray(expected)) {
    if (Array.isArray(received)) {
      if (expected.length != received.length) {
        throw new TestError(
          chalk`{gray Expected:} {green '${expected}'}\n{red to equal:} {red ${received}}\n${expected.length} elements vs ${received.length} elements`,
          assert.match
        );
      }

      for (let i = 0; i < expected.length; i++) {
        // TODO write nicer diff that shows +3/-3 around error
        if (expected[i] != received[i]) {
          throw new TestError(
            chalk`{gray Expected:} {green '${expected}'}\n{red to equal:} {red ${received}}`,
            assert.match
          );
        }
      }
    } else {
      throw new TestError(
        chalk`{gray Expected an array:} {green '${expected}'}\n{got other type:} {red ${received}}`,
        assert.match
      );
    }
  } else {
    if (received != expected) {
      throw new TestError(
        chalk`{gray Expected:} {green '${expected}'}\n{gray To equal:} {red '${received}'}`,
        assert.match
      );
    }
  }
};

assert.match = function (match: RegExp, string: string) {
  if (!string.match(match)) {
    throw new TestError(
      chalk`{gray Expected:} {green '${string}'}\n{gray To match:} {red ${match.toString()}}`,
      assert.match
    );
  }
};

assert.throws = async function (fn: () => any) {
  try {
    await fn();
  } catch (e) {
    return e;
  }

  throw new TestError(`expected an exception, got none`);
};
