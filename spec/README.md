# @cursed/spec

A simple test framework with sane defaults.

## Installing @cursed/spec

In your project, run `npm install @cursed/spec --save-dev`

## Usage

Create a `test` directory.

Create the `test/index.ts` with the following:

```typescript
import Spec from "@cursed/spec"

Spec.importTests(__dirname).then(() => Spec.run())
```

Now, test files in `test` that end in `Test.ts` or `Test.js` will be imported
and run.

If using TypeScript, you can run the tests via `npx ts-node test/index.ts`

If using JavaScript, you can run the tests via `node test/index.js`

## Defining a Test

The default export of `@cursed/spec` is an instance of `Runner` so you can
`import Spec from "@cursed/spec"` and immediately begin writing tests:

```typescript
// test/myTest.ts
import Spec, { assert } from "@cursed/spec"

let instance
Spec.describe("MyClass", c => {
  c.beforeEach(() => {
    instance = new MyClass()
  })

  c.test("it does something", async () => {
    await instance.perform()

    assert(instance.ran)
    assert.equal(1, instance.runCount)
  })
})
```
