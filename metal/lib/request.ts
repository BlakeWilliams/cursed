import * as http from 'http';
import type { Headers } from "../index"

export default class Request {
  private nodeRequest: http.IncomingMessage
  headers: Headers

  constructor(nodeRequest: http.IncomingMessage) {
    this.nodeRequest = nodeRequest
    this.headers = {}
    this.buildHeaders()
  }

  private buildHeaders() {
    this.headers = {}

    for (const key in this.nodeRequest.headers) {
      const value = this.nodeRequest.headers[key]

      if (Array.isArray(value)) {
        this.headers[key] = value.join(", ")
      } else if(value) {
        this.headers[key] = value
      }
    }
  }
}
