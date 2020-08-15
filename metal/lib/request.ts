import * as http from 'http';

export default class Request {
  private nodeRequest: http.IncomingMessage

  constructor(nodeRequest: http.IncomingMessage) {
    this.nodeRequest = nodeRequest
  }
}
