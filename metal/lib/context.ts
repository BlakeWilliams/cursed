import type Metal from "../index"
import type Request from "./request"
import type Response from "./response"

export default class Context {
  private metal: Metal
  res: Response
  req: Request
  currentMiddlewareIndex: number = 0

  constructor(metal: Metal, req: Request, res: Response) {
    this.metal = metal
    this.req = req
    this.res = res
  }

  async next() {
    // TODO track each promise to ensure we wait for completion
    const currentMiddleware = this.metal.stack[this.currentMiddlewareIndex]

    if (currentMiddleware) {
      this.currentMiddlewareIndex += 1
      await currentMiddleware.call(this)
    }
  }
}

