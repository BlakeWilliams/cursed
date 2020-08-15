import { request } from 'http';

import Metal, { Context } from "../index"
import assert from "../../spec/lib/assert"
import Spec from "../../spec/lib/spec"
import runWithTimeout from "../../spec/lib/runWithTimeout"

let metal: Metal

Spec.describe("Metal", c => {
  c.beforeEach(async () => {
    metal = new Metal({ port: 9127 })
    await metal.serve()
  })

  c.afterEach(() => {
    metal.stop()
  })

  c.test("middleware runs and returns correct status code", async () => {
    const simpleMiddleware = {
      async call(c: Context) {
        c.res.status = 201
        c.res.addHeader("content-type", "text/plain")
        c.res.body = "hello world"
      }
    }
    metal.stack.push(simpleMiddleware)
    let res = await getResponse()

    assert.equal(201, res.status)
    assert.equal("text/plain", res.headers["content-type"])
    assert.equal("hello world", res.body)
  })

  c.test("multiple middleware can run", async () => {
    const firstMiddleware = {
      async call(c: Context) {
        c.res.status = 201
        c.next()
      }
    }

    const secondMiddleware = {
      async call(c: Context) {
        c.res.body = "hello world"
        c.next()
      }
    }
    metal.stack.push(firstMiddleware)
    metal.stack.push(secondMiddleware)
    let res = await getResponse()

    assert.equal(201, res.status)
    assert.equal("hello world", res.body)
  })

  c.test("middleware can prevent other middleware from running", async () => {
    const firstMiddleware = {
      async call(c: Context) {
        c.res.status = 401
      }
    }

    const secondMiddleware = {
      async call(c: Context) {
        c.res.status = 200
        c.next()
      }
    }
    metal.stack.push(firstMiddleware)
    metal.stack.push(secondMiddleware)
    let res = await getResponse()

    assert.equal(401, res.status)
    assert.equal("", res.body)
  })

  c.test("returns 500 and no body when an error occurs", async () => {
    const badMiddleware = {
      async call() {
        throw "oh no"
      }
    }

    metal.stack.push(badMiddleware)
    let res = await getResponse()

    assert.equal(500, res.status)
    assert.equal("", res.body)
  })
})


interface HttpResponse {
  status: number
  headers: any
  body: string
}

function getResponse(path: string = "/"): Promise<HttpResponse> {
  return new Promise((resolve, reject) => {
    let body = ''
    const req = request({ host: "localhost", port: 9127, path: path, method: "GET" }, response => {
      response.on("close", reject)
      response.on('data', chunk => {
        body += chunk
      })

      response.on('end', () => {
        resolve({
          status: response.statusCode!,
          headers: response.headers,
          body: body
        })
      })
    })

    req.on('error', reject)
    req.end()
  })
}
