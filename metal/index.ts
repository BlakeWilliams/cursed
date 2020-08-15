import * as http from 'http';
import Request from "./lib/request"
import Response from "./lib/response"

import Context from "./lib/context"

// Re-export for convenience
export { Context }

export interface Headers {
  [key: string]: string
}

export interface MetalConf {
  port: number
}

export interface Middleware {
  call(c: Context): Promise<any>
}

export default class Metal {
  config: MetalConf
  stack: Middleware[] = []
  server?: http.Server

  constructor(config: MetalConf) {
    this.config = config
  }

  serve(): Promise<void> {
    if (this.server) {
      throw new Error("Server already running")
    }

    return new Promise((resolve, reject) => {
      this.server = http.createServer(this.handleRequest.bind(this))
      this.server.once("error", reject)

      this.server.listen({ port: this.config.port, host: "0.0.0.0" }, () => {
        this.server!.removeListener("error", reject)
        resolve()
      })
    })
  }

  handleRequest = async (nodeRequest: http.IncomingMessage, nodeResponse: http.ServerResponse) => {
    const req = new Request(nodeRequest)
    const res = new Response(nodeResponse)
    const context = new Context(this, req, res)

    try {
      await context.next()
    } catch(e) {
      nodeResponse.statusCode = 500
      nodeResponse.end()
      return
    }

    res.end()
  }

  stop() {
    this.server?.close()
  }
}
