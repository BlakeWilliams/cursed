import * as http from 'http';

import { Headers } from "../index"

export default class Response {
  status: number = 200
  headers: Headers = {}
  body: string = ""

  private nodeResponse: http.ServerResponse

  constructor(nodeResponse: http.ServerResponse) {
    this.nodeResponse = nodeResponse
  }

  end() {
    //  TODO headers
    this.nodeResponse.statusCode = this.status
    this.nodeResponse.write(this.body)
    this.nodeResponse.end()
  }
}
