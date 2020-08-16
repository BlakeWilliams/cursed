import * as http from "http";

import { Headers } from "../index";

export default class Response {
  status: number = 200;
  headers: Headers = {};
  body: string = "";

  private nodeResponse: http.ServerResponse;

  constructor(nodeResponse: http.ServerResponse) {
    this.nodeResponse = nodeResponse;
  }

  addHeader(key: string, value: string): this {
    this.headers[key] = value;
    return this;
  }

  end() {
    this.nodeResponse.statusCode = this.status;
    // TODO handle Set-Cookie special case (array vs string)
    this.writeHeaders();
    this.nodeResponse.write(this.body);
    this.nodeResponse.end();
  }

  private writeHeaders() {
    for (const key in this.headers) {
      const value = this.headers[key];

      this.nodeResponse.setHeader(key, value);
    }
  }
}
