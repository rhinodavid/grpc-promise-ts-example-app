import { ChannelCredentials, credentials as grpcCredentials } from "grpc";
import { JokeClient, JokePromiseClient } from "../../jspb/joke_grpc_pb";

import { convertToPromiseClient } from "grpc-promise-ts";

export function createJokePromiseClient(
  port: number,
  credentials: ChannelCredentials =  grpcCredentials.createInsecure(),
  host: string = "0.0.0.0"
): Promise<JokePromiseClient> {
  return new Promise((resolve, reject) => {
    const client = new JokeClient(
      `${host}:${port}`,
      credentials
    );
    const jokePromiseClient: JokePromiseClient = convertToPromiseClient(client);
    jokePromiseClient.waitForReady(/* dealine */Date.now() + 10000, (e) => {
      if (e) {
        reject(e);
      } else {
        resolve(jokePromiseClient);
      }
    });
  });
}
