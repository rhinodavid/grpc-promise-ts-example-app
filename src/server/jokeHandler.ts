import * as grpc from "grpc";

import { IJokeServer, JokeService } from "../../jspb/joke_grpc_pb";
import { JokeKind, JokeRequest, JokeResponse } from "../../jspb/joke_pb";
import { dogJokes, punJokes, textJokes } from "./jokes";

import { ServiceError } from "grpc";

export const THROW_INVALID_ARGUMENT = "THROW_INVALID_ARGUMENT";
export const RESPONSE_PREFIX = "RESPONSE_";

function randomIndex(length) {
  return Math.floor(Math.random() * length);
}

class JokeHandler implements IJokeServer {
  /**
   * Return a joke of the joke kind provided in the request
   */
  getAJoke = (
    call: grpc.ServerUnaryCall<JokeRequest>,
    callback: grpc.sendUnaryData<JokeResponse>
  ): void => {
    try {
      const jokeKind = call.request.getJokeKind();
      const response = new JokeResponse();
      let jokeText: string;
      switch (jokeKind) {
        case JokeKind.DOG:
          jokeText = dogJokes[randomIndex(dogJokes.length)];
          break;
        case JokeKind.TEXT:
          jokeText = textJokes[randomIndex(textJokes.length)];
          break;
        case JokeKind.PUN:
          jokeText = punJokes[randomIndex(punJokes.length)];
          break;
        default:
          throw new Error(`Unknown joke kind: ${jokeKind}`);
      }
      response.setJoke(jokeText);
      // wait a little bit to return the message as if we're a remote server
      setTimeout(
        () => callback(null, response),
        (Math.random() * 5 + 2) * 1000
      );
    } catch (e) {
      const error: ServiceError = {
        name: "server_error",
        message: e.message,
        code: grpc.status.UNKNOWN,
      };
      callback(error, null);
      return;
    }
  };
}

export default {
  service: JokeService, // Service interface
  handler: new JokeHandler(), // Service interface definitions
};
